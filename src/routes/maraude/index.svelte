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
	import BenevolesListe from '/src/lib/components/benevolesListe.svelte';
	import CalendrierManagement from '/src/lib/components/calendrierManagement.svelte';

	let benevoles = [];
	let benevolesSansReponses = [];
	let soiree = '';
	let currentEquipe = 'Maraude';

	let loginVisible = 'flex';
	const pwdVisible = 'flex';
	let menuVisible = 'hidden';
	let calendrierVisible = 'hidden';
	let dateVisible = 'hidden';
	let benevolesSansReponseVisible = 'hidden';
	let benevolesVisible = 'hidden';

	// nouvelle soirée
	let plageActive = [true];
	var plage = ['20h-23h'];
	let lieu = ['maraude'];
	let equipe = ['Maraude'];

	// desactivation de periode
	let inactivateMaraude = false;

	let statutEnregistrement = '';
	let email = '';
	let erreurMessageRG = '';
	let benevoleRole = 'rm';

	export function divHidden() {
		calendrierVisible = 'hidden';
		dateVisible = 'hidden';
		benevolesSansReponseVisible = 'hidden';
		benevolesVisible = 'hidden';
		erreurMessageRG = '';
		statutEnregistrement = '';
	}

	export async function getBenevole(event) {
		// login du rgm
		email = event.detail.text;
		erreurMessageRG = event.detail.erreurMessage;

		if (erreurMessageRG === '') {
			menuVisible = 'flex';
			loginVisible = 'hidden';
		} else {
			menuVisible = 'hidden';
			calendrierVisible = 'hidden';
			dateVisible = 'hidden';
		}
	}

	export async function showBenevoles() {
		// retrouve les bénévoles pour inert / update et delete
		divHidden();

		const res = await fetch('/benevoles');
		const ben = await res.json();

		if (res.status === 500) {
			erreurMessageRG = 'Erreur (contacte Olivier): ' + ben.erreur;
		} else {
			benevoles = await ben.benevoles;
			benevolesVisible = 'flex';
		}
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

	export async function showBenevolesSansReponse() {
		divHidden();

		// presentation de la liste des benevoles n'ayant pas répondu
		const res = await fetch('/calendrierBenevoles/benevolesSansReponse?equipe=Maraude');
		const b = await res.json();
		if (res.status === 500) {
			erreurMessageRG = 'Erreur (contacte Olivier): ' + b.erreur;
		} else {
			benevolesSansReponseVisible = 'flex';
			benevolesSansReponses = await b.benevoles;
		}
	}

	export async function addCalendrier() {
		var calBenevoles = [];
		statutEnregistrement = '.... en cours';

		// récupération des bénévoles
		let res = await fetch('/benevoles');
		let benevoles = await res.json();

		if (res.status === 500) {
			erreurMessageRG = 'Erreur (contacte Olivier): ' + benevoles.erreur;
		} else {
			for (var i = 0; i < benevoles.benevoles.length; i++) {
				for (var j = 0; j <= 3; j++) {
					if (plageActive[j]) {
						// planning uniquement pour les benevoles de la bonne équipe
						if (
							(benevoles.benevoles[i].camion && equipe[j] === 'Camion') ||
							(benevoles.benevoles[i].maraude && equipe[j] === 'Maraude')
						) {
							calBenevoles.push({
								soiree: soiree.replaceAll('-', ''),
								statut: '',
								email: benevoles.benevoles[i].email,
								benevole: benevoles.benevoles[i].prenom + ' ' + benevoles.benevoles[i].nom,
								b_id: benevoles.benevoles[i]._id,
								plage: plage[j],
								lieu: lieu[j],
								equipe: equipe[j]
							});
						}
					}
				}
			}
			if (calBenevoles.length > 0) {
				let res = await fetch('/calendrierBenevoles/addCalendrierBenevoles', {
					method: 'POST',
					body: JSON.stringify(calBenevoles)
				});
				let ret = await res.json();
				if (res.status === 500) {
					erreurMessageRG = 'Erreur (contacte Olivier): ' + ret.erreur;
					isCamion = 'Non';
					statutEnregistrement = '';
					i = 10000;
				} else {
					statutEnregistrement = soiree + ' : enregistrée';
				}
			}
		}
	}

	export async function inactivateCalendrier() {
		if (inactivateMaraude) {
			statutEnregistrement = '... en cours';
			const res = await fetch('/calendrierBenevoles/inactivateMaraude', {
				method: 'PUT',
				body: JSON.stringify(soiree)
			});
			let ret = await res.json();
			if (res.status === 500) {
				erreurMessageRG = 'Erreur (contacte Olivier): ' + ret.erreur;
				statutEnregistrement = '';
			} else {
				statutEnregistrement = 'Calendrier inactivé';
			}
		}
	}
</script>

<svelte:head>
	<title>Planning restos Colombes</title>
</svelte:head>
<p class="text-center text-xl font-bold text-white bg-red-600">{erreurMessageRG}</p>
<span class={loginVisible}>
	<div class="py-4 grid gap-1">
		<h1 class="text-2xl my-8 font-bold text-gray-800 md:text-3xl">Login Responsable maraude</h1>
		<LoginForm {email} {pwdVisible} {benevoleRole} on:message={getBenevole} />
	</div>
</span>
<div class={menuVisible}>
	<div class="grid grid-cols-4 text-xs md:text-base bg-pink-200 w-full">
		<button
			type="submit"
			name="benevoles"
			class="mr-3 inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase font-bold"
			on:click={showBenevoles}
		>
			Bénévoles
		</button>
		<button
			type="submit"
			name="date"
			class="mr-3 inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase font-bold"
			on:click={showDate}
		>
			Ajout date
		</button>
		<button
			type="submit"
			name="calendrier"
			class="mr-3 inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase font-bold"
			on:click={ShowCalendrier}
		>
			Calendrier
		</button>
		<button
			type="submit"
			name="benevolesSansReponse"
			class="mr-3 inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase font-bold"
			on:click={showBenevolesSansReponse}
		>
			Sans réponse
		</button>
	</div>
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
<div class={benevolesSansReponseVisible}>
	<div class="py-2 grid gap-1">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Bénévoles sans réponse</p>
		{#each benevolesSansReponses as b}
			<p>{b}</p>
		{/each}
	</div>
</div>
