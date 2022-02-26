<script context="module">
</script>

<script>
	import { MM_YYYY, date_YYYYMM, date_DD_MM, MM, YYYYMM, date_YYYYMMDD } from '$lib/date_functions';
	import { respond } from '@sveltejs/kit/ssr';
	import {
		claim_element,
		clear_loops,
		each,
		text,
		time_ranges_to_array,
		to_number
	} from 'svelte/internal';
	import LoginForm from '/src/lib/components/loginForm.svelte';
	import RetourSoireeListe from '/src/lib/components/retourSoireesListe.svelte';
	import BenevolesListe from '/src/lib/components/benevolesListe.svelte';
	import CalendrierManagement from '/src/lib/components/calendrierManagement.svelte';

	let calendriers = [];
	let benevoles = [];
	let benevolesSansReponses = [];
	let soiree = '';
	let retourSoirees = [];
	let currentEquipe = 'Camion';

	let loginVisible = 'flex';
	const pwdVisible = 'flex';
	let menuVisible = 'hidden';
	let calendrierVisible = 'hidden';
	let dateVisible = 'hidden';
	let benevolesVisible = 'hidden';
	let soireeVisible = 'hidden';
	let delSoireesVisible = 'hidden';
	let benevolesSansReponseVisible = 'hidden';

	// nouvelle soirée
	let plageActive = [true, true, true, false];
	let plage = ['18h15-20h', '20h-21h30', '14h-18h', '20h-23h'];
	let lieu = ['gare', 'gp', 'entrepot', 'maraude'];
	let equipe = ['Camion', 'Camion', 'Camion', 'Maraude'];

	// desactivation de periode
	let inactivateMaraude = false;
	let inactivateCamion = false;

	let statutEnregistrement = '';
	let loginStatus = '';
	let email = '';

	export function divHidden() {
		calendrierVisible = 'hidden';
		dateVisible = 'hidden';
		benevolesVisible = 'hidden';
		soireeVisible = 'hidden';
		delSoireesVisible = 'hidden';
		benevolesSansReponseVisible = 'hidden';
	}

	export async function getBenevole(event) {
		// login du rg
		email = event.detail.text;
		let pwd = event.detail.pwd;
		const res = await fetch('/benevoles/benevole?email=' + email + '&rg=true&pwd=' + pwd);
		const benevole = await res.json();

		try {
			if (benevole.benevole.rg) {
				menuVisible = 'flex';
				loginVisible = 'hidden';
			} else {
				loginStatus = 'Email ou mot de passe non valide !';
				menuVisible = 'hidden';
				calendrierVisible = 'hidden';
				dateVisible = 'hidden';
			}
		} catch {
			alert('Email non valide');
		}
	}

	export async function showBenevoles() {
		// retrouve les bénévoles pour inert / update et delete
		divHidden();
		benevolesVisible = 'flex';

		const res = await fetch('/benevoles');
		const ben = await res.json();
		benevoles = await ben.benevoles;
	}

	export async function showDate() {
		// ajout des nouvelles soirées
		divHidden();
		dateVisible = 'block';
		soiree = MM_YYYY(1).date;
	}

	export async function ShowCalendrier() {
		// affichage du calendrier complet
		divHidden();
		calendrierVisible = 'flex';
	}

	export async function showSoiree() {
		// affichage des retours de soirée
		divHidden();
		soireeVisible = 'flex';

		const res = await fetch('./retourSoirees');
		const soir = await res.json();
		retourSoirees = await soir.retourSoirees;
	}

	export async function showDelSoirees() {
		// Pour supprimer un mois
		divHidden();
		delSoireesVisible = 'flex';

		// initialisation de soirée au mois suivant
		soiree = MM_YYYY(1).date;
	}

	export async function showBenevolesSansReponse() {
		// Pour supprimer un mois
		divHidden();
		benevolesSansReponseVisible = 'flex';

		// presentation de la liste des benevoles n'ayant pas répondu

		const res = await fetch('/calendrierBenevoles/benevolesSansReponse?equipe=Camion');
		const b = await res.json();
		benevolesSansReponses = await b.benevoles;
	}

	export async function deleteCalendrier() {
		// suppression d'un mois YYYYMM
		const soireeNormed = soiree.substring(3, 8).toString().concat(soiree.substring(0, 2));
		const res = await fetch('/calendrierBenevoles', {
			method: 'DELETE',
			body: JSON.stringify(soireeNormed)
		});
	}

	export async function saveCalendrier() {
		// tableau cible des mises à jour
		var calUpdated = [];

		for (var i = 0; i < calendriers.length; i++) {
			for (var j = 1; j < calendriers[i].length; j++) {
				var obj = new Object();
				obj._id = calendriers[i][j]._id;
				obj.statut = calendriers[i][j].presence;
				obj.updated = '';
				if (calendriers[i][j].updated === 'Oui') {
					// on n'intègre que les zones qui ont été mise à jour par CalendrierChangeStatut
					calUpdated.push(obj);
				}
			}
		}

		const res = await fetch('/calendrierBenevoles', {
			method: 'PUT',
			body: JSON.stringify(calUpdated)
		});
	}

	export async function addCalendrier() {
		var obj = new Object();
		var obj2 = new Object();
		let isCamion = '';

		obj.soiree = soiree.replaceAll('-', '');
		obj.statut = '';

		// récupération des bénévoles
		const res = await fetch('/benevoles');
		let benevoles = await res.json();
		for (var i = 0; i < benevoles.benevoles.length; i++) {
			obj.email = benevoles.benevoles[i].email;
			obj.benevole = benevoles.benevoles[i].prenom + ' ' + benevoles.benevoles[i].nom;
			obj.b_id = benevoles.benevoles[i]._id;
			for (var j = 0; j <= 3; j++) {
				if (plageActive[j]) {
					if (equipe[j] === 'Camion') {
						isCamion = 'Oui';
					}
					// planning uniquement pour les benevoles de la bonne équipe
					if (
						(benevoles.benevoles[i].camion && equipe[j] === 'Camion') ||
						(benevoles.benevoles[i].maraude && equipe[j] === 'Maraude')
					) {
						obj.plage = plage[j];
						obj.lieu = lieu[j];
						obj.equipe = equipe[j];
						const res = await fetch('/calendrierBenevoles/addCalendrierBenevoles', {
							method: 'POST',
							body: JSON.stringify(obj)
						});
					}
				}
			}
		}

		// enregistrement du retour de soirée
		if (isCamion === 'Oui') {
			obj2.soiree = soiree.replaceAll('-', '');
			obj2.nbGare = 0;
			obj2.nbPeri = 0;
			obj2.Commentaires = '';
			obj2.rs = '';
			obj2.equipe = 'Camion';
			const retourSoiree = await fetch('/retourSoirees', {
				method: 'POST',
				body: JSON.stringify(obj2)
			});
		}

		statutEnregistrement = soiree + ' : enregistrée';
	}

	export async function inactivateCalendrier() {
		if (inactivateCamion) {
			const res = await fetch('/calendrierBenevoles/inactivateCamion', {
				method: 'PUT',
				body: JSON.stringify(soiree)
			});
		}
		if (inactivateMaraude) {
			const res = await fetch('/calendrierBenevoles/inactivateMaraude', {
				method: 'PUT',
				body: JSON.stringify(soiree)
			});
		}
	}
</script>

<svelte:head>
	<title>Planning restos Colombes</title>
</svelte:head>

<span class={loginVisible}>
	<div class="py-4 grid gap-1">
		<h1 class="text-2xl my-8 font-bold text-gray-800 md:text-3xl">Login Responsable du groupe</h1>
		<LoginForm {email} {pwdVisible} on:message={getBenevole} />
		<div>{loginStatus}</div>
	</div>
</span>
<div class={menuVisible}>
	<button
		type="submit"
		name="benevoles"
		class="mr-3 inline-block   bg-pink-200 hover:bg-pink-300 rounded py-1 px-3  text-gray-600"
		on:click={showBenevoles}
	>
		Bénévoles
	</button>
	<button
		type="submit"
		name="date"
		class="mr-3 inline-block   bg-pink-200 hover:bg-pink-300 rounded py-1 px-3  text-gray-600"
		on:click={showDate}
	>
		Ajout date
	</button>
	<button
		type="submit"
		name="calendrier"
		class="mr-3 inline-block   bg-pink-200 hover:bg-pink-300 rounded py-1 px-3  text-gray-600"
		on:click={ShowCalendrier}
	>
		Calendrier
	</button>
	<button
		type="submit"
		name="benevolesSansReponse"
		class="mr-3 inline-block   bg-pink-200 hover:bg-pink-300 rounded py-1 px-3  text-gray-600"
		on:click={showBenevolesSansReponse}
	>
		Bén. sans réponse
	</button>
	<button
		type="submit"
		name="soiree"
		class="mr-3 inline-block   bg-pink-200 hover:bg-pink-300 rounded py-1 px-3  text-gray-600"
		on:click={showSoiree}
	>
		Soirées
	</button>
	<button
		type="submit"
		name="delSoirees"
		class="mr-3 inline-block   bg-pink-200 hover:bg-pink-300 rounded py-1 px-3  text-gray-600"
		on:click={showDelSoirees}
	>
		Suppression
	</button>
</div>
<div class={dateVisible}>
	<div class="py-2  ">
		<div class=" w-full">
			<p class="text-2xl font-bold text-gray-800 md:text-xl">Ajouter une soirée</p>
		</div>
		<form class="my-1" on:submit|preventDefault={addCalendrier}>
			<div class="py-2 w-full">
				<input
					type="date"
					bind:value={soiree}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class="py-2 w-full">
				<input type="checkbox" bind:checked={plageActive[0]} />
				<input
					type="text"
					bind:value={plage[0]}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>

				<input
					type="text"
					bind:value={lieu[0]}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class="py-2 w-full">
				<input type="checkbox" bind:checked={plageActive[1]} />
				<input
					type="text"
					bind:value={plage[1]}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
				<input
					type="text"
					bind:value={lieu[1]}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class="py-2 w-full">
				<input type="checkbox" bind:checked={plageActive[2]} />
				<input
					type="text"
					bind:value={plage[2]}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
				<input
					type="text"
					bind:value={lieu[2]}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class="py-2 w-full">
				<input type="checkbox" bind:checked={plageActive[3]} />
				<input
					type="text"
					bind:value={plage[3]}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
				<input
					type="text"
					bind:value={lieu[3]}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class="py-2 w-full">
				<button
					type="submit"
					class="bg-green-400 hover:bg-green-600 text-gray-600 font-bold py-2 px-4 rounded"
					>Enregistrer</button
				>
				<p>{statutEnregistrement}</p>
			</div>
		</form>
	</div>

	<div class="py-2 block w-full">
		<div class="block w-full">
			<p class="text-2xl font-bold text-gray-800 md:text-xl">Désactiver une période</p>
		</div>
		<form on:submit|preventDefault={inactivateCalendrier}>
			<div class="py-2 w-full">
				<input
					type="text"
					bind:value={soiree}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class="py-2 w-full">
				<input type="checkbox" bind:checked={inactivateMaraude} />Maraude
			</div>
			<div class="py-2 w-full">
				<input type="checkbox" bind:checked={inactivateCamion} />Camion
			</div>
			<div class="py-2 w-full">
				<button
					type="submit"
					class="shadow bg-green-400 hover:bg-green-500 focus:shadow-outline focus:outline-none text-gray-700  py-2 px-4 rounded"
					>Entrer</button
				>
			</div>
		</form>
	</div>
</div>
<div class={calendrierVisible}>
	<CalendrierManagement {currentEquipe} />
</div>
<div class={benevolesVisible}>
	<BenevolesListe {benevoles} on:showBenevoles={showBenevoles} />
</div>
<div class={soireeVisible}>
	<div class="py-2 grid gap-1 w-full flex-grow">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Soirées</p>
		<RetourSoireeListe {retourSoirees} />
	</div>
</div>
<div class={delSoireesVisible}>
	<div class="py-2 grid gap-1 w-full">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Supprimer des dates</p>
		<div class="md:flex md:items-center">
			<div class="md:w-2/3">
				<form on:submit|preventDefault={deleteCalendrier}>
					<input
						type="text"
						bind:value={soiree}
						class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
					<button
						type="submit"
						class="shadow bg-red-400 hover:bg-red-500 focus:shadow-outline focus:outline-none text-gray-700  py-2 px-4 rounded"
						>Supprimer</button
					>
				</form>
			</div>
		</div>
	</div>
</div>
<div class={benevolesSansReponseVisible}>
	<div class="py-2 grid gap-1">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Bénévoles sans réponse</p>
		{#each benevolesSansReponses as b}
			<p>{b}</p>
		{/each}
	</div>
</div>
