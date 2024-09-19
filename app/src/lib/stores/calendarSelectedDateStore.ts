// [ Package imports ]
import { writable } from 'svelte/store';

export const calendarSelectedDateStore = writable<App.FullCalendarInfo | undefined>();

export function storeCalendarSelectedDateStore(calendarSelectedDate: App.FullCalendarInfo) {
	calendarSelectedDateStore.set(calendarSelectedDate);
}

export function clearCalendarSelectedDateStore() {
	calendarSelectedDateStore.set(undefined);
}
