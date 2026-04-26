import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('GizPulse Content')
    .items([
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      S.documentTypeListItem('blog').title('Blog'),
      S.documentTypeListItem('news').title('News'),
      S.documentTypeListItem('job').title('Jobs'),
      S.documentTypeListItem('opportunity').title('Opportunities'),
      S.divider(),
      S.listItem()
        .title('Newsletter Subscribers')
        .child(
          S.list()
            .title('Newsletter Subscribers')
            .items([
              S.listItem()
                .title('Active')
                .schemaType('newsletterSubscriber')
                .child(
                  S.documentList()
                    .title('Active Subscribers')
                    .schemaType('newsletterSubscriber')
                    .filter('_type == "newsletterSubscriber" && !(_id in path("drafts.**")) && status == "active"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Unsubscribed')
                .schemaType('newsletterSubscriber')
                .child(
                  S.documentList()
                    .title('Unsubscribed Subscribers')
                    .schemaType('newsletterSubscriber')
                    .filter('_type == "newsletterSubscriber" && !(_id in path("drafts.**")) && status == "unsubscribed"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              S.divider(),
              S.listItem()
                .title('All Subscribers')
                .schemaType('newsletterSubscriber')
                .child(
                  S.documentList()
                    .title('All Subscribers')
                    .schemaType('newsletterSubscriber')
                    .filter('_type == "newsletterSubscriber" && !(_id in path("drafts.**"))')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
            ])
        ),
      S.listItem()
        .title('Comments')
        .child(
          S.list()
            .title('Comments')
            .items([
              S.listItem()
                .title('Pending')
                .schemaType('comment')
                .child(
                  S.documentList()
                    .title('Pending Comments')
                    .schemaType('comment')
                    .filter('_type == "comment" && !(_id in path("drafts.**")) && status == "pending"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Approved')
                .schemaType('comment')
                .child(
                  S.documentList()
                    .title('Approved Comments')
                    .schemaType('comment')
                    .filter('_type == "comment" && !(_id in path("drafts.**")) && status == "approved"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Rejected')
                .schemaType('comment')
                .child(
                  S.documentList()
                    .title('Rejected Comments')
                    .schemaType('comment')
                    .filter('_type == "comment" && !(_id in path("drafts.**")) && status == "rejected"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              S.divider(),
              S.listItem()
                .title('All Comments')
                .schemaType('comment')
                .child(
                  S.documentList()
                    .title('All Comments')
                    .schemaType('comment')
                    .filter('_type == "comment" && !(_id in path("drafts.**"))')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
            ])
        ),
    ])
