import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import Picture from './Picture';

describe('<Picture>', () => {
  it('emits AVIF + WebP sources for a JPG', () => {
    const { container } = render(<Picture src="/img/alb1.jpg" alt="封面" />);
    const sources = container.querySelectorAll('source');
    expect(sources).toHaveLength(2);
    expect(sources[0]?.getAttribute('type')).toBe('image/avif');
    expect(sources[0]?.getAttribute('srcset')).toBe('/img/alb1.avif');
    expect(sources[1]?.getAttribute('type')).toBe('image/webp');
    expect(sources[1]?.getAttribute('srcset')).toBe('/img/alb1.webp');
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/img/alb1.jpg');
    expect(img?.getAttribute('alt')).toBe('封面');
  });

  it('handles PNG paths', () => {
    const { container } = render(<Picture src="/img/recorder.png" alt="" />);
    const avif = container.querySelector('source[type="image/avif"]');
    expect(avif?.getAttribute('srcset')).toBe('/img/recorder.avif');
  });

  it('handles uppercase JPEG extension', () => {
    const { container } = render(<Picture src="/img/foo.JPEG" alt="" />);
    const webp = container.querySelector('source[type="image/webp"]');
    expect(webp?.getAttribute('srcset')).toBe('/img/foo.webp');
  });

  it('falls back to plain <img> for unknown extensions', () => {
    const { container } = render(<Picture src="/img/foo.gif" alt="x" />);
    expect(container.querySelector('picture')).toBeNull();
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/img/foo.gif');
  });

  it('forwards extra props to the underlying <img>', () => {
    const { container } = render(
      <Picture src="/img/x.jpg" alt="" loading="lazy" className="w-10" />,
    );
    const img = container.querySelector('img');
    expect(img?.getAttribute('loading')).toBe('lazy');
    expect(img?.className).toBe('w-10');
  });
});
