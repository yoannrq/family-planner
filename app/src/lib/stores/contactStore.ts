// [ Package imports]
import { writable } from 'svelte/store';

export const contactStore = writable<App.Contact>();

export function addContact(contact: App.Contact) {
	contactStore.set({ ...contact });
}

export function clearContact() {
	contactStore.set({
		id: 0,
		firstname: '',
		lastname: '',
		colorId: 0,
		phone: '',
		email: '',
		address: '',
		type: '',
		content: '',
		profilePictureUrl: '',
		groupId: 0,
		createdAt: '',
		updatedAt: ''
	});
}
