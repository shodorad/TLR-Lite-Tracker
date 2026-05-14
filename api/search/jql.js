export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()

  const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_TOKEN}`).toString('base64')

  const jiraRes = await fetch('https://radiantexp.atlassian.net/rest/api/3/search/jql', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Atlassian-Token': 'no-check',
    },
    body: JSON.stringify(req.body),
  })

  const data = await jiraRes.json()
  return res.status(jiraRes.status).json(data)
}
