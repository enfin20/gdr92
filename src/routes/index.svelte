<script context="module">
</script>

<script>
	import { respond } from '@sveltejs/kit/ssr';
	import { text } from 'svelte/internal';
	import { YYYY_MM_DD, MM } from '$lib/date_functions';

	let loginVisible = 'flex';
	let calendrierVisible = 'none';
	let menuVisible = 'none';
	let retourVisible = 'none';

	let loggedBenevole = '';
	let statutSauvegarde =
		' Même si tu ne viens pas du tout, enregistre-toi (ça évitera les relances)';

	let soirees = [];
	let maraude = '';
	let prepa = '';
	let retourSoiree = [];
	let retourSoirees = [];
	let benevoles = [];
	let rs = '';
	let soiree = YYYY_MM_DD().date;

	import CalendrierForm from '/src/lib/components/calendrierForm.svelte';
	import LoginForm from '/src/lib/components/loginForm.svelte';
	import RetourSoireeForm from '/src/lib/components/retourSoireeForm.svelte';
	import RetourSoireeListe from '/src/lib/components/retourSoireesListe.svelte';
	import CalendrierComplet from '/src/lib/components/calendrierDisplay.svelte';
	let email = '';

	export async function getBenevole(event) {
		// login et affichage du formulaire de saisie
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

	export async function updateCalendrier() {
		//enregistrement du calendrier
		statutSauvegarde = '    ... en cours';
		const res = await fetch('/calendrierBenevoles/calendrierBenevole', {
			method: 'PUT',
			body: JSON.stringify(soirees)
		});
		statutSauvegarde = '    Calendrier enregistré';
	}

	export async function showSoiree() {
		// affichage des soirées pour les rs
		retourVisible = 'block';
		calendrierVisible = 'none';

		getBenevolesSoiree();
		getRetourSoirees();
	}

	export async function getBenevolesSoiree() {
		// affichage des bénévoles présents à la soirée
		try {
			const res = await fetch('/retourSoirees/retourSoiree?soiree=' + soiree);
			const retour = await res.json();
			const ben = await retour.benevoles;
			const benT = [];

			for (var i = 0; i < ben.length; i++) {
				var obj = new Object();
				obj.benevole = ben[i].prenom + ' ' + ben[i].nom;
				obj.tel = ben[i].tel;
				obj.statut = 'Oui';
				benT.push(obj);
			}
			benevoles = await benT;

			retourSoiree = await retour.retourSoiree[0];
		} catch {
			alert('Pb tres grave');
		}
	}

	export async function getRetourSoirees() {
		// affichage des précédentes soirées
		statutSauvegarde = '';
		const res = await fetch('./retourSoirees');
		const soir = await res.json();
		retourSoirees = await soir.retourSoirees;
	}

	export async function updateSoiree() {
		// Mise à jour de la soirée
		statutSauvegarde = '    ... en cours';
		var retSoiree = new Object();
		retSoiree.soiree = retourSoiree.soiree;
		retSoiree.rs = loggedBenevole;
		retSoiree.nbGare = retourSoiree.nbGare;
		retSoiree.nbPeri = retourSoiree.nbPeri;
		retSoiree.commentaires = retourSoiree.commentaires;
		retSoiree.benevoles = benevoles;
		console.log(' ret ' + retSoiree);
		const res = await fetch('/retourSoirees/retourSoiree', {
			method: 'PUT',
			body: JSON.stringify(retSoiree)
		});
		statutSauvegarde = '    Soirée enregistrée';
	}
</script>

<svelte:head>
	<title>Planning restos Colombes</title>
</svelte:head>
<div style="display:none">
	<a href="/rg">
		<div class="mr-3 inline-block   bg-pink-200 hover:bg-pink-300 rounded py-1 px-3  text-gray-600">
			Planning {MM(new Date().getMonth()).mois}
		</div>
	</a>
	<a href="/rg">
		<div class="mr-3 inline-block   bg-pink-200 hover:bg-pink-300 rounded py-1 px-3  text-gray-600">
			Planning {MM(new Date().getMonth() + 1).mois}
		</div>
	</a>
</div>
<span style="display: {loginVisible};">
	<div class="py-4 grid gap-1">
		<h1 class="text-2xl my-8 font-bold text-gray-800 md:text-3xl">Login</h1>

		<LoginForm {email} on:message={getBenevole} />
	</div></span
>
<div style="display: {menuVisible};">
	<div class="w-1/2 md:w-1/6">
		<input
			id="soiree"
			type="date"
			bind:value={soiree}
			class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
		/>
	</div>
	<div class="md:w-1/12" />
	<div class="w-1/2 md:w-1/3">
		<button
			type="submit"
			name="s"
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
			><span class=" my-2 text-gray-800 text-sm">
				{statutSauvegarde}
			</span>
		</form>
	</div>
	<div class="py-4 grid gap-1 w-full md:w-1/2">
		<div class="container mb-2 flex mx-auto w-full items-center justify-center">
			<ul class="flex flex-col p-4 w-full">
				{#each soirees as calendrier}
					<CalendrierForm {calendrier} {maraude} {prepa} />
				{/each}
			</ul>
		</div>
	</div>
</div>
<div style="display: {retourVisible};">
	<div class="py-2 w-full md:w-1/2">
		<div class="flex mb-2 text-gray-500 font-bold">
			<div class="w-1/2">Responsable soirée</div>
			<div class="w-1/2">
				{rs}
			</div>
		</div>

		{#each benevoles as benevole}
			<RetourSoireeForm {benevole} />
		{/each}

		<div class="py-2 flex w-full">
			<div class=" w-1/2">
				<label class="text-gray-500 font-bold" for="gare"> Nombre Gare </label>
			</div>
			<div class="w-1/2">
				<input
					type="text"
					bind:value={retourSoiree.nbGare}
					name="gare"
					placeholder=""
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
		</div>
		<div class="py-2 flex w-full">
			<div class="w-1/2">
				<label class="block text-gray-500 font-bold" for="peri"> Nombre Gabriel Péri </label>
			</div>
			<div class="w-1/2">
				<input
					type="text"
					bind:value={retourSoiree.nbPeri}
					name="peri"
					placeholder=""
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
		</div>
		<div class="py-2 flex w-full">
			<div class="w-1/2">
				<label class="block text-gray-500 font-bold" for="commentaires"> Commentaires </label>
			</div>
			<div class="w-1/2">
				<textarea
					rows="10"
					bind:value={retourSoiree.commentaires}
					name="commentaires"
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
		</div>
		<form class="my-6" on:submit|preventDefault={updateSoiree}>
			<div class="py-2 flex w-full">
				<div class="w-1/2" />
				<div class="w-1/2">
					<button
						type="submit"
						class="shadow bg-green-400 hover:bg-green-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
						>Entrer</button
					><span class=" my-2 text-gray-800 text-sm">
						{statutSauvegarde}
					</span>
				</div>
			</div>
		</form>
	</div>

	<div class="py-2 grid gap-1 w-full">
		<RetourSoireeListe {retourSoirees} />
	</div>
</div>
