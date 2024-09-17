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

	// [ Component imports ]
	import CategoryHeader from '$lib/components/CategoryHeader.svelte';
	import FloatingCreationButton from '$lib/components/FloatingCreationButton.svelte';

	// [ Store imports ]
	import { getHexCodeColor } from '$lib/stores/colorStore';
	import {
		calendarSelectedDateStore,
		storeCalendarSelectedDateStore
	} from '$lib/stores/calendarSelectedDateStore';

	export let data: PageData;

	let calendarEl: HTMLElement;

	const eventsList: App.CalendarEntry[] = [
		{
			id: 1,
			title: 'Rendez-vous chez le docteur',
			date: '2024-09-26',
			startTime: '2024-09-26T10:00:00',
			entireDay: true,
			location: '123 rue du port',
			groupId: 1,
			authorId: 1,
			colorId: 1,
			createdAt: new Date().toString()
		},
		{
			id: 2,
			title: 'Evenement 222',
			date: '2024-09-27',
			startTime: '2024-09-27T10:00:00',
			endTime: '2024-09-27T12:00:00',
			entireDay: false,
			location: 'Quelque part',
			groupId: 1,
			authorId: 1,
			colorId: 3,
			createdAt: new Date().toString()
		},
		{
			id: 2,
			title: 'Evenement 54545',
			date: '2024-09-27',
			startTime: '2024-09-27T12:30:00',
			endTime: '2024-09-27T15:00:00',
			entireDay: false,
			location: 'Au rond point',
			groupId: 1,
			authorId: 2,
			colorId: 3,
			createdAt: new Date().toString()
		}
	];

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
		events: eventsList.map(mapCalendarEntryToFullCalendar),
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
			start: entry.entireDay ? entry.date : entry.startTime,
			end: entry.endTime,
			allDay: entry.entireDay,
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

		if (calendarEl) {
			const calendar = new Calendar(calendarEl, calendarOptions);

			calendar.render();
		}
	});
</script>

<CategoryHeader user={data.user} groupId={data.groupId} currentPage="calendar" />

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
</style>
