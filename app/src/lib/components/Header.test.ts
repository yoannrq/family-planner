// [ Package imports ]
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';

// [ Local imports ]
import Header from './Header.svelte';

describe('Header Component Tests', () => {
	const mockUser = { name: 'John Doe', email: 'john@doe.com', settingColorId: 1 };
	const mockGroups = [
		{ id: 1, name: 'Group 1', colorId: 1, createdAt: new Date().toDateString() },
		{ id: 2, name: 'Group 2', colorId: 2, createdAt: new Date().toDateString() }
	];

	it('should render user first two letters', () => {
		render(Header, { props: { user: mockUser, groups: mockGroups, groupId: '1' } });
		expect(screen.getByText('Jo')).toBeTruthy();
	});

	it('should display current group name', () => {
		render(Header, { props: { user: mockUser, groups: mockGroups, groupId: '1' } });
		expect(screen.getAllByText('Group 1')).toBeTruthy();
	});

	it('should toggle group modal on button click', async () => {
		const { container } = render(Header, {
			props: { user: mockUser, groups: mockGroups, groupId: '1' }
		});
		const button = screen.getByRole('button');
		await fireEvent.click(button);
		expect(container.querySelector('.modal-groups')?.classList.contains('hidden')).toBeFalsy();
	});
});
