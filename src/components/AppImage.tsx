import Image from 'next/image'

type AppImageProps = {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
}

export function AppImage({
  src,
  alt,
  className,
  width = 1200,
  height = 800,
  sizes = '100vw',
  priority = false,
}: AppImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
