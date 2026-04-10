export type MockAuthor = {
  _id: string
  name: string
  slug: string
  title: string
  bio: string
  imageUrl: string
}

export const mockAuthors: MockAuthor[] = [
  {
    _id: 'author-1',
    name: 'Yusuf Abubakar',
    slug: 'yusuf-abubakar',
    title: 'Founder & Frontend Developer',
    bio: 'Builds product systems, frontend architecture, and editorial workflows for Techfront.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'author-2',
    name: 'Techfront Editorial',
    slug: 'techfront-editorial',
    title: 'Editorial Team',
    bio: 'Covers jobs, opportunities, practical guides, and growth-focused tech reporting.',
    imageUrl: 'https://images.unsplash.com/photo-1541534401786-2077eed87a72?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'author-3',
    name: 'Techfront Newsroom',
    slug: 'techfront-newsroom',
    title: 'News Desk',
    bio: 'Publishes timely updates on AI, finance, Africa tech, and emerging career trends.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
  },
]
