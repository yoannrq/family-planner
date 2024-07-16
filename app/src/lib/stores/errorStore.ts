// [ Package imports]
import { writable } from 'svelte/store';

export const errorStore = writable<App.ErrorInfo>({ status: 0, message: '' });

export function addError(status: number, message: string) {
	errorStore.set({ status, message });
}

export function clearError() {
	errorStore.set({ status: 0, message: '' });
}
