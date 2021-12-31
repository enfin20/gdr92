<script context="module">
</script>

<script>
	import { respond } from '@sveltejs/kit/ssr';
	import { text } from 'svelte/internal';

	let loggedBenevole = '';
	let loginVisible = 'flex';
	let statutSauvegarde = '';
	let calendrierVisible = 'none';
	let soirees = [];
	let maraude = '';
	let prepa = '';

	import CalendrierForm from '/src/lib/components/calendrierForm.svelte';
	import LoginForm from '/src/lib/components/loginForm.svelte';

	let email = '';
	export async function getBenevole(event) {
		email = event.detail.text;
		const res = await fetch('/benevole?email=' + email);
		const benevole = await res.json();
		try {
			loggedBenevole = benevole.benevole.prenom + ' ' + benevole.benevole.nom;
			if (benevole.benevole.maraude === undefined) {
				maraude = 'Non';
			} else {
				maraude = benevole.benevole.maraude;
			}
			if (benevole.benevole.prepa === undefined) {
				prepa = 'Non';
			} else {
				prepa = benevole.benevole.prepa;
			}
			console.log('maraude : ' + maraude + ' prepa : ' + prepa);
			// pour charger le calendrier du bénévole
			const res = await fetch('/calendrierBenevole?email=' + email);
			const calendriers = await res.json();
			try {
				loginVisible = 'none';
				calendrierVisible = 'inline';
				soirees = calendriers.calendrier;
			} catch {
				console.log('il y a un probleme de connexion');
			}
		} catch {
			alert('Email non valide');
		}
	}

	//enregistrement du calendrier
	export async function updateCalendrier() {
		const res = await fetch('/calendrierBenevole', {
			method: 'PUT',
			body: JSON.stringify(soirees)
		});
		statutSauvegarde = '    Calendrier enregistré';
	}
</script>

<svelte:head>
	<title>Planning restos Colombes</title>
</svelte:head>

<span style="display: {loginVisible};">
	<div class="py-4 grid gap-1">
		<h1 class="text-2xl my-8 font-bold text-gray-800 md:text-3xl">Login</h1>

		<LoginForm {email} on:message={getBenevole} />
	</div></span
>
<span style="display: {calendrierVisible};">
	<div class="py-2 grid gap-1">
		<form class="my-1" on:submit|preventDefault={updateCalendrier}>
			<span class="text-2xl my-2 font-bold text-gray-800 md:text-2xl">{loggedBenevole}</span>
			<button
				type="submit"
				class="bg-green-400 hover:bg-green-600 text-gray-600 font-bold py-2 px-4 rounded"
				>Enregistrer</button
			><span class="text-xl my-2 text-gray-800 md:text-xl">{statutSauvegarde}</span>
		</form>
	</div>
	<div class="py-4 grid gap-1">
		<div class="container mb-2 flex mx-auto w-full items-center justify-center">
			<ul class="flex flex-col p-4">
				{#each soirees as calendrier}
					<CalendrierForm {calendrier} {maraude} {prepa} />
				{/each}
			</ul>
		</div>
	</div>
</span>
