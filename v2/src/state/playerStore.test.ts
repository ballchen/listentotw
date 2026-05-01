import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { playerStore } from './playerStore';

describe('playerStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // reset to a known state
    playerStore.stop();
    // reset index back to 0 by walking through a setIndex cycle
    if (playerStore.get().currentIndex !== 0) {
      playerStore.setIndex(0);
      vi.advanceTimersByTime(2100);
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at index 0, not playing, not changing', () => {
    expect(playerStore.get()).toMatchObject({
      currentIndex: 0,
      playing: false,
      changing: false,
    });
  });

  it('togglePlay flips the playing flag', () => {
    expect(playerStore.get().playing).toBe(false);
    playerStore.togglePlay();
    expect(playerStore.get().playing).toBe(true);
    playerStore.togglePlay();
    expect(playerStore.get().playing).toBe(false);
  });

  it('setIndex enters changing state, swaps cover after 1s, ends after 2s', () => {
    playerStore.setIndex(3);
    expect(playerStore.get()).toMatchObject({
      changing: true,
      playing: false,
    });
    expect(playerStore.get().currentIndex).toBe(0);

    vi.advanceTimersByTime(1000);
    expect(playerStore.get().currentIndex).toBe(3);
    expect(playerStore.get().changing).toBe(true);

    vi.advanceTimersByTime(1000);
    expect(playerStore.get().changing).toBe(false);
  });

  it('setIndex is a no-op when targeting current index', () => {
    const before = { ...playerStore.get() };
    playerStore.setIndex(0);
    expect(playerStore.get()).toEqual(before);
  });

  it('setPlaying is ignored while changing', () => {
    playerStore.setIndex(2);
    expect(playerStore.get().changing).toBe(true);
    playerStore.setPlaying(true);
    expect(playerStore.get().playing).toBe(false);
    vi.advanceTimersByTime(2100);
  });

  it('subscribe receives updates and unsubscribe stops them', () => {
    const fn = vi.fn();
    const unsub = playerStore.subscribe(fn);
    playerStore.setPlaying(true);
    expect(fn).toHaveBeenCalledTimes(1);
    playerStore.setPlaying(false);
    expect(fn).toHaveBeenCalledTimes(2);
    unsub();
    playerStore.setPlaying(true);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
