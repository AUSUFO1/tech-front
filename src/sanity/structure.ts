import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Techfront Content')
    .items([
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      S.documentTypeListItem('blog').title('Blog'),
      S.documentTypeListItem('news').title('News'),
      S.documentTypeListItem('job').title('Jobs'),
      S.documentTypeListItem('opportunity').title('Opportunities'),
      S.divider(),
      S.documentTypeListItem('newsletterSubscriber').title('Newsletter Subscribers'),
      S.documentTypeListItem('comment').title('Comments'),
    ])
