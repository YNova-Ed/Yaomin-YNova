const repo = process.env.GITHUB_REPOSITORY
const token = process.env.GITHUB_TOKEN
const issueNumber = process.env.ISSUE_NUMBER

if (!repo) throw new Error('GITHUB_REPOSITORY is required')
if (!token) throw new Error('GITHUB_TOKEN is required')
if (!issueNumber) throw new Error('ISSUE_NUMBER is required')

const apiBase = `https://api.github.com/repos/${repo}`
const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${body}`)
  }
  return response.status === 204 ? null : response.json()
}

async function ensureLabel(name, color, description) {
  const encoded = encodeURIComponent(name)
  const response = await fetch(`${apiBase}/labels/${encoded}`, { headers })
  if (response.status === 200) return
  if (response.status !== 404) {
    throw new Error(`label lookup failed for ${name}: ${response.status} ${await response.text()}`)
  }
  await request('/labels', {
    method: 'POST',
    body: JSON.stringify({ name, color, description }),
  })
}

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function readIssueFormValue(body, heading) {
  const pattern = new RegExp(`### ${heading}\\n\\n([\\s\\S]*?)(?=\\n\\n### |$)`, 'i')
  const match = body.match(pattern)
  return match?.[1]?.trim().split('\n')[0]?.trim() || ''
}

function readMetadataValue(body, key) {
  const pattern = new RegExp(`^- ${key}:\\s*(.+)$`, 'im')
  const match = body.match(pattern)
  return match?.[1]?.trim() || ''
}

const issue = await request(`/issues/${issueNumber}`)
const existingLabels = issue.labels.map((label) => label.name)
if (!existingLabels.includes('task')) {
  console.log(`Issue #${issueNumber} is not a task issue; no label sync needed.`)
  process.exit(0)
}

const dashboardLabels = [
  ['task', '0ea5e9', 'Shared Yaomin onboarding task'],
  ['status:todo', 'e4e7ec', 'Task not started'],
  ['status:in-progress', '7dd3fc', 'Task in progress'],
  ['status:in-review', 'fbbf24', 'Task in review'],
  ['status:done', '16a34a', 'Task complete'],
  ['priority:high', 'dc2626', 'High priority'],
  ['priority:medium', 'f59e0b', 'Medium priority'],
  ['priority:low', '16a34a', 'Low priority'],
  ['area:onboarding', '7dd3fc', 'Onboarding task'],
  ['area:product', '0ea5e9', 'Product task'],
  ['area:engineering', '6366f1', 'Engineering task'],
  ['area:ai-architecture', '8b5cf6', 'AI architecture task'],
  ['area:design', 'ec4899', 'Design task'],
  ['area:operations', '64748b', 'Operations task'],
]

for (const [name, color, description] of dashboardLabels) {
  await ensureLabel(name, color, description)
}

const area = readIssueFormValue(issue.body || '', 'Area') || readMetadataValue(issue.body || '', 'Area')
const priority = readIssueFormValue(issue.body || '', 'Priority') || readMetadataValue(issue.body || '', 'Priority')
const syncedLabels = []

if (area) syncedLabels.push(`area:${slug(area)}`)
if (priority) syncedLabels.push(`priority:${slug(priority)}`)
if (!existingLabels.some((label) => label.startsWith('status:'))) syncedLabels.push('status:todo')

const cleanedLabels = existingLabels.filter((label) => {
  if (label.startsWith('area:')) return false
  if (label.startsWith('priority:')) return false
  return true
})

const nextLabels = [...new Set([...cleanedLabels, ...syncedLabels])]

await request(`/issues/${issueNumber}`, {
  method: 'PATCH',
  body: JSON.stringify({ labels: nextLabels }),
})

console.log(`Synced labels for issue #${issueNumber}: ${nextLabels.join(', ')}`)
