import type {SchemaTypeDefinition} from 'sanity'
import {author} from '../../../sanity/schemas/author'
import {blog} from '../../../sanity/schemas/blog'
import {category} from '../../../sanity/schemas/category'
import {comment} from '../../../sanity/schemas/comment'
import {job} from '../../../sanity/schemas/job'
import {news} from '../../../sanity/schemas/news'
import {newsletterSubscriber} from '../../../sanity/schemas/newsletterSubscriber'
import {opportunity} from '../../../sanity/schemas/opportunity'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [category, author, blog, news, job, opportunity, comment, newsletterSubscriber],
}
