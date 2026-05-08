// Vercel serverless function — mirrors the Vite dev proxy for production.
// Reads ANTHROPIC_API_KEY from Vercel environment variables.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicKey) {
    return res.status(503).json({ error: 'no_key' })
  }

  const { workstream, startDate, endDate, tickets } = req.body ?? {}

  const ticketList = (tickets ?? [])
    .map(t => `- [${t.status}] ${t.flowName} (${t.discipline}) — ${t.assignee}`)
    .join('\n')

  const prompt = `You are summarizing sprint progress. Given these Jira tickets for the ${workstream} work stream between ${startDate} and ${endDate}:\n${ticketList}\n\nRespond with ONLY raw JSON — no markdown, no code fences, no explanation. Start your response with { and end with }.\n{\n  "focus": "2-6 word phrase naming the flows being prioritized",\n  "completed": "short phrase of what was finished, or null if nothing done",\n  "inProgress": "short phrase of what is active right now, or null if nothing active"\n}\n\nBe specific. Name actual flow names. Keep each field under 10 words.`

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!anthropicRes.ok) {
    const text = await anthropicRes.text().catch(() => '')
    return res.status(502).json({ error: 'anthropic_error', detail: text.slice(0, 200) })
  }

  const data = await anthropicRes.json()
  const rawText = data.content?.[0]?.text ?? ''
  const cleanText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  let summary
  try { summary = JSON.parse(cleanText) } catch { summary = cleanText }
  return res.status(200).json({ summary })
}
