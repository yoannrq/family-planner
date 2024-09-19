import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts,svelte}'],
		environment: 'jsdom',
		globals: true
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000/api',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	},
	optimizeDeps: {
		include: [
			'@fullcalendar/core',
			'@fullcalendar/daygrid',
			'@fullcalendar/timegrid',
			'@fullcalendar/interaction'
		]
	}
});
