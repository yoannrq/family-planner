// [ Package imports ]
import { writable, get } from 'svelte/store';

// [ Local imports ]
import { getCalendarEntriesUpdated } from '$lib/api/calendar';

export const calendarEventsStore = writable<App.CalendarEntry[]>();
export const lastUpdateTimestamp = writable(new Date(0));

export function storeCalendarEvents(calendarEvents: App.CalendarEntry[]) {
	calendarEventsStore.set(calendarEvents);
}

export function clearCalendarEvents() {
	calendarEventsStore.set([]);
}

export async function checkAndUpdateCalendarEvents(groupId: number | string): Promise<boolean> {
	try {
		const lastUpdate = get(lastUpdateTimestamp);

		const { entries, lastUpdateTimestamp: newLastUpdate } = await getCalendarEntriesUpdated(
			groupId,
			lastUpdate.toISOString()
		);

		if (entries.length > 0) {
			// Updating stored entries when response entries have been updated
			const storedEntries = get(calendarEventsStore);
			entries.forEach((responseEntry) => {
				const index = storedEntries.findIndex((storedEntry) => storedEntry.id === responseEntry.id);
				if (index >= 0) {
					storedEntries[index] = responseEntry;
				} else {
					storedEntries.push(responseEntry);
				}
			});
			calendarEventsStore.set(storedEntries);
			lastUpdateTimestamp.set(new Date(newLastUpdate));
			return true;
		}
		return false; // No updates available
	} catch (error) {
		console.error('Erreur lors de la vérification des mises à jour:', error);
		return false;
	}
}

export function initializeCalendarEvents(initialEvents: App.CalendarEntry[]) {
	// Set the initial events in the store
	calendarEventsStore.set(initialEvents);

	// Find the latest update timestamp using reduce
	const latestDate = initialEvents.reduce((latest, event) => {
		if (event.updatedAt) {
			const eventDate = new Date(event.updatedAt).getTime();
			// Return the greater of the current latest and this event's timestamp
			return Math.max(latest, eventDate);
		}
		return latest;
	}, 0);

	// If we found a valid timestamp (greater than 0), update the lastUpdateTimestamp
	if (latestDate > 0) {
		lastUpdateTimestamp.set(new Date(latestDate));
	}
}
