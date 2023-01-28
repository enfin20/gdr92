<script>
	export let email;
	let pwd = '';
	export let benevoleRole = '';
	export let pwdVisible = 'none';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export async function getBenevole() {
		let erreurMessage = '';
		let req = '/benevoles/benevole?email=' + email;
		if (benevoleRole === 'rg') {
			req = req + '&rg=true&pwd=' + pwd;
		}
		if (benevoleRole === 'rm') {
			req = req + '&rm=true&pwd=' + pwd;
		}

		const res = await fetch(req);
		const benevole = await res.json();
		if (res.status === 500) {
			// si erreur personnalisée alors on enlève les premières lettres
			if (benevole.erreur.substring(0, 1) === 'X') {
				erreurMessage = benevole.erreur.substring(2, 50);
			} else {
				erreurMessage = 'Erreur (contacte Olivier): ' + benevole.erreur;
			}
		} else {
			if (benevoleRole === 'rg') {
				try {
					if (!benevole.benevole.rg) {
						erreurMessage = 'Mot de passe non valide !';
					}
				} catch (err) {
					erreurMessage = 'Erreur compile (contacte Olivier): ' + err.message;
				}
			}
			if (benevoleRole === 'rm') {
				try {
					if (!benevole.benevole.rm) {
						erreurMessage = 'Mot de passe non valide !';
					}
				} catch (err) {
					erreurMessage = 'Erreur compile (contacte Olivier): ' + err.message;
				}
			}
		}
		dispatch('message', {
			email: email,
			benevole: benevole,
			erreurMessage: erreurMessage
		});
	}
</script>

<div class="md:flex md:items-center mb-6">
	<div class="md:w-1/3">
		<label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="email">
			Email
		</label>
	</div>
	<div class="md:w-2/3">
		<input
			type="text"
			bind:value={email}
			name="email"
			placeholder="Email"
			class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
		/>
	</div>
</div>
<div class="md:flex md:items-center mb-6" style="display:{pwdVisible}">
	<div class="md:w-1/3">
		<label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="pwd">
			mot de passe
		</label>
	</div>
	<div class="md:w-2/3">
		<input
			type="password"
			bind:value={pwd}
			name="pwd"
			placeholder="mot de passe"
			class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
		/>
	</div>
</div>
<div class="md:flex md:items-center">
	<div class="md:w-1/3" />
	<div class="md:w-2/3">
		<button
			type="submit"
			class="shadow bg-pink-400 hover:bg-pink-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
			on:click={getBenevole}>Entrer</button
		>
	</div>
</div>
