import docs from './knowledge-base.json'

const loaders = {
  'collaboration-guidelines': () => import('../../docs/onboarding/collaboration_guidelines.md?raw'),
  'ynova-full-onboarding': () => import('../../docs/onboarding/ynova_full_onboarding_guide.md?raw'),
  'ynova-mbs-intern-handoff-review': () => import('../../docs/onboarding/ynova_mbs_intern_handoff_review.md?raw'),
  'ynova-mbs-intern-book': () => import('../../docs/onboarding/ynova_mbs_intern_book.md?raw'),
  'ynova-mbs-beginner-visual-handbook': () => import('../../docs/onboarding/ynova_mbs_beginner_visual_handbook.md?raw'),
  'code-guidelines': () => import('../../docs/engineering/code_guidelines.md?raw'),
  'ynova-mbs-capacitor-technical-guide': () => import('../../docs/engineering/ynova_mbs_capacitor_technical_guide.md?raw'),
  'ynova-mbs-architecture': () => import('../../docs/product/ynova_mbs_architecture.md?raw'),
  'free-shared-updates-architecture': () => import('../../docs/product/free_shared_updates_architecture.md?raw'),
  'agents': () => import('../../docs/ai_architecture/Agents.md?raw'),
  'claude': () => import('../../docs/ai_architecture/Claude.md?raw'),
  'ynova-theme-mascot': () => import('../../docs/design/ynova_mascot_and_theme.md?raw'),
  'ynova-mbs-design-system-guide': () => import('../../docs/design/ynova_mbs_design_system_guide.md?raw'),
}

export const knowledgeBase = docs.map((doc) => ({
  ...doc,
  load: loaders[doc.id],
}))
