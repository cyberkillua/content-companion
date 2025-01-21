import { writable } from "svelte/store";

export const isGenerating = writable(false);
export const hasSelection = writable(false);
