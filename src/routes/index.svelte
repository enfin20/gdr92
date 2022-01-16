<script context="module">
</script>

<script>
	import { respond } from '@sveltejs/kit/ssr';
	import { text } from 'svelte/internal';

	let loggedBenevole = '';
	let loginVisible = 'flex';
	let statutSauvegarde =
		' Même si tu ne viens pas du tout, enregistre-toi (ça évitera les relances)';
	let calendrierVisible = 'none';
	let menuVisible = 'none';
	let retourVisible = 'none';
	let statutVisible = 'none';
	let soirees = [];
	let maraude = '';
	let prepa = '';
	let retourSoiree = [];
	let retourSoirees = [];
	let benevoles = [];
	let rs = '';
	let currentDate = new Date();
	let soiree = currentDate
		.getFullYear()
		.toString()
		.concat('-')
		.concat(currentDate.getMonth() + 1)
		.concat('-')
		.concat(currentDate.getDate());

	import CalendrierForm from '/src/lib/components/calendrierForm.svelte';
	import LoginForm from '/src/lib/components/loginForm.svelte';
	import RetourSoireeForm from '/src/lib/components/retourSoireeForm.svelte';
	import RetourSoireeListe from '/src/lib/components/retourSoireesListe.svelte';
	let email = '';

	export async function getBenevole(event) {
		email = event.detail.text;
		const res = await fetch('/benevoles/benevole?email=' + email);
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
			if (benevole.benevole.rs === undefined) {
				menuVisible = 'Non';
			} else {
				menuVisible = 'flex';
				rs = loggedBenevole;
			}
			console.log('maraude : ' + maraude + ' prepa : ' + prepa);
			// pour charger le calendrier du bénévole
			const res = await fetch('/calendrierBenevoles/calendrierBenevole?email=' + email);
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
		const res = await fetch('/calendrierBenevoles/calendrierBenevole', {
			method: 'PUT',
			body: JSON.stringify(soirees)
		});
		statutSauvegarde = '    Calendrier enregistré';
	}
	export async function showSoiree() {
		retourVisible = 'block';
		calendrierVisible = 'none';
		getBenevolesSoiree();
		getRetourSoirees();
	}

	export async function getBenevolesSoiree() {
		try {
			const res = await fetch('/retourSoirees/retourSoiree?soiree=' + soiree);
			const retour = await res.json();
			const ben = await retour.benevoles;
			const benT = [];

			for (var i = 0; i < ben.length; i++) {
				var obj = new Object();
				obj.benevole = ben[i];
				obj.statut = 'Oui';
				benT.push(obj);
			}
			benevoles = await benT;

			retourSoiree = await retour.retourSoiree[0];
		} catch {
			alert('Pb');
		}
	}

	export async function getRetourSoirees() {
		const res = await fetch('./retourSoirees');
		const soir = await res.json();
		retourSoirees = await soir.retourSoirees;
	}
	export async function updateSoiree() {
		var retSoiree = new Object();
		retSoiree.soiree = retourSoiree.soiree;
		retSoiree.rs = loggedBenevole;
		retSoiree.nbGare = retourSoiree.nbGare;
		retSoiree.nbPeri = retourSoiree.nbPeri;
		retSoiree.commentaires = retourSoiree.commentaires;
		retSoiree.benevoles = benevoles;
		console.log(retSoiree);
		const res = await fetch('/retourSoirees/retourSoiree', {
			method: 'PUT',
			body: JSON.stringify(retSoiree)
		});
		statutVisible = 'block';
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
<div style="display: {menuVisible};">
	<div class="md:w-1/6">
		<input
			id="soiree"
			type="date"
			bind:value={soiree}
			class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
		/>
	</div>
	<div class="md:w-1/12" />
	<div class="md:w-1/3">
		<button
			type="submit"
			name="benevoles"
			class="mr-3 inline-block   bg-pink-200 hover:bg-pink-300 rounded py-2 px-4  text-gray-600"
			on:click={showSoiree}
		>
			Retour soirée
		</button>
	</div>
</div>
<div style="display: {calendrierVisible};">
	<div class="py-2 grid gap-1">
		<form class="my-1" on:submit|preventDefault={updateCalendrier}>
			<span class="text-2xl my-2 font-bold text-gray-800 md:text-2xl">{loggedBenevole}</span>
			<button
				type="submit"
				class="bg-green-400 hover:bg-green-600 text-gray-600 font-bold py-2 px-4 rounded"
				>Enregistrer</button
			><span class="text-xl my-2 text-gray-800 text-sm">{statutSauvegarde}</span>
		</form>
	</div>
	<div class="py-4 grid gap-1 w-full md:w-1/3">
		<div class="container mb-2 flex mx-auto w-full items-center justify-center">
			<ul class="flex flex-col p-4">
				{#each soirees as calendrier}
					<CalendrierForm {calendrier} {maraude} {prepa} />
				{/each}
			</ul>
		</div>
	</div>
</div>
<div style="display: {retourVisible};">
	<div
		class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
		style="display: {statutVisible};"
	>
		<span class="block sm:inline">Soirée enregistrée.</span>
	</div>

	<div class="py-2 grid gap-1 w-full md:w-1/2">
		<div class="md:flex md:items-center mb-2">
			<div class="md:w-1/2">
				<span class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
					Responsable soirée
				</span>
			</div>
			<div class="md:w-1/2">
				<span class="block text-gray-500 font-bold  mb-1 md:mb-0 pr-4">
					{rs}
				</span>
			</div>
		</div>

		{#each benevoles as benevole}
			<RetourSoireeForm {benevole} />
		{/each}

		<div class="md:flex md:items-center mb-2">
			<div class="md:w-1/2">
				<label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="gare">
					Nombre Gare
				</label>
			</div>
			<div class="md:w-1/2">
				<input
					type="text"
					bind:value={retourSoiree.nbGare}
					name="gare"
					placeholder=""
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
		</div>
		<div class="md:flex md:items-center mb-2">
			<div class="md:w-1/2">
				<label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="peri">
					Nombre Gabriel Péri
				</label>
			</div>
			<div class="md:w-1/2">
				<input
					type="text"
					bind:value={retourSoiree.nbPeri}
					name="peri"
					placeholder=""
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
		</div>
		<div class="md:flex md:items-center mb-2">
			<div class="md:w-1/2">
				<label
					class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
					for="commentaires"
				>
					Commentaires
				</label>
			</div>
			<div class="md:w-1/2">
				<textarea
					rows="10"
					bind:value={retourSoiree.commentaires}
					name="commentaires"
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
		</div>
		<form class="my-6" on:submit|preventDefault={updateSoiree}>
			<div class="md:flex md:items-center">
				<div class="md:w-1/2" />
				<div class="md:w-1/2">
					<button
						type="submit"
						class="shadow bg-green-400 hover:bg-green-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
						>Entrer</button
					>
				</div>
			</div>
		</form>
	</div>

	<div class="py-2 grid gap-1 w-full md:w-1/2">
		<RetourSoireeListe {retourSoirees} />
	</div>
</div>
