export type QuickLink = {
  _id: string
  title: string
  slug: string
  contentType: 'blog' | 'jobs' | 'opportunities' | 'earn' | 'news'
  order: number
}

export type FeaturedNewsItem = {
  _id: string
  title: string
  excerpt: string
  views: number
  publishedAt: string
  slug: string
  authorName: string
  categoryTitle: string
  coverImageUrl: string
}

export type LatestNewsItem = {
  _id: string
  title: string
  views: number
  publishedAt: string
  slug: string
  authorName: string
}

export type BlogItem = {
  _id: string
  title: string
  excerpt: string
  views: number
  publishedAt: string
  slug: string
  authorName: string
  categoryTitle: string
  coverImageUrl: string
}

export type JobItem = {
  _id: string
  title: string
  excerpt: string
  views: number
  publishedAt: string
  slug: string
  company: string
  location: string
  remote: boolean
  employmentType: string
}

export type OpportunityItem = {
  _id: string
  title: string
  excerpt: string
  views: number
  slug: string
  organization: string
  location: string
  opportunityType: string
  deadline: string
}

export const quickLinks: QuickLink[] = [
  { _id: 'cat-1', title: 'Artificial Intelligence', slug: 'artificial-intelligence', contentType: 'news', order: 1 },
  { _id: 'cat-2', title: 'Remote Jobs', slug: 'remote-jobs', contentType: 'jobs', order: 2 },
  { _id: 'cat-3', title: 'Scholarships', slug: 'scholarships', contentType: 'opportunities', order: 3 },
  { _id: 'cat-4', title: 'NYSC', slug: 'nysc', contentType: 'news', order: 4 },
  { _id: 'cat-5', title: 'Freelancing', slug: 'freelancing', contentType: 'earn', order: 5 },
  { _id: 'cat-6', title: 'Africa Tech', slug: 'africa-tech', contentType: 'news', order: 6 },
  { _id: 'cat-7', title: 'Finance', slug: 'finance', contentType: 'news', order: 7 },
  { _id: 'cat-8', title: 'Beginner Guides', slug: 'beginner-guides', contentType: 'blog', order: 8 },
  { _id: 'cat-9', title: 'Bootcamps', slug: 'bootcamps', contentType: 'opportunities', order: 9 },
  { _id: 'cat-10', title: 'Career Growth', slug: 'career-growth', contentType: 'blog', order: 10 },
]

export const featuredNews: FeaturedNewsItem[] = [
  {
    _id: 'news-1',
    title: 'NYSC Tech Opportunities More Graduates Should Pay Attention To',
    excerpt: 'Corps members are finding more digital roles, training paths, and remote-friendly opportunities than ever before.',
    views: 84,
    publishedAt: '2026-04-09T08:00:00.000Z',
    slug: 'nysc-tech-opportunities-more-graduates-should-pay-attention-to',
    authorName: 'Techfront Editorial',
    categoryTitle: 'NYSC',
    coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'news-2',
    title: 'How AI Tools Are Changing Entry-Level Tech Jobs',
    excerpt: 'A practical look at how AI is reshaping junior tech roles, hiring expectations, and skill gaps for new entrants.',
    views: 128,
    publishedAt: '2026-04-09T11:00:00.000Z',
    slug: 'how-ai-tools-are-changing-entry-level-tech-jobs',
    authorName: 'Techfront Newsroom',
    categoryTitle: 'Artificial Intelligence',
    coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'news-3',
    title: 'Africa Tech Hiring Is Becoming More Skills-First Than Degree-First',
    excerpt: 'Startups across Africa are changing how they shortlist candidates, putting portfolio quality and practical ability ahead of formal credentials.',
    views: 96,
    publishedAt: '2026-04-08T15:30:00.000Z',
    slug: 'africa-tech-hiring-is-becoming-more-skills-first-than-degree-first',
    authorName: 'Techfront Newsroom',
    categoryTitle: 'Africa Tech',
    coverImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'news-4',
    title: 'Why More Beginners Are Using Short Courses to Break Into Product Design',
    excerpt: 'Short, structured programs are becoming a practical alternative for learners who need momentum, mentorship, and a portfolio quickly.',
    views: 71,
    publishedAt: '2026-04-08T10:00:00.000Z',
    slug: 'why-more-beginners-are-using-short-courses-to-break-into-product-design',
    authorName: 'Yusuf',
    categoryTitle: 'Beginner Guides',
    coverImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'news-5',
    title: 'Remote Work Policies Are Quietly Expanding for African Engineering Teams',
    excerpt: 'Companies hiring across regions are opening more hybrid and fully remote engineering roles than many applicants realize.',
    views: 102,
    publishedAt: '2026-04-07T13:30:00.000Z',
    slug: 'remote-work-policies-are-quietly-expanding-for-african-engineering-teams',
    authorName: 'Techfront Editorial',
    categoryTitle: 'Remote Jobs',
    coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'news-6',
    title: 'Finance Apps Targeting Young Nigerians Are Getting Smarter About Budgeting',
    excerpt: 'A new generation of tools is moving from simple alerts to more useful planning and saving support.',
    views: 66,
    publishedAt: '2026-04-07T09:00:00.000Z',
    slug: 'finance-apps-targeting-young-nigerians-are-getting-smarter-about-budgeting',
    authorName: 'Techfront Newsroom',
    categoryTitle: 'Finance',
    coverImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'news-7',
    title: 'Freelance Developers Are Raising Rates by Specializing Earlier',
    excerpt: 'Niche positioning is helping more freelancers move away from low-fee generalist work.',
    views: 77,
    publishedAt: '2026-04-06T12:00:00.000Z',
    slug: 'freelance-developers-are-raising-rates-by-specializing-earlier',
    authorName: 'Techfront Editorial',
    categoryTitle: 'Freelancing',
    coverImageUrl: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'news-8',
    title: 'Scholarship Deadlines More Tech Learners Should Be Tracking This Month',
    excerpt: 'From cloud credits to full training support, several deadlines are closer than many applicants think.',
    views: 55,
    publishedAt: '2026-04-06T08:45:00.000Z',
    slug: 'scholarship-deadlines-more-tech-learners-should-be-tracking-this-month',
    authorName: 'Techfront Newsroom',
    categoryTitle: 'Scholarships',
    coverImageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'news-9',
    title: 'The Most Useful Beginner Tech Communities Are Becoming Career Launchpads',
    excerpt: 'Community-led accountability and peer referrals are creating faster paths into internships and junior roles.',
    views: 63,
    publishedAt: '2026-04-05T17:20:00.000Z',
    slug: 'the-most-useful-beginner-tech-communities-are-becoming-career-launchpads',
    authorName: 'Yusuf',
    categoryTitle: 'Career Growth',
    coverImageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'news-10',
    title: 'Bootcamps Are Competing on Mentorship Quality More Than Curriculum Now',
    excerpt: 'As course content becomes easier to find online, mentorship and job support are increasingly the deciding factors.',
    views: 49,
    publishedAt: '2026-04-05T10:10:00.000Z',
    slug: 'bootcamps-are-competing-on-mentorship-quality-more-than-curriculum-now',
    authorName: 'Techfront Editorial',
    categoryTitle: 'Bootcamps',
    coverImageUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
  },
]

export const latestNews: LatestNewsItem[] = featuredNews.map((item) => ({
  _id: item._id,
  title: item.title,
  views: item.views,
  publishedAt: item.publishedAt,
  slug: item.slug,
  authorName: item.authorName,
}))

export const latestBlog: BlogItem[] = [
  {
    _id: 'blog-1',
    title: 'How to Start Learning Frontend Development in Nigeria',
    excerpt: 'A beginner-friendly roadmap for anyone trying to break into frontend development with practical steps and realistic expectations.',
    views: 63,
    publishedAt: '2026-04-09T09:00:00.000Z',
    slug: 'how-to-start-learning-frontend-development-in-nigeria',
    authorName: 'Yusuf',
    categoryTitle: 'Beginner Guides',
    coverImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'blog-2',
    title: 'A Simple Remote Job Checklist for Nigerian Developers',
    excerpt: 'Use this checklist to tighten your portfolio, resume, GitHub, and application flow before you start applying broadly.',
    views: 89,
    publishedAt: '2026-04-08T14:00:00.000Z',
    slug: 'a-simple-remote-job-checklist-for-nigerian-developers',
    authorName: 'Techfront Editorial',
    categoryTitle: 'Career Growth',
    coverImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'blog-3',
    title: 'What To Learn First If You Want To Freelance With Tech Skills',
    excerpt: 'A practical path for beginners choosing between writing, design, no-code, frontend, and automation services.',
    views: 77,
    publishedAt: '2026-04-08T10:30:00.000Z',
    slug: 'what-to-learn-first-if-you-want-to-freelance-with-tech-skills',
    authorName: 'Techfront Newsroom',
    categoryTitle: 'Freelancing',
    coverImageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'blog-4',
    title: 'The Best Way To Build A Portfolio Before You Feel Ready',
    excerpt: 'You do not need ten polished case studies. You need proof that you can solve problems and communicate clearly.',
    views: 52,
    publishedAt: '2026-04-07T12:20:00.000Z',
    slug: 'the-best-way-to-build-a-portfolio-before-you-feel-ready',
    authorName: 'Yusuf',
    categoryTitle: 'Beginner Guides',
    coverImageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'blog-5',
    title: 'How To Write Tech Articles That Actually Bring Traffic',
    excerpt: 'A cleaner process for choosing topics, structuring articles, and improving discoverability without sounding robotic.',
    views: 38,
    publishedAt: '2026-04-07T08:00:00.000Z',
    slug: 'how-to-write-tech-articles-that-actually-bring-traffic',
    authorName: 'Techfront Editorial',
    categoryTitle: 'Career Growth',
    coverImageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'blog-6',
    title: 'Beginner Tech Tools You Should Learn Without Overcomplicating Things',
    excerpt: 'A simple list of tools worth learning early, and which ones can wait until you have a clearer direction.',
    views: 46,
    publishedAt: '2026-04-06T16:30:00.000Z',
    slug: 'beginner-tech-tools-you-should-learn-without-overcomplicating-things',
    authorName: 'Techfront Newsroom',
    categoryTitle: 'Beginner Guides',
    coverImageUrl: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'blog-7',
    title: 'How To Position Yourself For NYSC-Friendly Tech Roles',
    excerpt: 'From portfolio framing to soft skills, here is how to make your applications stronger while serving.',
    views: 71,
    publishedAt: '2026-04-06T11:00:00.000Z',
    slug: 'how-to-position-yourself-for-nysc-friendly-tech-roles',
    authorName: 'Techfront Editorial',
    categoryTitle: 'Career Growth',
    coverImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'blog-8',
    title: 'A Realistic One-Year Plan To Break Into Tech From Scratch',
    excerpt: 'A month-by-month approach for learners who need structure more than motivation.',
    views: 93,
    publishedAt: '2026-04-05T14:45:00.000Z',
    slug: 'a-realistic-one-year-plan-to-break-into-tech-from-scratch',
    authorName: 'Yusuf',
    categoryTitle: 'Beginner Guides',
    coverImageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'blog-9',
    title: 'How To Stay Consistent When Learning Tech Feels Slow',
    excerpt: 'Systems beat motivation. Here is how to build a pace you can actually maintain.',
    views: 58,
    publishedAt: '2026-04-05T09:10:00.000Z',
    slug: 'how-to-stay-consistent-when-learning-tech-feels-slow',
    authorName: 'Techfront Newsroom',
    categoryTitle: 'Beginner Guides',
    coverImageUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'blog-10',
    title: 'What Makes A Beginner Resume More Likely To Get Opened',
    excerpt: 'A stronger summary, cleaner project bullets, and less filler can change how your resume performs.',
    views: 66,
    publishedAt: '2026-04-04T13:00:00.000Z',
    slug: 'what-makes-a-beginner-resume-more-likely-to-get-opened',
    authorName: 'Techfront Editorial',
    categoryTitle: 'Career Growth',
    coverImageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?auto=format&fit=crop&w=900&q=80',
  },
]

export const latestJobs: JobItem[] = [
  { _id: 'job-1', title: 'Frontend Developer Intern', excerpt: 'A remote frontend internship for early-career developers who want hands-on product experience.', views: 41, publishedAt: '2026-04-09T09:00:00.000Z', slug: 'frontend-developer-intern', company: 'Techfront Labs', location: 'Remote', remote: true, employmentType: 'Internship' },
  { _id: 'job-2', title: 'Junior Product Designer', excerpt: 'A growth-minded design role for someone ready to work on onboarding, product polish, and design systems.', views: 58, publishedAt: '2026-04-09T07:30:00.000Z', slug: 'junior-product-designer', company: 'Lagos Product House', location: 'Lagos', remote: false, employmentType: 'Full-time' },
  { _id: 'job-3', title: 'Content Writer for Tech Careers', excerpt: 'Create practical career content, employer spotlights, and newsletter copy for a growing media platform.', views: 34, publishedAt: '2026-04-08T15:00:00.000Z', slug: 'content-writer-for-tech-careers', company: 'Techfront Media', location: 'Remote', remote: true, employmentType: 'Contract' },
  { _id: 'job-4', title: 'NYSC UI Developer', excerpt: 'An NYSC-friendly role supporting interface implementation, bug fixes, and responsive page builds.', views: 28, publishedAt: '2026-04-08T12:00:00.000Z', slug: 'nysc-ui-developer', company: 'BuildStack Africa', location: 'Abuja', remote: false, employmentType: 'NYSC' },
  { _id: 'job-5', title: 'Graduate Data Analyst', excerpt: 'An early-career analytics role with room to learn dashboards, reporting, and stakeholder communication.', views: 47, publishedAt: '2026-04-08T09:15:00.000Z', slug: 'graduate-data-analyst', company: 'Insight Grid', location: 'Hybrid', remote: true, employmentType: 'Full-time' },
  { _id: 'job-6', title: 'Junior React Developer', excerpt: 'Help ship polished frontend experiences and maintain reusable components across product surfaces.', views: 65, publishedAt: '2026-04-07T16:40:00.000Z', slug: 'junior-react-developer', company: 'Northstar Apps', location: 'Remote', remote: true, employmentType: 'Full-time' },
  { _id: 'job-7', title: 'Technical Support Associate', excerpt: 'Support customers, document recurring issues, and collaborate with product teams on fixes.', views: 39, publishedAt: '2026-04-07T10:00:00.000Z', slug: 'technical-support-associate', company: 'CloudDesk', location: 'Lagos', remote: false, employmentType: 'Full-time' },
  { _id: 'job-8', title: 'Junior SEO Specialist', excerpt: 'A search-focused role for someone who understands content performance, SERP basics, and on-page optimization.', views: 26, publishedAt: '2026-04-06T14:20:00.000Z', slug: 'junior-seo-specialist', company: 'SearchFirst Media', location: 'Remote', remote: true, employmentType: 'Part-time' },
  { _id: 'job-9', title: 'No-Code Operations Builder', excerpt: 'Use Airtable, Notion, and automation tools to improve internal workflows across teams.', views: 31, publishedAt: '2026-04-06T08:30:00.000Z', slug: 'no-code-operations-builder', company: 'OpsForge', location: 'Remote', remote: true, employmentType: 'Contract' },
  { _id: 'job-10', title: 'Entry-Level QA Tester', excerpt: 'A beginner-friendly QA role covering test cases, bug reports, and regression checks.', views: 54, publishedAt: '2026-04-05T13:10:00.000Z', slug: 'entry-level-qa-tester', company: 'TestRail Labs', location: 'Ibadan', remote: false, employmentType: 'Full-time' },
]

export const latestOpportunities: OpportunityItem[] = [
  { _id: 'opp-1', title: 'Google Africa Scholarship for Tech Beginners', excerpt: 'A beginner-friendly scholarship opportunity for aspiring tech learners across Africa.', views: 57, slug: 'google-africa-scholarship-for-tech-beginners', organization: 'Google', location: 'Remote', opportunityType: 'Scholarship', deadline: '2026-05-30T00:00:00.000Z' },
  { _id: 'opp-2', title: 'Remote Product Design Fellowship', excerpt: 'An immersive fellowship for emerging designers who want mentorship, feedback, and stronger case studies.', views: 44, slug: 'remote-product-design-fellowship', organization: 'Design Circle', location: 'Remote', opportunityType: 'Fellowship', deadline: '2026-05-15T00:00:00.000Z' },
  { _id: 'opp-3', title: 'Frontend Bootcamp With Career Support', excerpt: 'A practical training program focused on frontend projects, portfolio reviews, and interview prep.', views: 62, slug: 'frontend-bootcamp-with-career-support', organization: 'LaunchLab', location: 'Lagos', opportunityType: 'Bootcamp', deadline: '2026-05-21T00:00:00.000Z' },
  { _id: 'opp-4', title: 'Cloud Skills Accelerator for Students', excerpt: 'Free cloud learning support, labs, and guided pathways for students and fresh graduates.', views: 36, slug: 'cloud-skills-accelerator-for-students', organization: 'CloudPath', location: 'Remote', opportunityType: 'Training', deadline: '2026-05-12T00:00:00.000Z' },
  { _id: 'opp-5', title: 'Startup Accelerator for Early Technical Founders', excerpt: 'An early-stage accelerator supporting founders building software products for African markets.', views: 29, slug: 'startup-accelerator-for-early-technical-founders', organization: 'Venture Ridge', location: 'Hybrid', opportunityType: 'Accelerator', deadline: '2026-06-05T00:00:00.000Z' },
  { _id: 'opp-6', title: 'NYSC Digital Skills Support Program', excerpt: 'A support track designed for corps members building practical digital skills during service.', views: 48, slug: 'nysc-digital-skills-support-program', organization: 'SkillBridge Nigeria', location: 'Nigeria', opportunityType: 'NYSC', deadline: '2026-05-09T00:00:00.000Z' },
  { _id: 'opp-7', title: 'Women in Tech Career Grant', excerpt: 'A grant helping women in tech cover equipment, course, and certification costs.', views: 41, slug: 'women-in-tech-career-grant', organization: 'Future Makers', location: 'Remote', opportunityType: 'Grant', deadline: '2026-05-26T00:00:00.000Z' },
  { _id: 'opp-8', title: 'Junior Data Fellowship for African Analysts', excerpt: 'A fellowship built for early-career analysts improving reporting, SQL, and storytelling skills.', views: 33, slug: 'junior-data-fellowship-for-african-analysts', organization: 'DataCamp Africa', location: 'Remote', opportunityType: 'Fellowship', deadline: '2026-05-18T00:00:00.000Z' },
  { _id: 'opp-9', title: 'Remote Writing Residency for Tech Publications', excerpt: 'An editorial residency focused on reporting, explainers, and newsletter writing for tech media.', views: 27, slug: 'remote-writing-residency-for-tech-publications', organization: 'Media Foundry', location: 'Remote', opportunityType: 'Training', deadline: '2026-05-28T00:00:00.000Z' },
  { _id: 'opp-10', title: 'AI Scholarship for Self-Taught Developers', excerpt: 'A funded learning path for developers who want structured support building AI-related projects.', views: 53, slug: 'ai-scholarship-for-self-taught-developers', organization: 'Open Learning Fund', location: 'Remote', opportunityType: 'Scholarship', deadline: '2026-06-10T00:00:00.000Z' },
]
