import docs from './knowledge-base.json'

const loaders = {
  'collaboration-guidelines': () => import('../../docs/onboarding/collaboration_guidelines.md?raw'),
  'ynova-full-onboarding': () => import('../../docs/onboarding/ynova_full_onboarding_guide.md?raw'),
  'code-guidelines': () => import('../../docs/engineering/code_guidelines.md?raw'),
  'ynova-mbs-architecture': () => import('../../docs/product/ynova_mbs_architecture.md?raw'),
  'agents': () => import('../../docs/ai_architecture/Agents.md?raw'),
  'claude': () => import('../../docs/ai_architecture/Claude.md?raw'),
  'ynova-theme-mascot': () => import('../../docs/design/ynova_mascot_and_theme.md?raw'),
}

export const knowledgeBase = docs.map((doc) => ({
  ...doc,
  load: loaders[doc.id],
}))
