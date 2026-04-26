export const appNav = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'About Company', path: '/about', icon: 'Building2' },
  { label: 'Services', path: '/services', icon: 'Boxes' },
  { label: 'Projects', path: '/projects', icon: 'FolderKanban' },
  { label: 'Team', path: '/team', icon: 'UsersRound' },
  { label: 'Payment', path: '/payment', icon: 'CreditCard' },
  { label: 'Contact', path: '/contact', icon: 'MessageSquareMore' },
];

export const dashboardStats = [
  { label: 'Total Projects', value: '58', delta: '+12% this quarter', tone: 'blue' },
  { label: 'Active Clients', value: '24', delta: '+4 new this month', tone: 'cyan' },
  { label: 'Services Offered', value: '14', delta: '3 premium bundles', tone: 'indigo' },
  { label: 'Pending Requests', value: '11', delta: '5 high-priority leads', tone: 'amber' },
  { label: 'Completed Works', value: '132', delta: '98% satisfaction', tone: 'emerald' },
  { label: 'Avg. Delivery Time', value: '5.2w', delta: 'Down from 6.1w', tone: 'violet' },
];

export const serviceModules = [
  {
    id: 'website-dev',
    title: 'Website Development',
    category: 'Web Platform',
    description: 'High-conversion marketing and business websites with premium UX and fast performance.',
    status: 'Popular',
  },
  {
    id: 'web-app-dev',
    title: 'Web App Development',
    category: 'Product Engineering',
    description: 'Scalable SaaS and internal tools engineered with robust architecture and role-based workflows.',
    status: 'Core',
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    category: 'Design System',
    description: 'Design systems and product experiences built for clarity, conversion, and long-term consistency.',
    status: 'Design',
  },
  {
    id: 'ai',
    title: 'AI Integration',
    category: 'Automation',
    description: 'Intelligent assistants, workflow automation, and AI copilots embedded into your operations.',
    status: 'Trending',
  },
  {
    id: 'api',
    title: 'API Integration',
    category: 'Infrastructure',
    description: 'Secure integrations across CRMs, payment gateways, ERP suites, and third-party products.',
    status: 'Stable',
  },
  {
    id: 'hosting',
    title: 'Deployment & Hosting',
    category: 'Cloud Ops',
    description: 'Production deployments, CI/CD, cloud environments, and high-availability architecture setup.',
    status: 'Ops',
  },
  {
    id: 'support',
    title: 'Maintenance & Support',
    category: 'Post Launch',
    description: 'Continuous upgrades, performance tuning, monitoring, and managed support retainers.',
    status: 'Support',
  },
];

export const projectModules = [
  {
    id: 'nexus-crm',
    title: 'Nexus CRM Suite',
    category: 'Business',
    description: 'Client lifecycle platform with lead tracking, smart follow-up flows, and analytics.',
    progress: 92,
    status: 'Near Launch',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'zenflow-ai',
    title: 'ZenFlow AI Assistant',
    category: 'AI',
    description: 'Support automation workspace that handles triage, drafting, and response workflows.',
    progress: 74,
    status: 'In Progress',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'atlas-commerce',
    title: 'Atlas Commerce Web App',
    category: 'Web',
    description: 'Unified B2B/B2C commerce suite with inventory sync and modular storefront engines.',
    progress: 58,
    status: 'Build Phase',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'vault-ui',
    title: 'Vault UI Revamp',
    category: 'UI/UX',
    description: 'Product experience overhaul with design tokens, accessibility rules, and component library.',
    progress: 81,
    status: 'Review',
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'orbit-ops',
    title: 'Orbit Ops Panel',
    category: 'Business',
    description: 'Operations dashboard for logistics insights, reporting automation, and KPI intelligence.',
    progress: 65,
    status: 'In Progress',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'lumen-web',
    title: 'Lumen Product Hub',
    category: 'Web',
    description: 'SaaS onboarding portal and product workspace with analytics and subscription controls.',
    progress: 100,
    status: 'Delivered',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  },
];

export const projectFilters = ['All', 'Web', 'AI', 'Business', 'UI/UX'];

export const clients = [
  {
    id: 'client-rahul-mehta',
    name: 'Rahul Mehta',
    email: 'rahul@gridnova.com',
    phone: '+91 98400 11111',
    company: 'GridNova',
    projectType: 'Web App Development',
    status: 'Active',
    createdAt: '2026-01-10T09:30:00.000Z',
  },
  {
    id: 'client-aisha-verma',
    name: 'Aisha Verma',
    email: 'aisha@orbithive.io',
    phone: '+91 98400 22222',
    company: 'OrbitHive',
    projectType: 'AI Integration',
    status: 'Active',
    createdAt: '2026-01-22T12:45:00.000Z',
  },
  {
    id: 'client-daniel-brooks',
    name: 'Daniel Brooks',
    email: 'daniel@northbridgelabs.com',
    phone: '+1 415 555 0182',
    company: 'NorthBridge Labs',
    projectType: 'UI/UX Design',
    status: 'In Progress',
    createdAt: '2026-02-03T16:20:00.000Z',
  },
  {
    id: 'client-mina-patel',
    name: 'Mina Patel',
    email: 'mina@zenithworks.in',
    phone: '+91 98400 33333',
    company: 'Zenith Works',
    projectType: 'Website Development',
    status: 'Completed',
    createdAt: '2026-02-18T08:10:00.000Z',
  },
  {
    id: 'client-arjun-s',
    name: 'Arjun S',
    email: 'arjun@datarelay.ai',
    phone: '+91 98400 44444',
    company: 'DataRelay',
    projectType: 'API Integration',
    status: 'Review',
    createdAt: '2026-03-06T10:05:00.000Z',
  },
];

export const inquiries = [
  {
    name: 'Krish Kapoor',
    company: 'BlueMosaic',
    request: 'Custom SaaS Dashboard',
    budget: '$12k - $20k',
    status: 'New',
    message: 'Need a client portal with analytics widgets and billing modules.',
  },
  {
    name: 'Fatima Noor',
    company: 'Nexspace',
    request: 'AI Sales Assistant',
    budget: '$18k - $30k',
    status: 'Qualified',
    message: 'Looking to automate inbound queries and sales lead scoring.',
  },
  {
    name: 'Victor Chen',
    company: 'Pivotal Systems',
    request: 'Legacy App Modernization',
    budget: '$25k+',
    status: 'In Review',
    message: 'Need migration plan from old PHP system to React + API platform.',
  },
  {
    name: 'Neha Iyer',
    company: 'Lumina Health',
    request: 'UI/UX Product Revamp',
    budget: '$8k - $15k',
    status: 'Pending',
    message: 'Want modern interface and better user onboarding conversion.',
  },
];


