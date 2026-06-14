import { readFile } from 'node:fs/promises'

const repo = process.env.GITHUB_REPOSITORY
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

if (!repo) throw new Error('GITHUB_REPOSITORY is required')
if (!token) throw new Error('GITHUB_TOKEN or GH_TOKEN is required')

const apiBase = `https://api.github.com/repos/${repo}`
const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
}

const taskFile = new URL('../src/data/tasks.json', import.meta.url)
const tasks = JSON.parse(await readFile(taskFile, 'utf8'))

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

const labels = [
  ['task', '0ea5e9', 'Shared Yaomin onboarding task'],
  ['weekly-update', 'fbbf24', 'Weekly progress report'],
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

for (const [name, color, description] of labels) {
  await ensureLabel(name, color, description)
}

const existingIssues = await request('/issues?state=all&per_page=100')
const existingTitles = new Set(
  existingIssues
    .filter((issue) => !issue.pull_request)
    .map((issue) => issue.title.trim().toLowerCase()),
)

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const statusLabel = (status) => `status:${slug(status)}`
const priorityLabel = (priority) => `priority:${slug(priority)}`
const areaLabel = (area) => `area:${slug(area)}`

const bodyFor = (task) => `# ${task.title}

Seeded from the Yaomin-YNova dashboard task list.

## Goal

${task.notes}

## Acceptance Criteria

- [ ] Yaomin posts a progress comment or review note.
- [ ] Tamil can verify the outcome from the issue comments or linked artifact.
- [ ] The issue status label reflects the current state.

## Metadata

- Assignee: ${task.assignee}
- Assigned by: ${task.assignedBy}
- Area: ${task.area}
- Priority: ${task.priority}
- Local dashboard id: ${task.id}
- Linked knowledge doc: ${task.docId}
- Due date: ${task.due}
`

let createdCount = 0
let skippedCount = 0

for (const task of tasks) {
  const title = `[Task] ${task.title}`
  if (existingTitles.has(title.toLowerCase())) {
    skippedCount += 1
    continue
  }

  const created = await request('/issues', {
    method: 'POST',
    body: JSON.stringify({
      title,
      body: bodyFor(task),
      labels: ['task', statusLabel(task.status), priorityLabel(task.priority), areaLabel(task.area)],
    }),
  })
  createdCount += 1

  if (task.status === 'Done') {
    await request(`/issues/${created.number}`, {
      method: 'PATCH',
      body: JSON.stringify({ state: 'closed' }),
    })
  }
}

console.log(`Seed complete: created ${createdCount}, skipped ${skippedCount}`)
