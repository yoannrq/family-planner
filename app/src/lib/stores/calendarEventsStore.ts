// [ Package imports ]
import { writable } from 'svelte/store';

export const calendarEventsStore = writable<App.CalendarEntry[]>();

export function storeCalendarEvents(calendarEvents: App.CalendarEntry[]) {
	calendarEventsStore.set(calendarEvents);
}

export function clearCalendarEvents() {
	calendarEventsStore.set([]);
}
