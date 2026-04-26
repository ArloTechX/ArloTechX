export const serviceCatalog = [
  {
    id: 'svc-website-development',
    slug: 'website-development',
    icon: 'Globe',
    title: 'Website Development',
    category: 'Web Platform',
    shortDescription: 'Conversion-focused business websites with modern visuals, speed, and SEO-ready architecture.',
    fullDescription:
      'We design and build high-performance business websites that communicate your brand clearly and convert visitors into leads. Our delivery focuses on responsive layouts, clean content structure, fast load times, and scalable page architecture so your marketing and sales teams can grow without tech friction.',
    features: ['Custom UI sections and landing pages', 'Responsive design across mobile and desktop', 'SEO-friendly structure and metadata setup', 'CMS-ready architecture for easy updates'],
    benefits: ['Higher conversion potential', 'Faster page speed and better UX', 'Improved search visibility', 'Easy content updates for your team'],
    process: ['Discovery and content mapping', 'Wireframes and visual direction', 'Frontend and backend implementation', 'QA, optimization, and launch'],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Node.js'],
    pricingNote: 'Pricing depends on scope, number of pages, integrations, and content requirements.',
  },
  {
    id: 'svc-web-app-development',
    slug: 'web-app-development',
    icon: 'MonitorCog',
    title: 'Web App Development',
    category: 'Product Engineering',
    shortDescription: 'Custom web applications engineered for performance, reliability, and long-term scalability.',
    fullDescription:
      'We build web applications tailored to your exact business workflows. From multi-role dashboards to customer portals and SaaS products, we focus on maintainable architecture, secure data handling, and smooth user flows that support rapid feature growth.',
    features: ['Role-based access and permissions', 'Reusable component architecture', 'API-first modular backend integration', 'Scalable state and data models'],
    benefits: ['Operational efficiency through automation', 'Faster feature iteration', 'Improved user retention', 'Future-ready architecture'],
    process: ['Requirement mapping and user flows', 'System architecture and sprint planning', 'Iterative build with QA cycles', 'Release, monitoring, and improvements'],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    pricingNote: 'Final pricing is based on feature modules, user roles, and integration complexity.',
  },
  {
    id: 'svc-ui-ux-design',
    slug: 'ui-ux-design',
    icon: 'Palette',
    title: 'UI/UX Design',
    category: 'Design System',
    shortDescription: 'User-first interface design that blends clarity, aesthetics, and measurable business outcomes.',
    fullDescription:
      'Our UI/UX process combines product strategy with visual polish to create experiences users enjoy and trust. We focus on information hierarchy, interaction consistency, accessibility, and conversion-oriented design patterns across web and app screens.',
    features: ['UX audits and journey mapping', 'Low and high-fidelity wireframes', 'Design systems and reusable components', 'Usability-focused interaction design'],
    benefits: ['Better engagement and usability', 'Reduced design inconsistency', 'Stronger brand perception', 'Improved product adoption'],
    process: ['Research and UX discovery', 'Wireframes and user flow validation', 'High-fidelity UI design', 'Design handoff and implementation support'],
    technologies: ['Figma', 'Design Tokens', 'Prototyping', 'Accessibility Standards'],
    pricingNote: 'Pricing varies by number of screens, flows, and design system depth.',
  },
  {
    id: 'svc-ai-integration',
    slug: 'ai-integration',
    icon: 'BrainCircuit',
    title: 'AI Integration',
    category: 'Automation',
    shortDescription: 'AI-powered workflows and assistants that reduce manual effort and improve decision velocity.',
    fullDescription:
      'We integrate AI capabilities into your existing systems to automate repetitive work and improve business responsiveness. This includes chat assistants, internal copilots, smart summarization, classification, and workflow automations with safeguards and tracking.',
    features: ['AI copilots and chat interfaces', 'Prompt and workflow orchestration', 'Context-aware business automation', 'Usage analytics and quality controls'],
    benefits: ['Reduced manual operations', 'Faster response cycles', 'Improved consistency in outputs', 'Scalable intelligent processes'],
    process: ['Use-case discovery and prioritization', 'Prototype and model selection', 'System integration and guardrails', 'Monitoring, tuning, and scale-up'],
    technologies: ['OpenAI APIs', 'Node.js', 'Vector Search', 'Automation Pipelines'],
    pricingNote: 'Pricing considers usage volume, integration depth, and model runtime requirements.',
  },
  {
    id: 'svc-api-integration',
    slug: 'api-integration',
    icon: 'Cable',
    title: 'API Integration',
    category: 'Infrastructure',
    shortDescription: 'Secure API integrations connecting your product with payment, CRM, ERP, and external services.',
    fullDescription:
      'We connect your platform to external systems with stable, secure integrations built for resilience. Whether it is payment gateways, CRMs, communication providers, or internal microservices, we implement reliable contracts, fallback handling, and observability.',
    features: ['Third-party API onboarding and mapping', 'Secure auth and token lifecycle handling', 'Webhook and event processing', 'Error resilience and retry strategies'],
    benefits: ['Unified business workflows', 'Lower manual data sync effort', 'Reduced integration failures', 'Faster operational insights'],
    process: ['API analysis and contract planning', 'Integration development and validation', 'Security and reliability hardening', 'Deployment with monitoring and alerts'],
    technologies: ['REST APIs', 'Webhooks', 'OAuth 2.0', 'Node.js'],
    pricingNote: 'Pricing is based on number of integrations, data flow complexity, and reliability requirements.',
  },
  {
    id: 'svc-deployment-hosting',
    slug: 'deployment-hosting',
    icon: 'ServerCog',
    title: 'Deployment & Hosting',
    category: 'Cloud Ops',
    shortDescription: 'Reliable deployment pipelines and cloud hosting configurations built for uptime and scale.',
    fullDescription:
      'We establish production-ready deployment and hosting setups that ensure your product ships safely and scales smoothly. From CI/CD setup to environment strategy, release governance, and monitoring, we make operations predictable and secure.',
    features: ['CI/CD pipeline setup', 'Cloud environment provisioning', 'Release and rollback strategy', 'Performance and uptime monitoring'],
    benefits: ['Safer and faster releases', 'Reduced downtime risk', 'Clear operational visibility', 'Scalable infrastructure baseline'],
    process: ['Infrastructure and release planning', 'Pipeline and environment setup', 'Security and performance checks', 'Production rollout and monitoring'],
    technologies: ['GitHub Actions', 'Docker', 'Cloud Hosting', 'Observability Tooling'],
    pricingNote: 'Pricing depends on environments, deployment frequency, and cloud architecture needs.',
  },
];

export const services = serviceCatalog.map((service) => ({
  id: service.slug,
  icon: service.icon,
  title: service.title,
  description: service.shortDescription,
}));

export const getServiceBySlug = (slug) => serviceCatalog.find((service) => service.slug === slug);

export const highlightFeatures = [
  {
    title: 'Custom Software Development',
    text: 'Tailored digital products aligned with your workflows and growth goals.',
  },
  {
    title: 'Modern Web Applications',
    text: 'Fast, responsive, and scalable apps optimized for real-world usage.',
  },
  {
    title: 'AI-Powered Solutions',
    text: 'Smart capabilities that automate repetitive tasks and enhance decisions.',
  },
  {
    title: 'Secure & Scalable Systems',
    text: 'Architecture built with long-term performance, compliance, and security in mind.',
  },
];

export const whyChooseUs = [
  'Modern Tech Stack',
  'Custom-Built Solutions',
  'Fast Delivery Cycles',
  'Scalable Architecture',
  'Clean UI/UX Standards',
  'Reliable Long-Term Support',
];
