import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET } from '$env/static/private';
import { PUBLIC_URL_API } from '$env/static/public';
import google from '@auth/sveltekit/providers/google';

export const { handle } = SvelteKitAuth({
	providers: [
		Google({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					scope: 'openid email profile',
					prompt: 'select_account'
				}
			}
		})
	],
	secret: AUTH_SECRET,
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			const existingUser = await fetch(`${PUBLIC_URL_API}/me`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({ email })
			})
				.then((res) => res.json())
				.catch((error) => {
					console.error('Error signIn GET existingUser:', error);
				});
			
			if (!existingUser) {
				await fetch(`${PUBLIC_URL_API}/auth/signup`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include',
					body: JSON.stringify({ email, name: profile?.name, googleId: profile?.id, password: })
				})
					.then((res) => res.json())
					.catch((error) => {
						console.error('Error signIn POST signup:', error);
					});
			}

			return true;
		},
		async redirect({ url, baseUrl }) {
			// Personnalisez la redirection après l'authentification
			return baseUrl + '/dashboard'; // Par exemple, redirigez vers le tableau de bord
		},
		async session({ session, user, token }) {
			// Personnalisez les données de session
			return session;
		}
	}
});
