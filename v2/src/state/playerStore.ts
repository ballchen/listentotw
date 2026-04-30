import { useSyncExternalStore } from 'react';

export type PlayerState = {
  /** index into tracks[] */
  currentIndex: number;
  /** true while playing */
  playing: boolean;
  /** rotating disc + arm in 'changing' transition */
  changing: boolean;
};

type Listener = () => void;

const state: PlayerState = {
  currentIndex: 0,
  playing: false,
  changing: false,
};

const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

export const playerStore = {
  get: () => state,
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  setIndex(i: number) {
    if (i === state.currentIndex) return;
    state.changing = true;
    state.playing = false;
    emit();
    setTimeout(() => {
      state.currentIndex = i;
      emit();
    }, 1000);
    setTimeout(() => {
      state.changing = false;
      emit();
    }, 2000);
  },
  setPlaying(p: boolean) {
    if (state.changing) return;
    state.playing = p;
    emit();
  },
  togglePlay() {
    this.setPlaying(!state.playing);
  },
  stop() {
    state.playing = false;
    emit();
  },
};

export function usePlayer() {
  return useSyncExternalStore(playerStore.subscribe, playerStore.get, playerStore.get);
}
