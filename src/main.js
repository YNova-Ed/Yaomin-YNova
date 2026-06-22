import './styles.css'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { createIcons, icons } from 'lucide'
import seedTasks from './data/tasks.json'
import { knowledgeBase } from './data/kb'

const TASK_STORAGE_KEY = 'yaomin-ynova.tasks.v1'
const THEME_STORAGE_KEY = 'yaomin-ynova.theme.v1'
const SESSION_STORAGE_KEY = 'yaomin-ynova.session.v1'
const AUTH_SALT = 'yaomin-ynova-static-auth-v1'
const BASE_URL = import.meta.env.BASE_URL || './'
const GITHUB_REPO = 'YNova-Ed/Yaomin-YNova'
const GITHUB_WEB_URL = `https://github.com/${GITHUB_REPO}`
const GITHUB_ISSUES_API = `https://api.github.com/repos/${GITHUB_REPO}/issues?state=all&per_page=100`
const STATUS_ORDER = ['Todo', 'In Progress', 'In Review', 'Done']
const PRIORITY_ORDER = ['High', 'Medium', 'Low']
const AUTH_ACCOUNTS = [
  {
    login: 'tamil@ynova.ai',
    email: 'Tamil@ynova.ai',
    name: 'Tamil',
    role: 'Founder / CTO',
    passwordHash: 'c11abe295cc2682674ce41f083ccdbe826b10f7c4370522ba7115d5b74da1016',
  },
  {
    login: 'tamil@ynova.i',
    email: 'Tamil@ynova.ai',
    name: 'Tamil',
    role: 'Founder / CTO',
    passwordHash: '6e24e5b107f8c80c472183555728c59cfe0a219bd94669445b011e0eaf9379a2',
  },
  {
    login: 'yaomin@ynova.ai',
    email: 'Yaomin@ynova.ai',
    name: 'Yaomin',
    role: 'Product Intern',
    passwordHash: 'ec0364d3eda81900bdd7ab14a3cf7d0c3e4ac301b8d274fa7ce3cecea39577bf',
  },
]
marked.use({
  gfm: true,
  breaks: false,
  mangle: false,
  headerIds: true,
})

const app = document.querySelector('#app')

const state = {
  tasks: loadTasks(),
  session: loadSession(),
  authError: '',
  github: {
    status: 'idle',
    issues: [],
    error: '',
    loadedAt: '',
  },
  selectedDocId: 'ynova-mbs-architecture',
  selectedTaskId: null,
  activeView: 'read',
  navOpen: false,
  statusFilter: 'All',
  query: '',
  markdown: '',
  markdownLoading: true,
  markdownError: '',
  theme: loadTheme(),
}

applyTheme(state.theme)
selectDoc(state.selectedDocId)
if (state.session) {
  void loadGitHubIssues()
}

app.addEventListener('click', (event) => {
  const docButton = event.target.closest('[data-doc-id]')
  const actionButton = event.target.closest('[data-action]')
  const taskButton = event.target.closest('[data-task-id]')

  if (!state.session && actionButton?.dataset.action !== 'theme') return

  if (docButton) {
    state.activeView = 'read'
    state.navOpen = false
    selectDoc(docButton.dataset.docId)
    return
  }

  if (taskButton && taskButton.dataset.taskId) {
    state.selectedTaskId = taskButton.dataset.taskId
    state.selectedDocId = findTask(taskButton.dataset.taskId)?.docId || state.selectedDocId
    state.activeView = 'read'
    state.navOpen = false
    render()
    return
  }

  if (!actionButton) return

  const action = actionButton.dataset.action
  if (action === 'filter') {
    state.statusFilter = actionButton.dataset.status || 'All'
    render()
  }
  if (action === 'view') {
    state.activeView = actionButton.dataset.view === 'manage' ? 'manage' : 'read'
    state.navOpen = false
    render()
  }
  if (action === 'toggle-nav') {
    state.navOpen = !state.navOpen
    render()
  }
  if (action === 'delete-task') {
    deleteTask(actionButton.dataset.id)
  }
  if (action === 'reset-tasks') {
    state.tasks = seedTasks.map((task) => ({ ...task }))
    saveTasks()
    state.selectedTaskId = null
    render()
  }
  if (action === 'export-tasks') {
    exportTasks()
  }
  if (action === 'theme') {
    state.theme = state.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem(THEME_STORAGE_KEY, state.theme)
    applyTheme(state.theme)
    render()
  }
  if (action === 'refresh-github') {
    void loadGitHubIssues()
  }
  if (action === 'logout') {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    state.session = null
    state.authError = ''
    render()
  }
})

app.addEventListener('input', (event) => {
  const input = event.target
  if (input.matches('[data-search]')) {
    state.query = input.value
    render()
  }
})

app.addEventListener('change', (event) => {
  const control = event.target
  if (control.matches('[data-status-select]')) {
    updateTask(control.dataset.id, { status: control.value })
  }
  if (control.matches('[data-priority-select]')) {
    updateTask(control.dataset.id, { priority: control.value })
  }
})

app.addEventListener('submit', async (event) => {
  const form = event.target
  if (form.matches('[data-login-form]')) {
    event.preventDefault()
    const formData = new FormData(form)
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')
    const session = await authenticate(email, password)
    if (!session) {
      state.authError = 'The username or password did not match a configured YNova account.'
      render()
      return
    }
    state.session = session
    state.authError = ''
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    void loadGitHubIssues()
    render()
    return
  }

  if (!state.session) return

  if (form.matches('[data-review-form]')) {
    event.preventDefault()
    const formData = new FormData(form)
    const taskId = String(formData.get('taskId') || '')
    const status = String(formData.get('status') || 'In Review')
    const note = String(formData.get('note') || '').trim()
    if (!taskId || !note) return
    addReviewNote(taskId, status, note)
    form.reset()
    render()
    return
  }

  if (!form.matches('[data-add-task-form]')) return
  event.preventDefault()

  const formData = new FormData(form)
  const docId = String(formData.get('docId') || 'ynova-mbs-architecture')
  const doc = findDoc(docId) || knowledgeBase[0]
  const title = String(formData.get('title') || '').trim()
  if (!title) return

  const nextTask = {
    id: `task-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
    title,
    area: doc.section,
    priority: String(formData.get('priority') || 'Medium'),
    status: 'Todo',
    assignee: 'Yaomin',
    assignedBy: state.session.name,
    due: String(formData.get('due') || '').trim() || new Date().toISOString().slice(0, 10),
    docId,
    notes: String(formData.get('notes') || '').trim() || 'Assigned from the Yaomin-YNova dashboard.',
    createdBy: state.session.name,
    createdAt: new Date().toISOString(),
    reviewLog: [],
  }

  state.tasks = [nextTask, ...state.tasks]
  state.selectedTaskId = nextTask.id
  saveTasks()
  form.reset()
  render()
})

async function selectDoc(docId) {
  const doc = findDoc(docId) || knowledgeBase[0]
  state.selectedDocId = doc.id
  state.markdown = ''
  state.markdownError = ''
  state.markdownLoading = true
  state.selectedTaskId = null
  render()

  try {
    const module = await doc.load()
    state.markdown = module.default
  } catch (error) {
    state.markdownError = error instanceof Error ? error.message : 'Could not load markdown.'
  } finally {
    state.markdownLoading = false
    render()
  }
}

function render() {
  if (!state.session) {
    app.innerHTML = renderLogin()
    createIcons({ icons })
    return
  }

  const selectedDoc = findDoc(state.selectedDocId) || knowledgeBase[0]
  const selectedTask = state.selectedTaskId ? findTask(state.selectedTaskId) : null
  const filteredTasks = visibleTasks()
  const stats = taskStats(state.tasks)
  const nextFocus = state.tasks
    .filter((task) => task.status !== 'Done')
    .sort((a, b) => priorityWeight(a.priority) - priorityWeight(b.priority) || a.due.localeCompare(b.due))
    .slice(0, 3)

  app.innerHTML = `
    <div class="app-shell ${state.navOpen ? 'nav-is-open' : ''}">
      ${renderSidebar(selectedDoc)}
      <button class="mobile-nav-backdrop" type="button" data-action="toggle-nav" aria-label="Close navigation"></button>
      <main class="workspace" id="main-content">
        ${renderTopBar()}
        ${renderHeader()}
        ${renderProgressStrip(stats)}
        ${state.activeView === 'manage'
          ? renderManageView(filteredTasks)
          : renderReadView(selectedDoc, selectedTask, nextFocus)}
      </main>
    </div>
  `

  createIcons({ icons })
}

function renderLogin() {
  return `
    <main class="login-shell" aria-labelledby="login-title">
      <section class="login-card">
        <div class="login-mascot" aria-hidden="true">
          <img src="${assetUrl('nova-poses/wave.png')}" alt="" />
        </div>
        <div class="brand-row login-brand">
          <img src="${assetUrl('nova-brand/nova-mark-transparent-2048.png')}" alt="" />
          <div>
            <strong>YNova</strong>
            <span>Yaomin Onboarding Hub</span>
          </div>
        </div>
        <p class="eyebrow">Private working space</p>
        <h1 id="login-title">Sign in to manage Yaomin's onboarding.</h1>
        <p class="lede">Use the YNova credentials Tamil configured for this static GitHub Pages hub. This gate is lightweight and should not store confidential student data.</p>
        ${state.authError ? `<p class="auth-error" role="alert">${escapeHtml(state.authError)}</p>` : ''}
        <form class="login-form" data-login-form>
          <label>
            <span>Email</span>
            <input name="email" type="email" required autocomplete="username" placeholder="Tamil@ynova.ai" />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" required autocomplete="current-password" placeholder="Enter password" />
          </label>
          <button class="primary-button" type="submit">
            <i data-lucide="log-in" aria-hidden="true"></i>
            <span>Sign in</span>
          </button>
        </form>
        <p class="security-note">Security note: static-site authentication is a convenience gate, not a private data boundary. Use GitHub private repos or real server auth for sensitive material.</p>
      </section>
    </main>
  `
}

function renderSidebar(selectedDoc) {
  const grouped = groupBy(knowledgeBase, 'section')
  const groups = Object.entries(grouped)
    .map(([section, docs]) => `
      <section class="nav-section">
        <p class="nav-section-title">${escapeHtml(section)}</p>
        <div class="nav-list">
          ${docs.map((doc) => `
            <button
              class="nav-item ${doc.id === selectedDoc.id ? 'is-active' : ''}"
              type="button"
              data-doc-id="${escapeHtml(doc.id)}"
              aria-current="${doc.id === selectedDoc.id ? 'page' : 'false'}"
            >
              <i data-lucide="${iconForSection(doc.section)}" aria-hidden="true"></i>
              <span>${escapeHtml(doc.title)}</span>
            </button>
          `).join('')}
        </div>
      </section>
    `)
    .join('')

  return `
    <aside class="sidebar" aria-label="Knowledge base navigation">
      <a class="skip-link" href="#main-content">Skip to main content</a>
      <div class="sidebar-top">
        <div class="brand-row">
          <img src="${assetUrl('nova-brand/nova-mark-transparent-2048.png')}" alt="" />
          <div>
            <strong>YNova</strong>
            <span>Yaomin Hub</span>
          </div>
        </div>
        <button class="icon-button nav-close" type="button" data-action="toggle-nav" aria-label="Close navigation">
          <i data-lucide="x" aria-hidden="true"></i>
        </button>
      </div>
      <div class="signed-in-card">
        <img src="${assetUrl(state.session.name === 'Tamil' ? 'nova-poses/pointing.png' : 'nova-poses/reading.png')}" alt="" />
        <div>
          <strong>${escapeHtml(state.session.name)}</strong>
          <span>${escapeHtml(state.session.role)}</span>
        </div>
      </div>
      <label class="search-box">
        <i data-lucide="search" aria-hidden="true"></i>
        <span class="sr-only">Search docs and tasks</span>
        <input data-search type="search" value="${escapeAttribute(state.query)}" placeholder="Search docs, tasks, code..." />
      </label>
      ${groups}
      <div class="sidebar-footer">
        <button class="icon-text-button" type="button" data-action="logout">
          <i data-lucide="log-out" aria-hidden="true"></i>
          <span>Sign out</span>
        </button>
        <button class="icon-text-button" type="button" data-action="theme">
          <i data-lucide="${state.theme === 'dark' ? 'sun' : 'moon'}" aria-hidden="true"></i>
          <span>${state.theme === 'dark' ? 'Light theme' : 'Dark theme'}</span>
        </button>
      </div>
    </aside>
  `
}

function renderTopBar() {
  return `
    <nav class="topbar" aria-label="Primary workspace controls">
      <button class="icon-button nav-toggle" type="button" data-action="toggle-nav" aria-label="Open navigation">
        <i data-lucide="menu" aria-hidden="true"></i>
      </button>
      <div class="topbar-title">
        <strong>YNova Hub</strong>
        <span>${state.activeView === 'manage' ? 'Manage work' : 'Read and focus'}</span>
      </div>
      ${renderViewTabs()}
      <a class="secondary-button topbar-github" href="${GITHUB_WEB_URL}" target="_blank" rel="noreferrer">
        <i data-lucide="github" aria-hidden="true"></i>
        <span>GitHub</span>
      </a>
    </nav>
  `
}

function renderViewTabs() {
  return `
    <div class="view-tabs" role="tablist" aria-label="Workspace view">
      <button
        type="button"
        role="tab"
        aria-selected="${state.activeView === 'read'}"
        class="${state.activeView === 'read' ? 'is-active' : ''}"
        data-action="view"
        data-view="read"
      >
        <i data-lucide="book-open" aria-hidden="true"></i>
        <span>Read</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected="${state.activeView === 'manage'}"
        class="${state.activeView === 'manage' ? 'is-active' : ''}"
        data-action="view"
        data-view="manage"
      >
        <i data-lucide="layout-dashboard" aria-hidden="true"></i>
        <span>Manage</span>
      </button>
    </div>
  `
}

function renderHeader() {
  return `
    <header class="page-header">
      <div>
        <p class="eyebrow">Signed in as ${escapeHtml(state.session.name)}</p>
        <h1>Yaomin Onboarding</h1>
        <p class="lede">A focused handoff hub for learning YNova MBS, shipping product work, and collaborating with AI agents responsibly.</p>
      </div>
    </header>
  `
}

function renderProgressStrip(stats) {
  const items = [
    { label: 'Done', value: stats.done, tone: 'green' },
    { label: 'In Progress', value: stats.inProgress, tone: 'sky' },
    { label: 'In Review', value: stats.inReview, tone: 'amber' },
    { label: 'Todo', value: stats.todo, tone: 'neutral' },
  ]

  return `
    <section class="progress-strip" aria-label="Task progress">
      <div class="progress-summary">
        <span>Completion</span>
        <strong>${stats.completion}%</strong>
      </div>
      <div class="progress-items">
        ${items.map((item) => `
          <div class="progress-item progress-${item.tone}">
            <span class="priority-dot priority-${item.tone === 'green' ? 'low' : item.tone === 'amber' ? 'medium' : item.tone === 'sky' ? 'progress' : 'neutral'}"></span>
            <strong>${item.value}</strong>
            <span>${item.label}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `
}

function renderReadView(selectedDoc, selectedTask, nextFocus) {
  return `
    <div class="read-layout">
      <div class="read-primary">
        ${renderNextFocus(nextFocus)}
        ${renderMarkdownPanel(selectedDoc)}
      </div>
      <aside class="read-context" aria-label="Selected document context">
        ${selectedTask ? renderSelectedTaskCard(selectedTask) : ''}
        ${renderDocSummaryCard(selectedDoc)}
        ${renderLinkedTasksCard(selectedDoc)}
      </aside>
    </div>
  `
}

function renderManageView(filteredTasks) {
  return `
    <div class="manage-layout">
      <section class="panel manage-intro" aria-labelledby="manage-title">
        <div>
          <p class="eyebrow">Manage</p>
          <h2 id="manage-title">Shared work, local tasks, and review tools.</h2>
          <p>Use this view when you need to sync GitHub Issues, assign local work, add review notes, or update task status.</p>
        </div>
      </section>
      ${renderSharedUpdates()}
      <div class="tool-grid">
        ${renderAssignmentConsole()}
        ${renderReviewDesk()}
      </div>
      ${renderTaskBoard(filteredTasks)}
    </div>
  `
}

function renderSharedUpdates() {
  const taskIssues = state.github.issues.filter((issue) => issue.kind === 'task')
  const weeklyUpdates = state.github.issues.filter((issue) => issue.kind === 'weekly-update')
  const openTasks = taskIssues.filter((issue) => issue.state === 'open' && issue.status !== 'Done')
  const doneTasks = taskIssues.filter((issue) => issue.state === 'closed' || issue.status === 'Done')
  const latestWeekly = weeklyUpdates[0]
  const statusText = state.github.status === 'loading'
    ? 'Loading GitHub updates...'
    : state.github.status === 'error'
      ? state.github.error
      : state.github.loadedAt
        ? `Synced ${formatDateTime(state.github.loadedAt)}`
        : 'Not synced yet'

  return `
    <section class="panel shared-updates" aria-labelledby="shared-updates-title">
      <div class="section-heading">
        <div>
          <h2 id="shared-updates-title">Shared Weekly And Task Updates</h2>
          <p>Free durable updates come from GitHub Issues. Local dashboard edits still stay in this browser until exported or copied into an issue.</p>
          <p class="inline-note">${escapeHtml(statusText)}</p>
        </div>
        <div class="button-row">
          <button class="secondary-button" type="button" data-action="refresh-github">
            <i data-lucide="refresh-cw" aria-hidden="true"></i>
            <span>Refresh</span>
          </button>
          <a class="secondary-button" href="${GITHUB_WEB_URL}/issues/new?template=task.yml" target="_blank" rel="noreferrer">
            <i data-lucide="plus" aria-hidden="true"></i>
            <span>GitHub task</span>
          </a>
          <a class="secondary-button" href="${GITHUB_WEB_URL}/issues/new?template=weekly_update.yml" target="_blank" rel="noreferrer">
            <i data-lucide="calendar-plus" aria-hidden="true"></i>
            <span>Weekly update</span>
          </a>
        </div>
      </div>
      <div class="sync-grid">
        <article>
          <span>Open GitHub Tasks</span>
          <strong>${openTasks.length}</strong>
        </article>
        <article>
          <span>Completed GitHub Tasks</span>
          <strong>${doneTasks.length}</strong>
        </article>
        <article>
          <span>Weekly Updates</span>
          <strong>${weeklyUpdates.length}</strong>
        </article>
      </div>
      ${latestWeekly ? `
        <a class="weekly-card" href="${escapeAttribute(latestWeekly.url)}" target="_blank" rel="noreferrer">
          <span>Latest weekly update</span>
          <strong>${escapeHtml(latestWeekly.title)}</strong>
          <p>${escapeHtml(latestWeekly.excerpt)}</p>
        </a>
      ` : `
        <p class="empty-state">No weekly update issue found yet. Use the weekly update button or wait for the scheduled workflow.</p>
      `}
      ${taskIssues.length > 0 ? `
        <div class="github-task-list" aria-label="Live GitHub task issues">
          ${taskIssues.slice(0, 6).map((issue) => `
            <a href="${escapeAttribute(issue.url)}" target="_blank" rel="noreferrer">
              <span class="priority-dot priority-${issue.priority.toLowerCase()}"></span>
              <span>${escapeHtml(issue.title)}</span>
              <strong>${escapeHtml(issue.status)}</strong>
            </a>
          `).join('')}
        </div>
      ` : ''}
    </section>
  `
}

function renderNextFocus(tasks) {
  return `
    <section class="panel next-focus" aria-labelledby="next-focus-title">
      <div class="section-heading">
        <div>
          <h2 id="next-focus-title">Next Focus</h2>
          <p>Highest leverage tasks for Yaomin this week.</p>
        </div>
        <i data-lucide="target" aria-hidden="true"></i>
      </div>
      <div class="focus-list">
        ${tasks.map((task) => `
          <button class="focus-row" type="button" data-task-id="${escapeHtml(task.id)}">
            <span class="priority-dot priority-${task.priority.toLowerCase()}"></span>
            <span>${escapeHtml(task.title)}</span>
            <strong>${escapeHtml(task.due)}</strong>
          </button>
        `).join('')}
      </div>
    </section>
  `
}

function renderAssignmentConsole() {
  return `
    <details class="panel tool-panel assignment-console">
      <summary>
        <div>
          <h2>Assign Local Task</h2>
          <p>Add a new local task for Yaomin. Changes are saved in this browser.</p>
        </div>
        <i data-lucide="chevron-down" aria-hidden="true"></i>
      </summary>
      <div class="tool-body">
        <div class="button-row">
          <button class="secondary-button" type="button" data-action="export-tasks">
            <i data-lucide="download" aria-hidden="true"></i>
            <span>Export</span>
          </button>
          <button class="secondary-button" type="button" data-action="reset-tasks">
            <i data-lucide="rotate-ccw" aria-hidden="true"></i>
            <span>Reset seed</span>
          </button>
        </div>
        <p class="inline-note">Current author: ${escapeHtml(state.session.name)}</p>
      <form class="task-form" data-add-task-form>
        <label>
          <span>Task title</span>
          <input name="title" required maxlength="140" placeholder="Assign a clear outcome..." />
        </label>
        <label>
          <span>Doc link</span>
          <select name="docId">
            ${knowledgeBase.map((doc) => `<option value="${escapeAttribute(doc.id)}">${escapeHtml(doc.title)}</option>`).join('')}
          </select>
        </label>
        <label>
          <span>Priority</span>
          <select name="priority">
            ${PRIORITY_ORDER.map((priority) => `<option value="${priority}">${priority}</option>`).join('')}
          </select>
        </label>
        <label>
          <span>Due date</span>
          <input name="due" type="date" />
        </label>
        <label class="form-wide">
          <span>Notes</span>
          <input name="notes" maxlength="220" placeholder="Acceptance criteria, context, or handoff notes..." />
        </label>
        <button class="primary-button" type="submit">
          <i data-lucide="plus" aria-hidden="true"></i>
          <span>Assign task</span>
        </button>
      </form>
      </div>
    </details>
  `
}

function renderReviewDesk() {
  const openTasks = state.tasks.filter((task) => task.status !== 'Done')
  const tasksForSelect = openTasks.length > 0 ? openTasks : state.tasks
  return `
    <details class="panel tool-panel review-desk">
      <summary>
        <div>
          <h2>Review Desk</h2>
          <p>Tamil and Yaomin can add review notes, mark work in review, or close tasks after verification.</p>
        </div>
        <i data-lucide="chevron-down" aria-hidden="true"></i>
      </summary>
      <div class="tool-body">
      <form class="review-form" data-review-form>
        <label>
          <span>Task</span>
          <select name="taskId" required>
            ${tasksForSelect.map((task) => `<option value="${escapeAttribute(task.id)}">${escapeHtml(task.title)}</option>`).join('')}
          </select>
        </label>
        <label>
          <span>Move status to</span>
          <select name="status" required>
            ${STATUS_ORDER.map((status) => `<option value="${status}" ${status === 'In Review' ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
        </label>
        <label class="form-wide">
          <span>Review note</span>
          <input name="note" required maxlength="260" placeholder="What changed, what was checked, or what needs Tamil's decision..." />
        </label>
        <button class="primary-button" type="submit">
          <i data-lucide="send" aria-hidden="true"></i>
          <span>Add review</span>
        </button>
      </form>
      </div>
    </details>
  `
}

function renderTaskBoard(tasks) {
  return `
    <section class="panel task-board" aria-labelledby="task-board-title">
      <div class="section-heading">
        <div>
          <h2 id="task-board-title">Task Board</h2>
          <p>Notion-style task tracking with local persistence.</p>
        </div>
        <div class="filter-tabs" role="tablist" aria-label="Task status filter">
          ${['All', ...STATUS_ORDER].map((status) => `
            <button
              type="button"
              data-action="filter"
              data-status="${status}"
              class="${state.statusFilter === status ? 'is-active' : ''}"
            >${status}</button>
          `).join('')}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Area</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            ${tasks.map((task) => renderTaskRow(task)).join('')}
          </tbody>
        </table>
      </div>
      <div class="task-card-list">
        ${tasks.map((task) => renderTaskCard(task)).join('')}
      </div>
      ${tasks.length === 0 ? '<p class="empty-state">No tasks match this filter.</p>' : ''}
    </section>
  `
}

function renderTaskCard(task) {
  const doc = findDoc(task.docId)
  return `
    <article class="task-card-mobile">
      <button class="task-title-button" type="button" data-task-id="${escapeHtml(task.id)}">
        <i data-lucide="list-checks" aria-hidden="true"></i>
        <span>${escapeHtml(task.title)}</span>
      </button>
      <p>${escapeHtml(doc?.title || task.area)} · Due ${escapeHtml(task.due)}</p>
      <div class="task-card-controls">
        <label>
          <span>Priority</span>
          <select data-priority-select data-id="${escapeAttribute(task.id)}" aria-label="Priority for ${escapeAttribute(task.title)}">
            ${PRIORITY_ORDER.map((priority) => `<option value="${priority}" ${priority === task.priority ? 'selected' : ''}>${priority}</option>`).join('')}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select data-status-select data-id="${escapeAttribute(task.id)}" aria-label="Status for ${escapeAttribute(task.title)}">
            ${STATUS_ORDER.map((status) => `<option value="${status}" ${status === task.status ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
        </label>
      </div>
    </article>
  `
}

function renderTaskRow(task) {
  const doc = findDoc(task.docId)
  return `
    <tr>
      <td>
        <button class="task-title-button" type="button" data-task-id="${escapeHtml(task.id)}">
          <i data-lucide="list-checks" aria-hidden="true"></i>
          <span>${escapeHtml(task.title)}</span>
        </button>
      </td>
      <td>${escapeHtml(doc?.title || task.area)}</td>
      <td>
        <select data-priority-select data-id="${escapeAttribute(task.id)}" aria-label="Priority for ${escapeAttribute(task.title)}">
          ${PRIORITY_ORDER.map((priority) => `<option value="${priority}" ${priority === task.priority ? 'selected' : ''}>${priority}</option>`).join('')}
        </select>
      </td>
      <td>
        <select data-status-select data-id="${escapeAttribute(task.id)}" aria-label="Status for ${escapeAttribute(task.title)}">
          ${STATUS_ORDER.map((status) => `<option value="${status}" ${status === task.status ? 'selected' : ''}>${status}</option>`).join('')}
        </select>
      </td>
      <td>${escapeHtml(task.due)}</td>
      <td class="row-actions">
        <button class="icon-button" type="button" data-task-id="${escapeHtml(task.id)}" aria-label="View task details">
          <i data-lucide="panel-right-open" aria-hidden="true"></i>
        </button>
        <button class="icon-button danger" type="button" data-action="delete-task" data-id="${escapeHtml(task.id)}" aria-label="Delete task">
          <i data-lucide="trash-2" aria-hidden="true"></i>
        </button>
      </td>
    </tr>
  `
}

function renderMarkdownPanel(doc) {
  const preparedMarkdown = prepareMarkdown(state.markdown)
  const content = state.markdownLoading
    ? '<div class="markdown-loading">Loading markdown...</div>'
    : state.markdownError
      ? `<div class="markdown-error">Could not load markdown: ${escapeHtml(state.markdownError)}</div>`
      : DOMPurify.sanitize(marked.parse(preparedMarkdown))

  return `
    <article class="panel markdown-panel" aria-labelledby="markdown-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">${escapeHtml(doc.section)}</p>
          <h2 id="markdown-title">${escapeHtml(doc.title)}</h2>
        </div>
        <a class="secondary-button" href="${escapeAttribute(doc.path)}" target="_blank" rel="noreferrer">
          <i data-lucide="external-link" aria-hidden="true"></i>
          <span>Open markdown</span>
        </a>
      </div>
      <div class="markdown-body">${content}</div>
    </article>
  `
}

function renderDocSummaryCard(doc) {
  return `
    <section class="panel context-card">
      <p class="eyebrow">${escapeHtml(doc.section)}</p>
      <h2>${escapeHtml(doc.title)}</h2>
      <p>${escapeHtml(doc.summary)}</p>
      <dl class="meta-list compact-meta">
        <div><dt>Owner</dt><dd>${escapeHtml(doc.owner)}</dd></div>
        <div><dt>Updated</dt><dd>${escapeHtml(doc.updated)}</dd></div>
      </dl>
      <div class="tag-list">
        ${(doc.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}
      </div>
    </section>
  `
}

function renderLinkedTasksCard(doc) {
  const linkedTasks = state.tasks.filter((item) => item.docId === doc.id)
  return `
    <section class="panel context-card">
      <div class="section-heading compact-heading">
        <div>
          <h2>Related Tasks</h2>
          <p>${linkedTasks.length} linked to this document.</p>
        </div>
      </div>
      <div class="linked-list">
        ${linkedTasks.length > 0
          ? linkedTasks.map((task) => `
            <button type="button" data-task-id="${escapeHtml(task.id)}">
              <span class="priority-dot priority-${task.priority.toLowerCase()}"></span>
              <span>${escapeHtml(task.title)}</span>
              <strong>${escapeHtml(task.status)}</strong>
            </button>
          `).join('')
          : '<p class="empty-state compact-empty">No local tasks linked yet.</p>'}
      </div>
    </section>
  `
}

function renderSelectedTaskCard(task) {
  return `
    <section class="panel context-card selected-task-card">
      <p class="eyebrow">Selected task</p>
      <h2>${escapeHtml(task.title)}</h2>
      <dl class="meta-list compact-meta">
        <div><dt>Status</dt><dd>${escapeHtml(task.status)}</dd></div>
        <div><dt>Priority</dt><dd>${escapeHtml(task.priority)}</dd></div>
        <div><dt>Due</dt><dd>${escapeHtml(task.due)}</dd></div>
      </dl>
      <p>${escapeHtml(task.notes)}</p>
    </section>
  `
}

function visibleTasks() {
  const query = state.query.trim().toLowerCase()
  return state.tasks.filter((task) => {
    const matchesStatus = state.statusFilter === 'All' || task.status === state.statusFilter
    const doc = findDoc(task.docId)
    const haystack = [
      task.title,
      task.area,
      task.priority,
      task.status,
      task.assignee,
      task.assignedBy,
      task.notes,
      doc?.title,
      doc?.section,
      ...(doc?.tags || []),
    ].join(' ').toLowerCase()
    return matchesStatus && (!query || haystack.includes(query))
  })
}

function taskStats(tasks) {
  const total = tasks.length
  const done = tasks.filter((task) => task.status === 'Done').length
  const inProgress = tasks.filter((task) => task.status === 'In Progress').length
  const inReview = tasks.filter((task) => task.status === 'In Review').length
  const todo = tasks.filter((task) => task.status === 'Todo').length
  return {
    total,
    done,
    inProgress,
    inReview,
    todo,
    completion: total === 0 ? 0 : Math.round((done / total) * 100),
  }
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(TASK_STORAGE_KEY)
    if (!raw) return seedTasks.map((task) => ({ ...task }))
    const stored = JSON.parse(raw)
    if (!Array.isArray(stored)) return seedTasks.map((task) => ({ ...task }))
    const storedById = new Map(stored.map((task) => [task.id, task]))
    const seedMerged = seedTasks.map((task) => normalizeTask({ ...task, ...(storedById.get(task.id) || {}) }))
    const customTasks = stored.filter((task) => !seedTasks.some((seed) => seed.id === task.id)).map(normalizeTask)
    return [...customTasks, ...seedMerged]
  } catch {
    return seedTasks.map((task) => normalizeTask({ ...task }))
  }
}

function saveTasks() {
  localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(state.tasks))
}

function updateTask(id, patch) {
  state.tasks = state.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task))
  saveTasks()
  render()
}

function addReviewNote(id, status, note) {
  const entry = {
    id: `review-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
    by: state.session.name,
    role: state.session.role,
    status,
    note,
    at: new Date().toISOString(),
  }
  state.tasks = state.tasks.map((task) => {
    if (task.id !== id) return task
    return {
      ...task,
      status,
      reviewLog: [...(Array.isArray(task.reviewLog) ? task.reviewLog : []), entry],
    }
  })
  state.selectedTaskId = id
  saveTasks()
}

function normalizeTask(task) {
  return {
    ...task,
    reviewLog: Array.isArray(task.reviewLog) ? task.reviewLog : [],
  }
}

async function authenticate(rawEmail, password) {
  const normalizedEmail = rawEmail.trim().toLowerCase()
  const account = AUTH_ACCOUNTS.find((item) => item.login === normalizedEmail)
  if (!account) return null
  const hash = await sha256(`${AUTH_SALT}:${account.login}:${password}`)
  if (hash !== account.passwordHash) return null
  return {
    email: account.email,
    name: account.name,
    role: account.role,
    loginAt: new Date().toISOString(),
  }
}

async function loadGitHubIssues() {
  state.github = { ...state.github, status: 'loading', error: '' }
  render()
  try {
    const response = await fetch(GITHUB_ISSUES_API, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store',
    })
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`)
    const issues = await response.json()
    state.github = {
      status: 'ready',
      issues: issues
        .filter((issue) => !issue.pull_request)
        .map(mapGitHubIssue)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
      error: '',
      loadedAt: new Date().toISOString(),
    }
  } catch (error) {
    state.github = {
      ...state.github,
      status: 'error',
      error: error instanceof Error ? error.message : 'Could not load GitHub issues.',
    }
  }
  render()
}

function mapGitHubIssue(issue) {
  const labels = (issue.labels || []).map((label) => typeof label === 'string' ? label : label.name).filter(Boolean)
  const normalizedLabels = labels.map((label) => label.toLowerCase())
  return {
    id: `github-${issue.number}`,
    number: issue.number,
    title: issue.title,
    body: issue.body || '',
    excerpt: (issue.body || '').replace(/\s+/g, ' ').trim().slice(0, 180),
    url: issue.html_url,
    state: issue.state,
    kind: normalizedLabels.includes('weekly-update') ? 'weekly-update' : normalizedLabels.includes('task') ? 'task' : 'other',
    status: issue.state === 'closed' ? 'Done' : labelStatus(normalizedLabels),
    priority: labelPriority(normalizedLabels),
    labels,
    updatedAt: issue.updated_at,
    createdAt: issue.created_at,
  }
}

function labelStatus(labels) {
  if (labels.includes('status:done')) return 'Done'
  if (labels.includes('status:in-review')) return 'In Review'
  if (labels.includes('status:in-progress')) return 'In Progress'
  return 'Todo'
}

function labelPriority(labels) {
  if (labels.includes('priority:high')) return 'High'
  if (labels.includes('priority:low')) return 'Low'
  return 'Medium'
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.name || !parsed?.email || !parsed?.role) return null
    return parsed
  } catch {
    return null
  }
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((task) => task.id !== id)
  if (state.selectedTaskId === id) state.selectedTaskId = null
  saveTasks()
  render()
}

function exportTasks() {
  const blob = new Blob([JSON.stringify(state.tasks, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'yaomin-ynova-tasks.json'
  link.click()
  URL.revokeObjectURL(url)
}

function loadTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
}

function findDoc(id) {
  return knowledgeBase.find((doc) => doc.id === id)
}

function findTask(id) {
  return state.tasks.find((task) => task.id === id)
}

function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key]
    acc[value] = acc[value] || []
    acc[value].push(item)
    return acc
  }, {})
}

function priorityWeight(priority) {
  return PRIORITY_ORDER.indexOf(priority) === -1 ? 99 : PRIORITY_ORDER.indexOf(priority)
}

function iconForSection(section) {
  const normalized = section.toLowerCase()
  if (normalized.includes('engineering')) return 'code-2'
  if (normalized.includes('product')) return 'boxes'
  if (normalized.includes('ai')) return 'bot'
  if (normalized.includes('design')) return 'palette'
  return 'book-open'
}

function assetUrl(path) {
  return `${BASE_URL}${path}`
}

function prepareMarkdown(markdown) {
  return markdown.replaceAll('../../public/', assetUrl(''))
}

function formatDateTime(value) {
  try {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#96;')
}
