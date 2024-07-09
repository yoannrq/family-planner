/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface User {
			email: string;
			name: string;
			profilePictureUrl?: string;
		}

		interface Group {
			id: string;
			name: string;
			colorId: string;
			createdAt: string;
			updatedAt?: string;
		}

		interface Locals {
			user: User | null;
		}

		interface LayoutData {
			user: User;
			groups: Group[];
		}

		// interface Error {}
		// interface Platform {}
	}
}

export {};
