import * as React from 'react'
import { Skeleton } from './skeleton'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
}

export function LazyImage({ src, alt, className, ...props }: LazyImageProps) {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <div className={className} style={{ position: 'relative' }}>
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  )
}

