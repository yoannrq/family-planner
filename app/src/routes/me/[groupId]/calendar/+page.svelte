<script lang="ts">
	// [ Package imports ]
	import { CapacitorCalendar } from '@ebarooni/capacitor-calendar';
	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import interactionPlugin from '@fullcalendar/interaction';
	import type { CalendarOptions } from '@fullcalendar/core';
	import frLocale from '@fullcalendar/core/locales/fr';

	// [ Local imports ]
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { getCalendarEntries } from '$lib/api/calendar';

	// [ Component imports ]
	import CategoryHeader from '$lib/components/CategoryHeader.svelte';
	import FloatingCreationButton from '$lib/components/FloatingCreationButton.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	// [ Store imports ]
	import { get } from 'svelte/store';
	import { getHexCodeColor } from '$lib/stores/colorStore';
	import {
		calendarSelectedDateStore,
		clearCalendarSelectedDateStore,
		storeCalendarSelectedDateStore
	} from '$lib/stores/calendarSelectedDateStore';
	import {
		calendarEventsStore,
		initializeCalendarEvents,
		checkAndUpdateCalendarEvents
	} from '$lib/stores/calendarEventsStore';
	import { loading } from '$lib/stores/loadingStatus';
	import { errorStore } from '$lib/stores/errorStore';

	export let data: PageData;

	let calendarEl: HTMLElement;
	let eventsList: App.CalendarEntry[] = [];
	const groupId = data.groupId;

	const calendarOptions: CalendarOptions = {
		plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
		initialView: 'dayGridMonth',
		locale: frLocale,
		height: 'auto',
		headerToolbar: {
			left: 'prev',
			center: 'title',
			right: 'next'
		},
		footerToolbar: {
			left: 'dayGridMonth,timeGridWeek,timeGridDay'
		},
		views: {
			timeGridWeek: {
				dayHeaderFormat: { weekday: 'short', day: 'numeric' }
			}
		},
		editable: true,
		dayMaxEvents: true,
		dateClick: dateClickHandler,
		eventClick: (info) => {
			console.log(info);
		}
	};

	async function checkAndRequestPermissions() {
		const permissionStatus = await CapacitorCalendar.checkAllPermissions();
		if (permissionStatus.read !== 'granted' || permissionStatus.write !== 'granted') {
			await CapacitorCalendar.requestAllPermissions();
		}
	}

	function mapCalendarEntryToFullCalendar(entry: App.CalendarEntry) {
		return {
			id: entry.id.toString(),
			title: entry.title,
			start: entry.startAt,
			end: entry.endAt,
			allDay: entry.allDay,
			location: entry.location,
			color: getHexCodeColor(entry.colorId)
		};
	}

	function dateClickHandler(info: App.FullCalendarInfo) {
		// Double click on the same date
		if ($calendarSelectedDateStore && $calendarSelectedDateStore.dateStr === info.dateStr) {
			goto(`/me/${data.groupId}/calendar/add-calendar`);
		} else {
			if ($calendarSelectedDateStore) {
				$calendarSelectedDateStore.dayEl.style.backgroundColor = 'transparent';
			}
			info.dayEl.style.backgroundColor = `${getHexCodeColor(data.user.settingColorId)}33`;
			storeCalendarSelectedDateStore(info);
		}
	}

	onMount(async () => {
		await checkAndRequestPermissions();
		clearCalendarSelectedDateStore();
		loading.set(true);

		eventsList = get(calendarEventsStore);

		if (!eventsList || eventsList.length === 0) {
			eventsList = await getCalendarEntries(data.groupId);
			initializeCalendarEvents(eventsList);
		} else {
			const isCalendarEventsUpdated = await checkAndUpdateCalendarEvents(groupId);
			if (!isCalendarEventsUpdated) {
				eventsList = await getCalendarEntries(data.groupId);
				initializeCalendarEvents(eventsList);
			}
			eventsList = get(calendarEventsStore);
		}

		if (calendarEl) {
			const calendar = new Calendar(calendarEl, calendarOptions);
			const mappedEvents = eventsList.map(mapCalendarEntryToFullCalendar);
			calendar.addEventSource({ events: mappedEvents });
			calendar.render();
		}
		loading.set(false);
	});
</script>

<CategoryHeader user={data.user} groupId={data.groupId} currentPage="calendar" />

{#if $errorStore.status > 0}
	<ErrorDisplay message={$errorStore.message} severity="warning" />
{/if}
{#if $loading}
	<p class="loading-bloc"></p>
{/if}
<main class="calendar-container">
	<div bind:this={calendarEl} id="calendar"></div>
</main>

<FloatingCreationButton
	currentPage="calendar"
	groupId={data.groupId}
	settingColorId={data.user.settingColorId}
/>

<style>
	.calendar-container {
		height: 80vh;
		padding: 1rem;
		box-sizing: border-box;
	}

	:global(.fc .fc-toolbar.fc-header-toolbar) {
		margin-bottom: 1em;
	}

	:global(.fc-toolbar-chunk) {
		text-align: center;
	}

	:global(.fc .fc-toolbar.fc-footer-toolbar) {
		margin-top: 0.4em;
		position: fixed;
		bottom: 1.25rem;
		left: 1.25rem;
		z-index: 100;
	}

	:global(.fc-event) {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@keyframes pulseColor {
		0% {
			color: var(--color-primary);
		}
		50% {
			color: var(--color-secondary);
		}
		100% {
			color: var(--color-primary);
		}
	}

	@keyframes loadingDots {
		0% {
			content: 'Chargement des évènements';
		}
		25% {
			content: 'Chargement des évènements.';
		}
		50% {
			content: 'Chargement des évènements..';
		}
		75% {
			content: 'Chargement des évènements...';
		}
	}

	.loading-bloc {
		font-size: 1.5rem; /* 16px */
		width: 70%;
		animation: pulseColor 2s infinite;
	}

	.loading-bloc::after {
		content: '';
		animation: loadingDots 1.5s steps(4, end) infinite;
	}
</style>
