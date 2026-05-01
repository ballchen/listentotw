import { describe, expect, it } from 'vitest';
import { tracks } from './tracks';

describe('tracks data', () => {
  it('has exactly 10 tracks', () => {
    expect(tracks).toHaveLength(10);
  });

  it('has unique sequential ids 1..10', () => {
    expect(tracks.map((t) => t.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('has unique slugs', () => {
    const slugs = new Set(tracks.map((t) => t.slug));
    expect(slugs.size).toBe(10);
  });

  it('every track has cover, mp3, ogg paths matching its id', () => {
    for (const t of tracks) {
      expect(t.cover).toBe(`/img/alb${t.id}.jpg`);
      expect(t.audio.mp3).toBe(`/audio/${t.id}.mp3`);
      expect(t.audio.ogg).toBe(`/audio/${t.id}.ogg`);
      expect(t.photos.p1).toBe(`/img/story_photo/photo${t.id}-1.jpg`);
      expect(t.photos.p2).toBe(`/img/story_photo/photo${t.id}-2.jpg`);
      expect(t.photos.p3).toBe(`/img/story_photo/photo${t.id}-3.jpg`);
    }
  });

  it('every track has non-empty narrative panels', () => {
    for (const t of tracks) {
      expect(t.intro.trim().length).toBeGreaterThan(0);
      expect(t.scene.trim().length).toBeGreaterThan(0);
      expect(t.detail.trim().length).toBeGreaterThan(0);
      expect(t.closing.trim().length).toBeGreaterThan(0);
      expect(t.tagline).toContain('請閉上眼睛');
      expect(t.title.length).toBeGreaterThan(0);
      expect(t.theme.length).toBeGreaterThan(0);
    }
  });
});
