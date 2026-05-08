import https from 'node:https'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Custom middleware plugin — bypasses http-proxy entirely so we have full
// control over exactly which headers reach Atlassian. This avoids the XSRF
// check that fires when browser headers (Origin, Cookie, Referer, Sec-Fetch-*)
// leak through to the Atlassian endpoint.
function jiraProxyPlugin(auth, anthropicKey) {
  return {
    name: 'jira-proxy',
    configureServer(server) {
      server.middlewares.use('/api', (req, res) => {
        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
          res.writeHead(204, corsHeaders())
          res.end()
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', () => {
          // Route /api/claude/summarize → Anthropic API
          if ((req.url ?? '').startsWith('/claude/summarize')) {
            if (!anthropicKey) {
              res.writeHead(503, { 'Content-Type': 'application/json', ...corsHeaders() })
              res.end(JSON.stringify({ error: 'no_key' }))
              return
            }

            let parsed
            try { parsed = JSON.parse(body) } catch {
              res.writeHead(400, { 'Content-Type': 'application/json', ...corsHeaders() })
              res.end(JSON.stringify({ error: 'bad_request' }))
              return
            }

            const { workstream, startDate, endDate, tickets } = parsed
            const ticketList = (tickets ?? [])
              .map(t => `- [${t.status}] ${t.flowName} (${t.discipline}) — ${t.assignee}`)
              .join('\n')

            const prompt = `You are summarizing sprint progress. Given these Jira tickets for the ${workstream} work stream between ${startDate} and ${endDate}:\n${ticketList}\n\nRespond with ONLY raw JSON — no markdown, no code fences, no explanation. Start your response with { and end with }.\n{\n  "focus": "2-6 word phrase naming the flows being prioritized",\n  "completed": "short phrase of what was finished, or null if nothing done",\n  "inProgress": "short phrase of what is active right now, or null if nothing active"\n}\n\nBe specific. Name actual flow names. Keep each field under 10 words.`

            const anthropicBody = JSON.stringify({
              model: 'claude-haiku-4-5-20251001',
              max_tokens: 200,
              messages: [{ role: 'user', content: prompt }],
            })

            const options = {
              hostname: 'api.anthropic.com',
              port: 443,
              path: '/v1/messages',
              method: 'POST',
              headers: {
                'x-api-key': anthropicKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(anthropicBody),
              },
            }

            const proxyReq = https.request(options, proxyRes => {
              let data = ''
              proxyRes.on('data', chunk => { data += chunk })
              proxyRes.on('end', () => {
                try {
                  const anthropicData = JSON.parse(data)
                  const rawText = anthropicData.content?.[0]?.text ?? ''
                  // Strip markdown code fences Claude sometimes adds
                  const cleanText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
                  // Try to parse Claude's JSON response; fall back to raw string
                  let summary
                  try { summary = JSON.parse(cleanText) } catch { summary = cleanText }
                  res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders() })
                  res.end(JSON.stringify({ summary }))
                } catch {
                  res.writeHead(502, { 'Content-Type': 'application/json', ...corsHeaders() })
                  res.end(JSON.stringify({ error: 'parse_error' }))
                }
              })
            })

            proxyReq.on('error', err => {
              res.writeHead(502, { 'Content-Type': 'application/json', ...corsHeaders() })
              res.end(JSON.stringify({ error: err.message }))
            })

            proxyReq.write(anthropicBody)
            proxyReq.end()
            return
          }

          // Default: proxy to Jira
          const jiraPath = '/rest/api/3' + (req.url ?? '')

          const options = {
            hostname: 'radiantexp.atlassian.net',
            port: 443,
            path: jiraPath,
            method: req.method,
            // Only send what we explicitly set — no browser headers leak through
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Atlassian-Token': 'no-check',
              ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {}),
            },
          }

          const proxyReq = https.request(options, proxyRes => {
            res.writeHead(proxyRes.statusCode, {
              'Content-Type': 'application/json',
              ...corsHeaders(),
            })
            proxyRes.pipe(res)
          })

          proxyReq.on('error', err => {
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err.message }))
          })

          if (body) proxyReq.write(body)
          proxyReq.end()
        })
      })
    },
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const auth = Buffer.from(`${env.JIRA_EMAIL}:${env.JIRA_TOKEN}`).toString('base64')
  const anthropicKey = env.ANTHROPIC_API_KEY ?? ''

  return {
    plugins: [react(), jiraProxyPlugin(auth, anthropicKey)],
    server: {
      port: 5200,
      strictPort: false,
    },
  }
})
