// [ Package imports ]
import { render, fireEvent, screen } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CapacitorHttp } from '@capacitor/core';

// [ Local imports ]
import Page from './+page.svelte';
import { goto } from '$app/navigation';
import { getUserGroups } from '$lib/api/group';
import { setToken, setPreferencesObject } from '$lib/auth.js';
import { initializeColorStore } from '$lib/stores/colorStore';

// Mock types
type MockCapacitorHttp = {
	request: ReturnType<typeof vi.fn>;
};

type MockGetUserGroups = ReturnType<typeof vi.fn>;

// Dépendancies mocking
vi.mock('@capacitor/core', () => ({
	CapacitorHttp: {
		request: vi.fn() as MockCapacitorHttp['request']
	}
}));
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));
vi.mock('$lib/api/group', () => ({
	getUserGroups: vi.fn() as MockGetUserGroups
}));
vi.mock('$lib/auth.js', () => ({
	setToken: vi.fn(),
	setPreferencesObject: vi.fn()
}));
vi.mock('$lib/stores/colorStore', () => ({
	initializeColorStore: vi.fn()
}));

describe('Login Page Tests', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should render correctly', () => {
		render(Page);
		expect(screen.getByText('Family Planner')).toBeTruthy();
		expect(screen.getByLabelText('Email :')).toBeTruthy();
		expect(screen.getByLabelText('Mot de passe :')).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Se connecter' })).toBeTruthy();
	});

	it('should login successfuly', async () => {
		const mockResponse = {
			status: 200,
			data: {
				accessToken: 'mockAccessToken',
				refreshToken: 'mockRefreshToken',
				email: 'test@example.com',
				name: 'Test User',
				profilpictureUrl: 'http://example.com/profile.jpg',
				settingColorId: 1
			}
		};
		(CapacitorHttp.request as MockCapacitorHttp['request']).mockResolvedValue(mockResponse);
		(getUserGroups as MockGetUserGroups).mockResolvedValue([{ id: 1 }]);

		render(Page);

		await fireEvent.input(screen.getByLabelText('Email :'), {
			target: { value: 'test@example.com' }
		});
		await fireEvent.input(screen.getByLabelText('Mot de passe :'), {
			target: { value: 'password123' }
		});
		await fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

		await vi.waitFor(() => {
			expect(setToken).toHaveBeenCalledTimes(2);
			expect(setPreferencesObject).toHaveBeenCalledTimes(2);
			expect(initializeColorStore).toHaveBeenCalled();
			expect(goto).toHaveBeenCalledWith('/me/1/dashboard');
		});
	});

	it('should display error message on login failure', async () => {
		const mockResponse = {
			status: 400,
			data: { err: { message: 'Invalid email or password' } }
		};
		(CapacitorHttp.request as MockCapacitorHttp['request']).mockResolvedValue(mockResponse);

		render(Page);

		await fireEvent.input(screen.getByLabelText('Email :'), {
			target: { value: 'test@example.com' }
		});
		await fireEvent.input(screen.getByLabelText('Mot de passe :'), {
			target: { value: 'wrongpassword' }
		});
		await fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

		const errorMessage = await screen.findByText('Invalid email or password');
		expect(errorMessage).toBeTruthy();
	});
});
