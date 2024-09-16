import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.example.app',
	appName: 'Family Planner',
	webDir: 'build',
	bundledWebRuntime: false,
	plugins: {
		CapacitorHttp: {
			enabled: true
		},
		Preferences: {
			enabled: true
		},
		Calendar: {
			enabled: true
		}
	}
};

export default config;
