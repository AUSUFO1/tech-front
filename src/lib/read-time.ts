import type {PortableContentNode} from '@/lib/content'

const WORDS_PER_MINUTE = 220

function countWords(value?: string) {
  if (!value) return 0

  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function getNodeText(node: PortableContentNode) {
  if (node._type === 'block') {
    return (node.children ?? []).map((child) => child.text ?? '').join(' ')
  }

  if (node._type === 'image') {
    return [node.alt, node.caption, node.credit].filter(Boolean).join(' ')
  }

  if (node._type === 'tableBlock') {
    return [
      node.caption,
      ...(node.rows ?? []).flatMap((row) => row.cells ?? []),
    ].filter(Boolean).join(' ')
  }

  return ''
}

export function getReadTimeMinutes(input: {
  title?: string
  excerpt?: string
  body?: PortableContentNode[]
}) {
  const bodyWords = (input.body ?? []).reduce((total, node) => total + countWords(getNodeText(node)), 0)
  const fallbackWords = countWords(input.title) + countWords(input.excerpt)
  const wordCount = bodyWords || fallbackWords

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
}

export function formatReadTime(input: {
  title?: string
  excerpt?: string
  body?: PortableContentNode[]
}) {
  return `${getReadTimeMinutes(input)} min read`
}
