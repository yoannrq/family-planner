/// <reference types="@sveltejs/kit" />

import type { ViewApi } from '@fullcalendar/core';

declare global {
	namespace App {
		interface User {
			id: number;
			email: string;
			name: string;
			settingColorId: number;
			profilePictureUrl?: string;
		}

		interface Group {
			id: number;
			name: string;
			colorId: number;
			ownerId: number;
			createdAt: string;
			updatedAt?: string;
		}

		interface GroupWithUsers extends Group {
			users: User[];
		}

		interface Color {
			id: number;
			name: string;
			hexCode: string;
			createdAt: string;
			updatedAt?: string;
		}

		interface Contact {
			id: number;
			firstname: string;
			lastname: string;
			colorId: number;
			phone: string;
			email: string;
			address: string;
			type: string;
			profilePictureUrl?: string;
			content?: string;
			groupId: number;
			createdAt: string;
			updatedAt?: string;
		}

		interface Person {
			id?: number;
			name?: string;
			settingColorId?: number;
			firstname?: string;
			lastname?: string;
			colorId?: number;
			phone?: string;
			email?: string;
			address?: string;
			type?: string;
			profilePictureUrl?: string;
			content?: string;
			groupId?: number;
			createdAt?: string;
			updatedAt?: string;
		}

		type ContactCreationData = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;

		interface CalendarEntry {
			id: number;
			title: string;
			description?: string;
			startAt: string;
			endAt: string;
			allDay: boolean;
			location?: string;
			groupId: number;
			colorId: number;
			authorId: number;
			createdAt: string;
			updatedAt?: string;
		}

		type CalendarEntryCreationData = Omit<CalendarEntry, 'id' | 'createdAt' | 'updatedAt'>;

		type CalendarEntriesUpdatedWithLastUpdateTimestamp = {
			entries: CalendarEntry[];
			lastUpdateTimestamp: string;
		};

		interface FullCalendarInfo {
			date: Date;
			dateStr: string;
			allDay: boolean;
			dayEl: HTMLElement;
			jsEvent: TouchEvent | MouseEvent;
			view: ViewApi;
		}

		interface Locals {
			user: User | null;
		}

		interface LayoutData {
			user: User;
			groups: Group[];
			groupId: string;
		}

		interface LayoutDataWithoutGroupId {
			user: User;
			groups: Group[];
		}

		interface ErrorInfo {
			status: number;
			message: string;
		}

		// interface Error {}
		// interface Platform {}
	}
}

export {};
