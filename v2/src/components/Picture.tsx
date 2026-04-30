import type { ImgHTMLAttributes } from 'react';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** Path under /img (e.g. /img/recorder.png). The build pipeline
   *  produces sibling .webp and .avif. */
  src: string;
  /** Required for accessibility — pass "" for decorative images and also set ariaHidden. */
  alt: string;
};

/**
 * Drop-in replacement for <img> that emits a <picture> with AVIF and WebP
 * sources falling back to the original PNG/JPG. Originals are still served
 * so the legacy site keeps working.
 */
export default function Picture({ src, alt, ...rest }: Props) {
  const m = src.match(/^(.*)\.(png|jpe?g)$/i);
  if (!m) {
    return <img src={src} alt={alt} {...rest} />;
  }
  const base = m[1]!;
  return (
    <picture>
      <source type="image/avif" srcSet={`${base}.avif`} />
      <source type="image/webp" srcSet={`${base}.webp`} />
      <img src={src} alt={alt} {...rest} />
    </picture>
  );
}
