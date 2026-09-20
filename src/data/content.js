// Single source of truth for the portfolio.
// Distilled from the four role-targeted résumés (ML / AI / Data Science / SWE).
// Edit here — every section of the site reads from this file.

export const TRACKS = {
  ml:   { id: 'ml',   label: 'ML Engineering',   short: 'ML',   color: 'var(--color-ml)',   blurb: 'Model selection, evaluation, and production monitoring.' },
  ai:   { id: 'ai',   label: 'AI & Agentic',     short: 'AI',   color: 'var(--color-ai)',   blurb: 'LLM systems, RAG, agent orchestration, inference cost and latency.' },
  data: { id: 'data', label: 'Data Engineering', short: 'Data', color: 'var(--color-data)', blurb: 'Spark pipelines, warehouse modeling, EDA and experimentation.' },
  swe:  { id: 'swe',  label: 'Software',         short: 'SWE',  color: 'var(--color-swe)',  blurb: 'React and FastAPI services, Docker, AWS and Azure, CI/CD.' },
}

export const profile = {
  name: 'Aishwarya Bhanage',
  full: 'Aishwarya Mahadev Bhanage',
  roles: ['Machine Learning Engineer', 'AI Engineer', 'Data Engineer', 'Software Engineer'],
  location: 'Sunnyvale, California',
  email: 'aish.bhanage0412@gmail.com',
  phone: '+1 934-246-0445',
  github: 'https://github.com/AishwaryaBhanage',
  linkedin: 'https://www.linkedin.com/in/aishwaryabhanage/',
  availability: 'Seeking full-time roles starting January 2027',
  // The one-liner a recruiter reads in ten seconds.
  headline:
    'I build machine learning systems that survive contact with production, ' +
    'from the Spark pipelines underneath to the evaluation harness that decides what ships.',
  about: [
    'Three years at Accenture taking models from notebook to production for a banking client, ' +
      'fraud detection over a million transactions a day, the PySpark pipelines feeding it, ' +
      'and the dashboards that told us when it drifted.',
    'Since then: founding engineer at an AI startup, where I owned the whole stack, ' +
      'retrieval and ranking, the evaluation harness we gated releases on, and the model routing ' +
      'that cut serving cost 30% without giving up quality.',
    'Now finishing an M.S. in Applied Mathematics and Statistics at Stony Brook, ' +
      'building agentic developer tooling, and running research data infrastructure for a sleep lab.',
    'I also teach it. As a Pre-College STEM instructor I take a cohort of 15 high-school students ' +
      'through Python, supervised learning, generative AI and prompt engineering, and I run the ' +
      'schedule and attendance system behind a summer programme of 500+ participants and 40 staff.',
  ],
}

// Numbers a recruiter can scan in five seconds. Every one traceable to a résumé line.
export const metrics = [
  { value: '3', unit: 'yrs', label: 'ML in production', detail: 'Accenture, Dec 2020 – Oct 2023' },
  { value: '0.91', unit: 'AUROC', label: 'Fraud detection', detail: '1M+ daily transactions, false positives −20%' },
  { value: '30', unit: '%', label: 'Inference cost cut', detail: 'Tiered model routing, caching, batched inference' },
  { value: '40', unit: '%', label: 'Retrieval relevance lift', detail: 'Top-K over the keyword baseline' },
]

export const experience = [
  {
    id: 'cubit',
    org: 'Stony Brook University',
    role: 'Graduate Research Assistant, CUBIT Sleep Lab',
    start: 'Apr 2026', end: 'Present', current: true,
    location: 'Stony Brook, NY',
    tracks: ['data', 'swe'],
    summary: 'Research data infrastructure for clinical sleep studies.',
    bullets: [
      { text: 'Built an internal review tool that surfaces wearable actigraphy data device-by-device per participant, runs automated quality control, and lets researchers annotate every recorded day and night, putting AI-assisted tooling in the hands of non-technical research staff.', tracks: ['swe', 'ai'] },
      { text: 'Automated validity and completeness checks in R across 6 device types (40 participants each), cutting per-participant processing from 10–15 minutes to roughly 5.', tracks: ['data'] },
      { text: 'Extracted sleep/wake metrics from raw actigraphy with GGIR, supporting clinical research on insomnia, sleep disruption, and depression.', tracks: ['data'] },
    ],
    stack: ['R', 'GGIR', 'Time-series QC', 'Claude Code'],
  },
  {
    id: 'veach',
    org: 'Veach & Company',
    role: 'Founding AI/ML Engineer',
    start: 'Jul 2025', end: 'Dec 2025',
    location: 'New York, NY',
    tracks: ['ai', 'ml', 'swe'],
    summary: 'First engineer. Took an AI matching product from prototype to production.',
    bullets: [
      { text: 'Shipped the platform end to end: React (TypeScript) frontend, Python/FastAPI backend, containerized with Docker on AWS EC2 with PostgreSQL, rough prototype to production in weeks.', tracks: ['swe'] },
      { text: 'Built the retrieval and ranking pipeline (ingestion, embedding, candidate retrieval, LLM-assisted re-ranking), lifting top-5 relevance ~40% over the keyword baseline.', tracks: ['ai', 'ml'] },
      { text: 'Owned model evaluation: defined quality metrics with product and operations stakeholders, curated a 100-example labeled ground-truth set, and gated every prompt, model, and ranking change on it before release.', tracks: ['ml', 'ai'] },
      { text: 'Benchmarked frontier and open-source models (GPT-4, LLaMA, Mistral) on relevance, structured-output reliability, latency, and cost; shipped tiered routing with embedding caching and batched inference, cutting serving cost ~30% at constant quality.', tracks: ['ai', 'ml'] },
    ],
    stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'Docker', 'AWS EC2', 'PostgreSQL', 'OpenAI', 'LLaMA', 'Mistral'],
  },
  {
    id: 'accenture',
    org: 'Accenture',
    role: 'Machine Learning Engineer',
    progression: 'Associate Data Engineer → Software Engineer, Machine Learning',
    start: 'Dec 2020', end: 'Oct 2023',
    duration: '3 years',
    location: 'Pune, India',
    tracks: ['ml', 'data', 'swe'],
    summary:
      'Three years on a banking client: the fraud and risk models, the Spark pipelines feeding them, ' +
      'the experiments that validated them, and the dashboards that caught them drifting.',
    bullets: [
      { text: 'Compared Logistic Regression, XGBoost, and anomaly-detection approaches on 1M+ daily banking transactions using cross-validation and AUROC, selecting the model and decision threshold that reached AUROC 0.91 and cut false positives 20%, with feature engineering, feature selection, and hyperparameter tuning.', tracks: ['ml'] },
      { text: 'Operated those models in production: tracked per-run AUROC and precision/recall across versioned splits, traced degradation to upstream data and feature changes, and routed low-confidence predictions to human review, deployed in Kubernetes for scalable execution.', tracks: ['ml'] },
      { text: 'Engineered PySpark and Databricks pipelines unifying core banking, ISP, and transaction-log data, schema reconciliation, duplicate and missing-value handling, into analysis-ready Snowflake tables for model training, cutting data preparation time 25%; orchestrated ingestion, transformation, and validation with Databricks Workflows and Delta Live Tables over 1M+ daily web-app sessions.', tracks: ['data'] },
      { text: 'Ran exploratory analysis of transaction and user-journey data in Python and SQL to diagnose funnel drop-offs and process bottlenecks (operational KPIs +15%), tracking response time by platform and service provider to isolate user-experience regressions.', tracks: ['data'] },
      { text: 'Designed and analyzed A/B tests across a rollout of 8 features on the payments page and login journey, using hypothesis testing and regression analysis to confirm a 15% cut in processing time and translate results into recommendations for product owners.', tracks: ['data', 'ml'] },
      { text: 'Optimized SQL (CTEs, window functions, stored procedures, indexing) powering 500+ KPIs, cutting query runtime 35% for dashboard and reporting extracts.', tracks: ['data'] },
      { text: 'Built Tableau (Certified Desktop Specialist) and Power BI dashboards on KPIs, payment success rate, and SLA adherence that leadership used weekly, accelerating decision cycles 35%; real-time anomaly monitoring in Tableau and AppDynamics cut incident-response time 40%.', tracks: ['data'] },
      { text: 'Built consumer-facing React (TypeScript) features and end-to-end REST APIs, deployed containerized services on AWS (EC2, S3) with Docker inside CI/CD pipelines, and implemented the two-factor-authentication notification flow on Azure Notification Hubs.', tracks: ['swe'] },
      { text: 'Technical point of contact for the client, ran weekly demos and partnered with product and engineering via Jira and ServiceNow to turn business requirements into production-ready data models and BI workflows.', tracks: ['swe', 'data'] },
    ],
    stack: [
      'Python', 'XGBoost', 'Scikit-learn', 'PySpark', 'Databricks', 'Delta Live Tables', 'Snowflake', 'SQL',
      'Kubernetes', 'Docker', 'AWS (EC2, S3)', 'Azure', 'React', 'TypeScript', 'REST APIs',
      'Tableau', 'Power BI', 'AppDynamics', 'Jira', 'ServiceNow',
    ],
  },
]

export const projects = [
  {
    id: 'datalineage',
    name: 'DataLineageAI',
    tagline: 'Multi-agent debugger for data pipelines',
    period: 'Feb 2026 – Jun 2026',
    tracks: ['ai', 'data'],
    featured: true,
    problem: 'Tracing a broken metric back through a dbt project takes hours of reading SQL by hand.',
    what: 'A LangGraph multi-agent tool that parses SQL and dbt models into ASTs, reconstructs lineage as a DAG, traces data-quality failures to their upstream source, and auto-generates corrected code, cutting debugging from hours to minutes.',
    insight: 'Parsing stays deterministic with SQLGlot; the LLM is reserved for repair and explanation, so agent output stays checkable. Now extending it into a VS Code extension.',
    stack: ['Python', 'LangGraph', 'SQLGlot', 'dbt', 'DuckDB', 'AWS'],
    repo: 'https://github.com/AishwaryaBhanage/AI-DataLineage',
  },
  {
    id: 'kathavani',
    name: 'Kathavani',
    tagline: 'Grounded RAG with an automated hallucination check',
    period: 'Sep 2025 – Dec 2025',
    tracks: ['ai', 'ml'],
    featured: true,
    problem: 'RAG systems confidently invent details that were never in the retrieved context.',
    what: 'Retrieval over 11,632 text chunks with BGE embeddings and two-stage retrieval, pgvector cosine to top-100, then a reranker to top-12, with two-pass generation and TTS narration.',
    insight: 'An automated entity-grounding check scores every output against its retrieved context, so hallucinations get caught by the system rather than by a reader.',
    stack: ['Python', 'pgvector', 'HNSW', 'BGE embeddings', 'Reranker', 'TTS'],
    repo: 'https://github.com/AishwaryaBhanage/Kathavani_MythologyStoryTeller_RagApp',
  },
  {
    id: 'ctr',
    name: 'CTR Prediction',
    tagline: 'Deep ranking model vs. gradient boosting',
    period: '2026',
    tracks: ['ml'],
    featured: true,
    problem: 'Does a deep model with learned embeddings actually beat XGBoost on display-ads click prediction?',
    what: 'Training a deep CTR model with embedding tables for 26 high-cardinality features against an XGBoost baseline on the Criteo dataset, compared on AUC and log loss.',
    insight: 'Evaluating calibration alongside ranking quality, a model can rank well and still be badly calibrated. Negative downsampling with prior correction handles the severe class imbalance.',
    stack: ['PyTorch', 'XGBoost', 'Criteo', 'Calibration'],
    repo: null,
  },
  {
    id: 'compliance',
    name: 'Multimodal Compliance Detection',
    tagline: 'Vision + NLP policy screening for video ads',
    period: 'Jan 2026 – Feb 2026',
    tracks: ['ai', 'swe'],
    featured: true,
    problem: 'Reviewing every video advertisement against a policy handbook by hand does not scale.',
    what: 'An agentic pipeline that pulls OCR and transcripts from video, indexes policy documents with Azure AI Search, retrieves passages cross-modally, and produces structured risk scores.',
    insight: 'Low-confidence outputs escalate to human review rather than being silently accepted, the system knows what it does not know.',
    stack: ['Azure OpenAI', 'Azure AI Search', 'LangGraph', 'Python', 'LLMOps'],
    repo: 'https://github.com/AishwaryaBhanage/AI-Powered-Multimodal-Video-Advertisement-Compliance-System-Azure-LLMOps',
  },
  {
    id: 'mobility',
    name: 'Urban Mobility Demand Forecasting',
    tagline: 'Spatio-temporal forecasting over 10M+ trips',
    period: '2026',
    tracks: ['ml', 'data'],
    problem: 'Predict trip demand by region and time window well enough to position supply ahead of it.',
    what: 'Spatio-temporal demand models over 10M+ trip records reaching ~0.80 R² on a chronological holdout, engineering temporal and geo-spatial features.',
    insight: 'Back-tested with time-aware cross-validation on a chronological holdout, random splits leak the future into training and flatter the model.',
    stack: ['Python', 'XGBoost', 'Random Forest', 'Time-series'],
    repo: 'https://github.com/AishwaryaBhanage/NYC-Taxi-Demand-Forecasting--Time-Series-Ensemble-Learning',
  },
  {
    id: 'planova',
    name: 'Planova',
    tagline: 'AI-assisted group planning, shipped',
    period: 'Jun 2026 – Present',
    tracks: ['swe', 'ai'],
    problem: 'Group trip planning collapses into an unreadable group chat.',
    what: 'A full-stack product where the Claude API generates structured itineraries users review, accept or decline, and edit, with role-based access control, invite links, and an activity audit log.',
    insight: 'The model proposes and the group disposes: every AI-generated item is a reviewable object, never an automatic commitment.',
    stack: ['Next.js', 'TypeScript', 'Node/Express', 'PostgreSQL', 'Claude API'],
    repo: 'https://github.com/AishwaryaBhanage/Planova_PlanTogether',
  },
  {
    id: 'revize',
    name: 'Revize',
    tagline: 'Spaced-repetition study app',
    period: 'Sep 2025 – Nov 2025',
    tracks: ['swe'],
    problem: 'Making flashcards by hand is the reason people stop using spaced repetition.',
    what: 'A full-stack web app in React, Flask/Python, and PostgreSQL, containerized with Docker on AWS EC2, with OpenAI/Gemini APIs generating flashcards automatically.',
    insight: 'Designed the SQLAlchemy data model and Flask REST endpoints behind card creation, review scheduling, and progress tracking.',
    stack: ['React', 'Flask', 'PostgreSQL', 'SQLAlchemy', 'Docker', 'AWS EC2'],
    repo: 'https://github.com/AishwaryaBhanage/revize_v2',
  },
  {
    id: 'pubmed',
    name: 'Forging Insight From Noise',
    tagline: 'RAG research assistant over 2M+ PubMed articles',
    period: 'Jan 2026',
    tracks: ['ai', 'data'],
    problem: 'Literature review across two million abstracts is not a reading problem, it is a retrieval problem.',
    what: 'An AI-powered research assistant indexing PubMed at scale, built as the final project for AMS 560 (Big Data Systems).',
    insight: 'Retrieval quality at this corpus size depends far more on chunking and index design than on the choice of generator model.',
    stack: ['Python', 'RAG', 'Vector search', 'Big Data Systems'],
    repo: 'https://github.com/AishwaryaBhanage/AMS560_FinalProject-ForgingInsightFromNoise-RAG',
  },
]

// Proficiency is anchored to evidence, not self-assessment:
//   5 owned in production   4 shipped to production   3 built with it
//   2 used / working knowledge   1 coursework
// Every 4 and 5 below traces to a résumé line or a shipped project.
export const LEVELS = [
  { n: 1, label: 'Coursework' },
  { n: 2, label: 'Working knowledge' },
  { n: 3, label: 'Built with it' },
  { n: 4, label: 'Shipped to production' },
  { n: 5, label: 'Owned in production' },
]

export const skills = [
  {
    group: 'Languages',
    track: null,
    items: [
      { name: 'Python', level: 5, note: '5+ yrs, daily' },
      { name: 'SQL', level: 5, note: '500+ KPIs, 3 yrs daily' },
      { name: 'TypeScript', level: 4, note: 'React at Accenture & Veach' },
      { name: 'JavaScript (ES6+)', level: 4 },
      { name: 'R', level: 3, note: 'CUBIT QC tooling' },
      { name: 'C++', level: 2, note: 'coursework' },
    ],
  },
  {
    group: 'Machine Learning',
    track: 'ml',
    items: [
      { name: 'XGBoost', level: 5, note: 'AUROC 0.91 in production' },
      { name: 'Scikit-learn', level: 5 },
      { name: 'Feature engineering & selection', level: 5 },
      { name: 'Cross-validation', level: 5 },
      { name: 'Model monitoring', level: 4, note: 'versioned splits, drift tracing' },
      { name: 'Anomaly detection', level: 4 },
      { name: 'PyTorch', level: 4, note: 'CTR model, Kathavani' },
      { name: 'Ranking & recommendation', level: 4 },
      { name: 'Calibration', level: 3 },
      { name: 'TensorFlow', level: 2 },
    ],
  },
  {
    group: 'AI & Agentic Systems',
    track: 'ai',
    items: [
      { name: 'RAG', level: 5, note: 'Kathavani, PubMed, Veach' },
      { name: 'Evaluation harnesses', level: 5, note: 'the release gate at Veach' },
      { name: 'Vector search (pgvector, FAISS)', level: 4 },
      { name: 'Embeddings & rerankers', level: 4, note: 'two-stage retrieval' },
      { name: 'Model benchmarking', level: 4, note: 'quality / latency / cost' },
      { name: 'Latency & cost optimization', level: 4, note: '−30% serving cost' },
      { name: 'LangGraph', level: 4, note: 'DataLineageAI, compliance' },
      { name: 'Frontier model APIs', level: 4, note: 'Claude, GPT-4, Gemini' },
      { name: 'Prompt & output-schema design', level: 4 },
      { name: 'LoRA fine-tuning', level: 3 },
      { name: 'AST tooling (SQLGlot)', level: 3 },
    ],
  },
  {
    group: 'Data Engineering',
    track: 'data',
    items: [
      { name: 'PySpark', level: 5, note: '3 yrs, 1M+ sessions/day' },
      { name: 'SQL optimization', level: 5, note: 'runtime −35%' },
      { name: 'ETL pipeline design', level: 5 },
      { name: 'Exploratory data analysis', level: 5 },
      { name: 'Databricks', level: 4, note: 'Workflows + Delta Live Tables' },
      { name: 'Snowflake', level: 4 },
      { name: 'Schema reconciliation', level: 4 },
      { name: 'PostgreSQL', level: 4 },
      { name: 'dbt', level: 3 },
      { name: 'Airflow', level: 3 },
    ],
  },
  {
    group: 'Statistics & Experimentation',
    track: 'data',
    items: [
      { name: 'A/B testing', level: 5, note: '8-feature rollout' },
      { name: 'Hypothesis testing', level: 5 },
      { name: 'Regression', level: 4 },
      { name: 'Time-series forecasting', level: 4, note: '10M+ trips, 0.80 R²' },
      { name: 'Back-testing', level: 4, note: 'chronological holdout' },
      { name: 'Confidence intervals', level: 4 },
      { name: 'Causal impact analysis', level: 3 },
    ],
  },
  {
    group: 'Software & Infrastructure',
    track: 'swe',
    items: [
      { name: 'Git / GitHub', level: 5 },
      { name: 'React', level: 4, note: 'consumer-facing, high traffic' },
      { name: 'Docker', level: 4, note: 'containerised services on EC2' },
      { name: 'REST APIs', level: 4, note: 'end-to-end, versioned' },
      { name: 'FastAPI', level: 4, note: 'the Veach backend' },
      { name: 'AWS (EC2, S3)', level: 4 },
      { name: 'CI/CD', level: 3 },
      { name: 'Azure', level: 3, note: 'Notification Hubs, AI Search' },
      { name: 'Next.js', level: 3 },
      { name: 'Kubernetes', level: 3 },
    ],
  },
  {
    group: 'Visualization & BI',
    track: 'data',
    items: [
      { name: 'Tableau', level: 5, note: 'Certified Desktop Specialist' },
      { name: 'Power BI', level: 4, note: 'weekly exec dashboards' },
      { name: 'Matplotlib / Seaborn', level: 4 },
      { name: 'AppDynamics', level: 3, note: 'incident response −40%' },
      { name: 'Streamlit', level: 3 },
    ],
  },
]

export const education = [
  {
    school: 'Stony Brook University',
    degree: 'M.S. Applied Mathematics and Statistics',
    detail: 'GPA 3.7 / 4.0',
    start: 'Aug 2024', end: 'Dec 2026',
    location: 'Stony Brook, NY',
    coursework: ['Machine Learning', 'Statistical Learning', 'Reinforcement Learning', 'NLP', 'Distributed Systems', 'Big Data Systems', 'Data Analysis'],
  },
  {
    school: 'Savitribai Phule Pune University',
    degree: 'B.E. Computer Engineering',
    detail: 'GPA 3.86 / 4.0',
    start: 'May 2016', end: 'May 2020',
    location: 'Pune, India',
    coursework: ['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks', 'DBMS', 'High Performance Computing'],
  },
]

export const leadership = [
  {
    id: 'gso',
    role: 'Treasurer, Graduate Student Organization',
    org: 'Stony Brook University',
    period: 'May 2025 – May 2026',
    kind: 'leadership',
    bullets: [
      'Administered a $900K+ budget across ~12 funding lines on behalf of 8,000+ graduate students.',
      'Reviewed 1,300+ funding applications and chaired budget meetings, reaching 98% budget approval.',
      'Presented budget analyses to the Provost and the University Senate.',
    ],
  },
  {
    id: 'csac',
    role: 'Representative, Campus Safety Advisory Committee',
    org: 'Stony Brook University',
    period: '2025 – 2026',
    kind: 'leadership',
    bullets: ['Represented 5,000+ women students on campus safety policy.'],
  },
]

export const awards = [
  { title: 'Accenture Celebrates Excellence (STAR) Award', year: '2022', detail: 'For an internal tool that cut a 20-minute Kibana lookup workflow to 2 minutes.' },
  { title: 'Accenture Merit Holder, FY2021', year: '2021', detail: 'Top performance in MERN stack across the Tech Expressway program.' },
  { title: 'Tableau Desktop Specialist', year: '2023', detail: 'Certified.' },
  { title: 'Google Data Analytics Professional Certificate', year: '2023', detail: 'Google Career Certificates.' },
  { title: 'FIFA World Cup 2022 Performer', year: '2022', detail: 'Represented India in a 35-day international cultural program in Qatar.' },
]

// Her own ML Engineer résumé is the primary download on the technical side;
// the campus one is a separate document for leadership and student-life roles.
export const resumes = [
  { track: 'ml',     label: 'ML Engineer',         file: '/resume/Aishwarya_Bhanage_ML_Engineer.pdf' },
  { track: 'campus', label: 'Campus & leadership', file: '/resume/Aishwarya_Bhanage_Campus_Leadership.pdf' },
]

// ---------------------------------------------------------------------------
// On-campus work — from the campus/leadership résumé
// ---------------------------------------------------------------------------

export const campus = [
  {
    id: 'instructor',
    role: 'Pre-College STEM Instructor, Artificial Intelligence and Machine Learning',
    org: 'Stony Brook University',
    period: 'Summer 2026',
    current: true,
    bullets: [
      'Designed and delivered interactive AI and machine-learning lessons to a cohort of 15 high-school students, translating technical concepts into clear explanations, relatable examples and hands-on activities.',
      'Guided students through practical exercises in Python, supervised learning, generative AI and prompt engineering, adapting instruction to very different levels of technical experience.',
      'Encouraged collaborative problem-solving through individual and group projects, helping students troubleshoot errors, evaluate model outputs and explain their reasoning.',
      'Created presentations, demonstrations and project materials connecting foundational AI concepts to real-world applications and to responsible use of the technology.',
    ],
  },
  {
    id: 'precollege',
    role: 'Graduate Student Assistant, Pre-College Summer Program',
    org: 'Stony Brook University',
    period: 'May 2026 – Present',
    current: true,
    bullets: [
      'Built and ran the master schedule for a summer program of 500+ participants and 40 staff, covering arrival, classes, meals, College Readiness, social programming, residential coverage, dismissal and checkout.',
      'Designed the attendance system and an hour tracker that keeps student ambassadors inside the 29-hour weekly limit, alongside fair shift assignment, call-out and backup-coverage procedures.',
      'Ran admissions operations end to end: application construction and testing, review and decisions, offers, acceptances, declines, waitlists, forms, payments and data exports, against approved admission criteria.',
      'Maintained participant data and reporting, tracking course, session, modality, residency, geography and year-of-graduation statistics, and producing housing files, rosters, meal lists and arrival and dismissal reports.',
      'Oversaw weekly events and catering, inventoried and maintained the course supply tracker, and served on the emergency response team as primary on-call residential contact.',
    ],
  },
  {
    id: 'chapin',
    role: 'Office Assistant, Chapin Area Office',
    org: 'Stony Brook University',
    period: 'May 2025 – Present',
    bullets: [
      'Manage front-desk operations: incoming calls, resident email, appointment scheduling in Outlook, and daily activity tracking in Excel.',
      'Handle sensitive resident information, keys, access requests and personal records, under strict confidentiality.',
      'De-escalate resident conflicts and partner with Residence Hall staff on escalations through high-volume move-in and move-out periods.',
    ],
  },
]

// ---------------------------------------------------------------------------
// The creative world — /creative
// ---------------------------------------------------------------------------

export const creative = {
  intro:
    'Before the models and the pipelines, there was choreography. ' +
    'Ten years of dance, a world-cup stage in Qatar, a camera that comes everywhere, ' +
    'and a $900K budget for eight thousand students.',

  stats: [
    { value: '10+', label: 'Years dancing' },
    { value: '50+', label: 'Stage shows' },
    { value: '35', label: 'Days in Qatar' },
    { value: '$900K', label: 'Budget managed' },
  ],

  passions: [
    {
      id: 'dance',
      title: 'Dance & Performance',
      body: 'From classical Bharatanatyam to Bollywood and contemporary fusion, my language of expression and cultural connection.',
      tags: ['10+ Years', 'FIFA World Cup', '50+ Shows'],
      accent: 'var(--color-ml)',
    },
    {
      id: 'photo',
      title: 'Photography',
      body: 'Capturing moments, emotions, and stories through my lens, cityscapes, night skies, and everything in between.',
      tags: ['Portrait', 'Travel', 'Astro'],
      accent: 'var(--color-ai)',
    },
    {
      id: 'service',
      title: 'Student Leadership',
      body: 'Treasurer for 8,000+ graduate students and a voice for 5,000+ women on campus safety. Mostly unglamorous, entirely consequential.',
      tags: ['GSO Treasurer', 'CSAC', 'Advocacy'],
      accent: 'var(--color-data)',
    },
    {
      id: 'outdoors',
      title: 'Travel & Outdoors',
      body: 'Gorges, harbors, and dark-sky nights. The best debugging happens a long way from a keyboard.',
      tags: ['Hiking', 'Road trips', 'Stargazing'],
      accent: 'var(--color-swe)',
    },
  ],

  // Gallery. `w`/`h` drive the masonry spans; thumbs load first, full only in the lightbox.
  gallery: [
    { src: 'fifa-stadium.jpg',    title: 'FIFA World Cup 2022',   caption: 'Performing for a stadium crowd in Qatar, 35 days representing India.', tall: true },
    { src: 'stage-wide.jpg',      title: 'Stage, full house',     caption: 'Wide shot from the wings, the screen behind us is the size of a building.' },
    { src: 'fifa-signage.jpg',    title: 'Qatar 2022',            caption: 'On site at the World Cup.' },
    { src: 'stage-jumbotron.jpg', title: 'Live on the big screen', caption: 'Bollywood fusion, lit in magenta.', tall: true },
    { src: 'stage-duo.jpg',       title: 'Mid-performance',       caption: 'Somewhere in the middle of a routine.' },
    { src: 'milky-way.jpg',       title: 'Starry Dreams',         caption: 'The Milky Way, no telescope, just patience and a tripod.', tall: true },
    { src: 'nyc-bridge.jpg',      title: 'Skyline Nights',        caption: 'Brooklyn Bridge and lower Manhattan after dark.', tall: true },
    { src: 'harbor-sunset.jpg',   title: 'Golden Hour',           caption: 'Boats at anchor as the sky went fully orange.' },
    { src: 'watkins-glen.jpg',    title: "Nature's Symphony",     caption: 'Rainbow Falls, Watkins Glen, upstate New York.', tall: true },
    { src: 'chicago-bean.jpg',    title: 'Cloud Gate',            caption: 'Chicago, in black and white.' },
  ],

  // Dance videos. Add YouTube IDs here and they render as embeds.
  // Example: { id: 'dQw4w9WgXcQ', title: 'FIFA World Cup 2022, Qatar', note: 'Bollywood fusion' }
  videos: [],

  links: [
    { label: 'Instagram', href: 'https://www.instagram.com/_aishwarya0.4bhanage_/' },
  ],
}

// ---------------------------------------------------------------------------
// The résumé — one document, three strands.
//
// Software engineering, distributed ML, and AI engineering held together by the
// two roles that carry them: Accenture (React/TypeScript, production ML, Spark
// at scale) and Veach (retrieval, ranking, evaluation). Every line traces to an
// existing résumé — nothing here is new claim.
// ---------------------------------------------------------------------------

export const resume = {
  title: 'Software · Machine Learning · AI Engineer',

  experience: [
    {
      role: 'Graduate Research Assistant, CUBIT Sleep Lab',
      org: 'Stony Brook University',
      period: 'Apr 2026 – Present',
      place: 'Stony Brook, NY',
      bullets: [
        'Built an internal review tool that surfaces wearable actigraphy device-by-device per participant, runs automated quality control, and lets researchers annotate every recorded day and night.',
        'Automated validity and completeness checks in R across 6 device types (40 participants each), cutting per-participant processing from 10–15 minutes to roughly 5; extracted sleep/wake metrics with GGIR under IRB-compliant handling.',
      ],
    },
    {
      role: 'Pre-College STEM Instructor, AI and Machine Learning',
      org: 'Stony Brook University',
      period: 'Summer 2026',
      place: 'Stony Brook, NY',
      bullets: [
        'Designed and delivered interactive AI and machine-learning lessons to a cohort of 15 high-school students, taking them through Python, supervised learning, generative AI and prompt engineering, and adapting instruction to very different levels of experience.',
        'Built presentations, demonstrations and project materials connecting foundational AI concepts to real-world applications and responsible use; coached students through troubleshooting, evaluating model outputs and explaining their reasoning.',
      ],
    },
    {
      role: 'Founding AI/ML Engineer',
      org: 'Veach & Company',
      period: 'Jul – Dec 2025',
      place: 'New York, NY',
      bullets: [
        'Shipped the platform end to end as the founding engineer: React (TypeScript) frontend, Python/FastAPI backend, containerised with Docker on AWS EC2 with PostgreSQL, prototype to production in weeks.',
        'Built the retrieval and ranking pipeline, ingestion, embedding, candidate retrieval, LLM-assisted re-ranking, lifting top-5 relevance ~40% over the keyword baseline.',
        'Owned model evaluation: defined quality metrics with product and operations stakeholders, curated a 100-example labelled ground-truth set, and gated every prompt, model and ranking change on it before release.',
        'Benchmarked frontier and open-source models (GPT-4, LLaMA, Mistral) on relevance, structured-output reliability, latency and cost; shipped tiered routing with embedding caching and batched inference, cutting serving cost ~30% at constant quality.',
      ],
    },
    {
      role: 'Machine Learning Engineer',
      org: 'Accenture',
      period: 'Dec 2020 – Oct 2023',
      place: 'Pune, India',
      note: 'Associate Data Engineer → Software Engineer, Machine Learning',
      bullets: [
        'Compared Logistic Regression, XGBoost and anomaly-detection approaches on 1M+ daily banking transactions using cross-validation and AUROC, selecting the model and decision threshold that reached AUROC 0.91 and cut false positives 20%.',
        'Operated those models in production: tracked per-run AUROC and precision/recall across versioned splits, traced degradation to upstream data and feature changes, routed low-confidence predictions to human review, deployed in Kubernetes.',
        'Engineered distributed PySpark and Databricks pipelines unifying core banking, ISP and transaction-log data into analysis-ready Snowflake tables; orchestrated ingestion, transformation and validation with Delta Live Tables over 1M+ daily sessions, cutting data preparation time 25%.',
        'Built consumer-facing React (TypeScript) features and end-to-end REST APIs, deployed containerised services on AWS (EC2, S3) with Docker inside CI/CD pipelines, and implemented the two-factor-authentication notification flow on Azure Notification Hubs.',
        'Optimised SQL (CTEs, window functions, indexing) powering 500+ KPIs, cutting query runtime 35%; designed and analysed A/B tests across a rollout of 8 features, confirming a 15% cut in processing time.',
        'Built Tableau (Certified) and Power BI dashboards used weekly by leadership, accelerating decision cycles 35%; AppDynamics monitoring cut incident response 40%. Technical point of contact for the client, running weekly demos.',
      ],
    },
  ],

  projects: [
    { name: 'DataLineageAI', stack: 'Python · LangGraph · SQLGlot · dbt',
      text: 'LangGraph multi-agent tool that parses SQL and dbt models into ASTs, reconstructs lineage as a DAG, traces data-quality failures upstream and generates corrected code, cutting debugging from hours to minutes. Parsing stays deterministic; the LLM is reserved for repair so agent output stays checkable.' },
    { name: 'Kathavani, grounded RAG', stack: 'Python · pgvector · HNSW · BGE',
      text: 'Retrieval over 11,632 chunks with two-stage retrieval (cosine top-100, reranker to top-12) and an automated entity-grounding check scoring every output against its retrieved context to catch hallucinations.' },
    { name: 'Multimodal Compliance Detection', stack: 'Azure OpenAI · AI Search · LangGraph',
      text: 'Agentic pipeline extracting OCR and transcripts from video, retrieving policy passages cross-modally and producing structured risk scores; low-confidence outputs escalate to human review.' },
    { name: 'Urban Mobility Demand Forecasting', stack: 'Python · XGBoost · time-series',
      text: 'Spatio-temporal demand models over 10M+ trip records reaching ~0.80 R² on a chronological holdout, back-tested with time-aware cross-validation.' },
  ],

  skills: [
    { k: 'Languages', v: 'Python · SQL · TypeScript · JavaScript (ES6+) · C++ · R' },
    { k: 'Machine learning', v: 'PyTorch · TensorFlow · Scikit-learn · XGBoost · feature engineering and selection · cross-validation · calibration · class imbalance · anomaly detection · ranking · model monitoring' },
    { k: 'AI & agentic', v: 'LangGraph · RAG · pgvector · FAISS · embeddings and rerankers · evaluation harnesses · model benchmarking · prompt and output-schema design · LoRA fine-tuning · frontier and open-source model APIs' },
    { k: 'Distributed data', v: 'Apache Spark (PySpark) · Databricks · Delta Live Tables · Snowflake · Airflow · dbt · Kubernetes · PostgreSQL' },
    { k: 'Software & infra', v: 'React · Next.js · Node/Express · FastAPI · Flask · REST APIs · Docker · CI/CD · AWS (EC2, S3, SageMaker) · Azure · GCP · Git' },
    { k: 'Analysis', v: 'A/B testing · hypothesis testing · regression · time-series forecasting · Tableau (Certified) · Power BI' },
  ],

  education: [
    { degree: 'M.S. Applied Mathematics and Statistics', school: 'Stony Brook University',
      period: 'Aug 2024 – Dec 2026', note: 'GPA 3.7 / 4.0' },
    { degree: 'B.E. Computer Engineering', school: 'Savitribai Phule Pune University',
      period: 'May 2016 – May 2020', note: 'GPA 3.86 / 4.0' },
  ],

  leadership: [
    'Treasurer, Graduate Student Organization, Stony Brook University (May 2025 – May 2026), administered a $900K+ budget across ~12 funding lines for 8,000+ graduate students, reviewed 1,300+ applications, reached 98% budget approval, and presented analyses to the Provost and University Senate.',
    'Graduate Student Assistant, Pre-College Summer Program (May 2026 – Present), built and ran the master schedule and attendance system for 500+ participants and 40 staff, ran admissions operations end to end, and oversaw weekly events and catering.',
    'Representative, Campus Safety Advisory Committee, represented 5,000+ women students on campus safety policy.',
    'Accenture Celebrates Excellence (STAR) Award · Accenture Merit Holder FY2021 · Tableau Desktop Specialist (Certified).',
  ],
}
