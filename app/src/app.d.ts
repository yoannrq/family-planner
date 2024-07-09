/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface User {
			email: string;
			name: string;
			profilePictureUrl?: string;
		}

		interface Locals {
			user: User | null;
		}

		// interface Error {}
		// interface Platform {}
	}
}

export {};
