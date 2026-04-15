import Link from 'next/link'
import type {ReactNode} from 'react'
import {AppImage} from '@/components/AppImage'
import {urlFor} from '@/sanity/lib/image'
import type {PortableContentNode} from '@/lib/content'

type TocItem = {
  key: string
  id: string
  text: string
  level: number
}

function getBlockText(node: PortableContentNode) {
  if (node._type !== 'block') return ''
  return (node.children ?? []).map((child) => child.text ?? '').join('').trim()
}

function renderSpanChildren(node: Extract<PortableContentNode, {_type: 'block'}>) {
  const markDefs = new Map((node.markDefs ?? []).map((item) => [item._key, item]))

  return (node.children ?? []).map((child, index) => {
    const baseKey = child._key ?? `${node._key ?? 'block'}-${index}`
    let content: ReactNode = child.text ?? ''

    for (const mark of child.marks ?? []) {
      const definition = markDefs.get(mark)

      if (mark === 'strong') {
        content = <strong key={`${baseKey}-strong`}>{content}</strong>
        continue
      }

      if (mark === 'em') {
        content = <em key={`${baseKey}-em`}>{content}</em>
        continue
      }

      if (mark === 'code') {
        content = (
          <code key={`${baseKey}-code`} className="rounded bg-black/8 px-1.5 py-0.5 text-[0.95em] text-primary-text dark:bg-white/10">
            {content}
          </code>
        )
        continue
      }

      if (mark === 'underline') {
        content = <span key={`${baseKey}-underline`} className="underline underline-offset-4">{content}</span>
        continue
      }

      if (mark === 'strike-through') {
        content = <span key={`${baseKey}-strike`} className="line-through">{content}</span>
        continue
      }

      if (definition?._type === 'link' && definition.href) {
        const isExternal = /^https?:\/\//.test(definition.href)
        content = (
          <Link
            key={`${baseKey}-link-${definition._key}`}
            href={definition.href}
            {...(isExternal ? {target: '_blank', rel: 'noreferrer'} : {})}
            className="font-semibold text-primary-text underline underline-offset-4 decoration-primary-green/70 transition-colors hover:text-primary-green hover:decoration-primary-green"
          >
            {content}
          </Link>
        )
      }
    }

    return <span key={baseKey}>{content}</span>
  })
}

function isListBlock(node: PortableContentNode): node is PortableContentNode & {_type: 'block'; listItem: 'bullet' | 'number'; level?: number} {
  return node._type === 'block' && (node.listItem === 'bullet' || node.listItem === 'number')
}

function slugifyHeading(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'section'
}

function getHeadingLevel(node: PortableContentNode) {
  if (node._type !== 'block') return null
  const style = node.style ?? ''
  if (!/^h[1-6]$/.test(style)) return null
  return Number(style.slice(1))
}

function buildToc(body: PortableContentNode[]) {
  const usedIds = new Map<string, number>()
  const items: TocItem[] = []

  body.forEach((node, index) => {
    const level = getHeadingLevel(node)
    if (!level) return

    const text = getBlockText(node)
    if (!text) return

    const base = slugifyHeading(text)
    const seen = usedIds.get(base) ?? 0
    const id = seen === 0 ? base : `${base}-${seen + 1}`
    usedIds.set(base, seen + 1)

    items.push({
      key: node._key ?? `heading-${index}`,
      id,
      text,
      level,
    })
  })

  return items
}

export function SanityBodyContent({body}: {body?: PortableContentNode[]}) {
  if (!body?.length) return null

  const toc = buildToc(body)
  const tocByKey = new Map(toc.map((item) => [item.key, item]))
  const rendered: ReactNode[] = []

  for (let index = 0; index < body.length; index += 1) {
    const node = body[index]

    if (isListBlock(node)) {
      const listType = node.listItem
      const listLevel = node.level ?? 1
      const listNodes: Array<{key: string; content: ReactNode[]}> = []

      let cursor = index
      while (cursor < body.length) {
        const candidate = body[cursor]
        if (!isListBlock(candidate)) break
        if (candidate.listItem !== listType || (candidate.level ?? 1) !== listLevel) break

        const itemText = getBlockText(candidate)
        if (itemText) {
          listNodes.push({
            key: candidate._key ?? `${listType}-${cursor}`,
            content: renderSpanChildren(candidate),
          })
        }
        cursor += 1
      }

      index = cursor - 1

      if (listNodes.length > 0) {
        if (listType === 'number') {
          rendered.push(
            <ol key={`ol-${listNodes[0].key}`} className="list-decimal space-y-2 pl-7">
              {listNodes.map((item) => (
                <li key={item.key} className="text-[1.02rem] leading-8 text-muted-text">
                  {item.content}
                </li>
              ))}
            </ol>
          )
        } else {
          rendered.push(
            <ul key={`ul-${listNodes[0].key}`} className="list-disc space-y-2 pl-7">
              {listNodes.map((item) => (
                <li key={item.key} className="text-[1.02rem] leading-8 text-muted-text">
                  {item.content}
                </li>
              ))}
            </ul>
          )
        }
      }

      continue
    }

    if (node._type === 'image' && node.asset) {
      const imageUrl = urlFor(node).width(1200).fit('max').auto('format').url()

      rendered.push(
        <figure key={node._key ?? imageUrl} className="space-y-3">
          <AppImage
            src={imageUrl}
            alt={node.alt ?? ''}
            className="h-auto w-full bg-card-background object-contain sm:max-h-[36rem] sm:object-contain"
            width={1200}
            height={800}
            sizes="100vw"
          />
          {node.caption || node.credit ? (
            <figcaption className="text-[0.86rem] leading-6 text-muted-text">
              {node.caption ? <span>{node.caption}</span> : null}
              {node.caption && node.credit ? <span> </span> : null}
              {node.credit ? (
                node.sourceUrl ? (
                  <Link href={node.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-primary-green">
                    {node.credit}
                  </Link>
                ) : (
                  <span>{node.credit}</span>
                )
              ) : null}
            </figcaption>
          ) : null}
        </figure>
      )
      continue
    }

    const text = getBlockText(node)
    if (!text) continue
    const blockNode = node._type === 'block' ? node : null
    const style = blockNode?.style
    const heading = tocByKey.get(node._key ?? `heading-${index}`)

    if (style === 'h1') {
      rendered.push(
        <h1
          id={heading?.id}
          key={node._key ?? text}
          className="scroll-mt-28 font-display text-[2.2rem] font-bold leading-[0.98] tracking-[-0.05em] text-primary-text sm:text-[2.8rem]"
        >
          {blockNode ? renderSpanChildren(blockNode) : text}
        </h1>
      )
      continue
    }

    if (style === 'h2') {
      rendered.push(
        <h2
          id={heading?.id}
          key={node._key ?? text}
          className="scroll-mt-28 font-display text-[2rem] font-bold leading-[0.98] tracking-[-0.05em] text-primary-text sm:text-[2.3rem]"
        >
          {blockNode ? renderSpanChildren(blockNode) : text}
        </h2>
      )
      continue
    }

    if (style === 'h3') {
      rendered.push(
        <h3
          id={heading?.id}
          key={node._key ?? text}
          className="scroll-mt-28 font-display text-[1.55rem] font-bold leading-[1.02] tracking-[-0.04em] text-primary-text sm:text-[1.75rem]"
        >
          {blockNode ? renderSpanChildren(blockNode) : text}
        </h3>
      )
      continue
    }

    if (style === 'h4') {
      rendered.push(
        <h4 id={heading?.id} key={node._key ?? text} className="scroll-mt-28 font-display text-[1.24rem] font-bold tracking-[-0.02em] text-primary-text">
          {blockNode ? renderSpanChildren(blockNode) : text}
        </h4>
      )
      continue
    }

    if (style === 'h5') {
      rendered.push(
        <h5 id={heading?.id} key={node._key ?? text} className="scroll-mt-28 text-[1.06rem] font-bold uppercase tracking-[0.08em] text-primary-text">
          {blockNode ? renderSpanChildren(blockNode) : text}
        </h5>
      )
      continue
    }

    if (style === 'h6') {
      rendered.push(
        <h6 id={heading?.id} key={node._key ?? text} className="scroll-mt-28 text-[0.95rem] font-bold uppercase tracking-[0.1em] text-primary-text">
          {blockNode ? renderSpanChildren(blockNode) : text}
        </h6>
      )
      continue
    }

    if (style === 'blockquote') {
      rendered.push(
        <blockquote key={node._key ?? text} className="border-l-2 border-primary-green pl-4 font-serif text-[1.2rem] leading-8 text-primary-text">
          {blockNode ? renderSpanChildren(blockNode) : text}
        </blockquote>
      )
      continue
    }

    rendered.push(
      <p key={node._key ?? text}>
        {blockNode ? renderSpanChildren(blockNode) : text}
      </p>
    )
  }

  return (
    <article className="mt-8 space-y-6 text-[1.04rem] leading-8 text-muted-text">
      {toc.length > 0 ? (
        <nav aria-label="Table of contents" className="rounded-sm border border-border bg-card-background p-5">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-text">Table of Contents</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-primary-green">
            {toc.map((item) => (
              <li key={item.key}>
                <a
                  href={`#${item.id}`}
                  className={`block text-[0.92rem] leading-6 text-muted-text transition-colors hover:text-primary-green ${
                    item.level > 2 ? 'pl-4' : ''
                  } ${item.level > 3 ? 'pl-7' : ''} underline underline-offset-4 decoration-muted-text/70 hover:decoration-primary-green`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {rendered}
    </article>
  )
}
