import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const kbPath = resolve(root, 'src/data/knowledge-base.json')
const tasksPath = resolve(root, 'src/data/tasks.json')

const knowledgeBase = JSON.parse(readFileSync(kbPath, 'utf8'))
const tasks = JSON.parse(readFileSync(tasksPath, 'utf8'))

const requiredDocFields = ['id', 'title', 'section', 'path', 'summary', 'status', 'owner', 'updated']
const requiredTaskFields = ['id', 'title', 'area', 'priority', 'status', 'assignee', 'assignedBy', 'due', 'docId']
const docIds = new Set()
const errors = []

for (const doc of knowledgeBase) {
  for (const field of requiredDocFields) {
    if (!doc[field]) errors.push(`knowledge-base: ${doc.id || '(missing id)'} missing ${field}`)
  }
  if (docIds.has(doc.id)) errors.push(`knowledge-base: duplicate id ${doc.id}`)
  docIds.add(doc.id)
  if (doc.path && !existsSync(resolve(root, doc.path))) {
    errors.push(`knowledge-base: missing markdown file ${doc.path}`)
  }
}

for (const task of tasks) {
  for (const field of requiredTaskFields) {
    if (!task[field]) errors.push(`tasks: ${task.id || '(missing id)'} missing ${field}`)
  }
  if (task.docId && !docIds.has(task.docId)) {
    errors.push(`tasks: ${task.id} references unknown docId ${task.docId}`)
  }
}

const assetChecks = [
  'public/nova-poses/idle.png',
  'public/nova-poses/wave.png',
  'public/nova-poses/thinking.png',
  'public/nova-poses/celebrating.png',
  'public/nova-brand/nova-mark-transparent-2048.png',
]

for (const assetPath of assetChecks) {
  if (!existsSync(resolve(root, assetPath))) {
    errors.push(`asset missing: ${assetPath}`)
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`Validated ${knowledgeBase.length} docs, ${tasks.length} seed tasks, and ${assetChecks.length} mascot/theme assets.`)

