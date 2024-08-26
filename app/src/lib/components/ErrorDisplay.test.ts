// [ Package imports ]
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';

// [ Local imports ]
import ErrorDisplay from './ErrorDisplay.svelte';
import { goto } from '$app/navigation';

// Dependencies mocking
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('ErrorDisplay Component Tests', () => {
	it('should render the error message', () => {
		render(ErrorDisplay, { props: { message: 'Test error', severity: 'error' } });
		expect(screen.getByText('Test error')).toBeTruthy();
	});

	it('should apply the correct class based on severity', () => {
		const { container } = render(ErrorDisplay, { props: { message: 'Test', severity: 'warning' } });
		expect(container.querySelector('.warning')).toBeTruthy();
	});

	it('should show reload button for error severity', () => {
		render(ErrorDisplay, { props: { message: 'Test error', severity: 'error' } });
		expect(screen.getByText('Recharger la page')).toBeTruthy();
	});

	it('should not show reload button for non-error severities', () => {
		render(ErrorDisplay, { props: { message: 'Test info', severity: 'info' } });
		expect(screen.queryByText('Recharger la page')).toBeFalsy();
	});

	it('should call goto when reload button is clicked', async () => {
		render(ErrorDisplay, { props: { message: 'Test error', severity: 'error' } });
		await fireEvent.click(screen.getByText('Recharger la page'));
		expect(goto).toHaveBeenCalledWith('/login');
	});
});
