import { writable } from 'svelte/store';

export const team = writable<undefined | string>(undefined);
