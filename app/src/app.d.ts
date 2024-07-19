/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface User {
			email: string;
			name: string;
			settingColorId: number;
			profilePictureUrl?: string;
		}

		interface Group {
			id: number;
			name: string;
			colorId: number;
			createdAt: string;
			updatedAt?: string;
		}

		interface Color {
			id: number;
			name: string;
			hexCode: string;
			createdAt: string;
			updatedAt?: string;
		}

		interface Locals {
			user: User | null;
		}

		interface LayoutData {
			user: User;
			groups: Group[];
			groupId?: string;
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
