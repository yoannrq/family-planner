// [ Package imports ]
import { writable } from 'svelte/store';

export const calendarSelectedDateStore = writable<App.FullCalendarInfo>();

export function storeCalendarSelectedDateStore(calendarSelectedDate: App.FullCalendarInfo) {
	calendarSelectedDateStore.set(calendarSelectedDate);
}
