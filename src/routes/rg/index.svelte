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

	let benevoles = [];
	let benevoleSelected = '';
	let benevolesSansReponses = [];
	let benevolesAbsents = [];
	let benevolesLastSoiree = [];
	let presences = [];
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
	let benevolesSansReponseVisible = 'hidden';
	let benevolesAbsentsVisible = 'hidden';
	let benevolesLastSoireeVisible = 'hidden';
	let benevolesPresencesVisible = 'hidden';
	let erreurMessageRG = '';

	// nouvelle soirée
	let plageActive = [true, true, true, false];
	let plage = ['18h15-20h', '20h-21h30', '14h-18h', '20h-23h'];
	let lieu = ['gare', 'gp', 'entrepot', 'maraude'];
	let equipe = ['Camion', 'Camion', 'Camion', 'Maraude'];

	// desactivation de periode
	let inactivateMaraude = false;
	let inactivateCamion = false;

	let statutEnregistrement = '';
	let email = '';
	let benevoleRole = 'rg';

	export function divHidden() {
		calendrierVisible = 'hidden';
		dateVisible = 'hidden';
		benevolesVisible = 'hidden';
		soireeVisible = 'hidden';
		benevolesSansReponseVisible = 'hidden';
		benevolesAbsentsVisible = 'hidden';
		benevolesLastSoireeVisible = 'hidden';
		benevolesPresencesVisible = 'hidden';
		erreurMessageRG = '';
		statutEnregistrement = '';
	}

	export async function getBenevole(event) {
		// login du rg
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

	export async function showSoiree() {
		// affichage des retours de soirée

		const res = await fetch('./retourSoirees?equipe=Camion');
		const soir = await res.json();

		if (res.status === 500) {
			erreurMessageRG = 'Erreur (contacte Olivier): ' + soir.erreur;
		} else {
			divHidden();
			soireeVisible = 'flex';
			retourSoirees = await soir.retourSoirees;
		}
	}

	export async function showBenSansReponse() {
		divHidden();

		// presentation de la liste des benevoles n'ayant pas répondu
		const res = await fetch('/calendrierBenevoles/benevolesSansReponse?equipe=Camion');
		const b = await res.json();
		if (res.status === 500) {
			erreurMessageRG = 'Erreur (contacte Olivier): ' + b.erreur;
		} else {
			benevolesSansReponseVisible = 'flex';
			benevolesSansReponses = await b.benevoles;
		}
	}

	export async function showBenevolesAbsents() {
		divHidden();

		// presentation de la liste des benevoles n'ayant pas répondu
		const res = await fetch('/benevoles/benevolesAbsents?equipe=Camion');
		const b = await res.json();
		if (res.status === 500) {
			erreurMessageRG = 'Erreur (contacte Olivier): ' + b.erreur;
		} else {
			benevolesAbsentsVisible = 'flex';
			benevolesAbsents = await b.benevoles;
		}
	}

	export async function showBenevolesLastSoiree() {
		divHidden();

		// presentation de la liste des benevoles n'ayant pas répondu
		const res = await fetch('/benevoles/derniereSoiree?equipe=Camion');
		const b = await res.json();
		if (res.status === 500) {
			erreurMessageRG = 'Erreur (contacte Olivier): ' + b.erreur;
		} else {
			benevolesLastSoireeVisible = 'flex';
			benevolesLastSoiree = await b.benevoles;
		}
	}
	export async function showBenevolesPresences() {
		divHidden();

		// presentation de la liste des benevoles avec leur présence depuis N-1
		let res = await fetch('/benevoles/presences?equipe=Camion');
		const b = await res.json();
		if (res.status === 500) {
			erreurMessageRG = 'Erreur (contacte Olivier): ' + b.erreur;
		} else {
			benevolesPresencesVisible = 'flex';
			presences = await b.presences;
			res = await fetch('/benevoles');
			const ben = await res.json();

			if (res.status === 500) {
				erreurMessageRG = 'Erreur (contacte Olivier): ' + ben.erreur;
			} else {
				benevoles = await ben.benevoles;
				for (var i = benevoles.length - 1; i >= 0; i--) {
					benevoles[i].benevole = benevoles[i].prenom + ' ' + benevoles[i].nom;
					if (!benevoles[i].camion) {
						benevoles.splice(i, 1);
					}
				}
			}
		}
	}

	export async function addCalendrier() {
		var calBenevoles = [];
		let isCamion = '';
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
				}
			}
			for (var j = 0; j <= 3; j++) {
				if (plageActive[j]) {
					if (equipe[j] === 'Camion') {
						isCamion = 'Oui';
					}
				}
			}
			// enregistrement du retour de soirée
			if (isCamion === 'Oui') {
				const retourSoiree = await fetch('/retourSoirees', {
					method: 'POST',
					body: JSON.stringify({
						soiree: soiree.replaceAll('-', ''),
						nbGare: 0,
						nbPeri: 0,
						Commentaires: '',
						rs: '',
						equipe: 'Camion'
					})
				});
				let ret = await retourSoiree.json();
				if (retourSoiree.status === 500) {
					erreurMessageRG = 'Erreur (contacte Olivier): ' + ret.erreur;
					statutEnregistrement = '';
				} else {
					statutEnregistrement = soiree + ' : enregistrée';
				}
			}
		}
	}

	export async function inactivateCalendrier() {
		if (inactivateCamion) {
			statutEnregistrement = '... en cours';
			const res = await fetch('/calendrierBenevoles/inactivateCamion', {
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
		<h1 class="text-2xl my-8 font-bold text-gray-800 md:text-3xl">Login Responsable du groupe</h1>
		<LoginForm {email} {pwdVisible} {benevoleRole} on:message={getBenevole} />
	</div>
</span>
<div class={menuVisible}>
	<div class="grid grid-cols-4 md:grid-cols-8 text-xs md:text-base bg-pink-200 w-full">
		<button
			type="submit"
			name="benevoles"
			class="inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase font-bold"
			on:click={showBenevoles}
		>
			Bénévoles
		</button>
		<button
			type="submit"
			name="date"
			class="inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase font-bold"
			on:click={showDate}
		>
			Ajout date
		</button>
		<button
			type="submit"
			name="calendrier"
			class="inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase font-bold"
			on:click={ShowCalendrier}
		>
			Calendrier
		</button>
		<button
			type="submit"
			name="benevolesSansReponse"
			class="inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase font-bold"
			on:click={showBenSansReponse}
		>
			Sans réponse
		</button>
		<button
			type="submit"
			name="soiree"
			class="inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase font-bold"
			on:click={showSoiree}
		>
			Soirées
		</button>
		<button
			type="submit"
			name="benevolesAbsents"
			class="inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase font-bold"
			on:click={showBenevolesAbsents}
		>
			Absences
		</button>
		<button
			type="submit"
			name="benevolesPresences"
			class="inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase font-bold"
			on:click={showBenevolesPresences}
		>
			Présences
		</button>
		<button
			type="submit"
			name="lastSoiree"
			class="inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase font-bold"
			on:click={showBenevolesLastSoiree}
		>
			Dernières soirées
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
	<CalendrierManagement {currentEquipe} {statutEnregistrement} />
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
<div class={benevolesSansReponseVisible}>
	<div class="py-2 grid gap-1 w-full md:w-1/2">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Bénévoles sans réponse</p>
		<div class="flex flex-col h-screen">
			<div class="flex-grow overflow-y-auto">
				<table id="benevolesSansReponses" class="text-sm text-gray-500 w-full">
					{#each benevolesSansReponses as b}
						<tr>
							<td>{b}</td>
						</tr>
					{/each}
				</table>
			</div>
		</div>
	</div>
</div>
<div class={benevolesAbsentsVisible}>
	<div class="py-2 grid gap-1 w-full md:w-1/4">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Absences depuis 1 an</p>
		<div class="flex flex-col h-screen">
			<div class="flex-grow overflow-y-auto">
				<table id="BenevolesListe" class="text-sm text-gray-500 w-full">
					{#each benevolesAbsents as b}
						<tr>
							<td class="w-1/2">{b._id.benevole}</td>
							<td class="w-1/12">{b.absent}</td>
						</tr>
					{/each}
				</table>
			</div>
		</div>
	</div>
</div>
<div class={benevolesLastSoireeVisible}>
	<div class="py-2 grid gap-1 w-full md:w-1/4">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Dernières présences</p>
		<div class="flex flex-col h-screen">
			<div class="flex-grow overflow-y-auto">
				<table id="BenevolesListe" class="text-sm text-gray-500 w-full">
					{#each benevolesLastSoiree as b}
						<tr>
							<td class="w-1/2">{b._id}</td>
							<td class="w-1/12"
								>{b.last_soiree.substring(6, 8) +
									'/' +
									b.last_soiree.substring(4, 6) +
									'/' +
									b.last_soiree.substring(0, 4)}
							</td>
						</tr>
					{/each}
				</table>
			</div>
		</div>
	</div>
</div>
<div class={benevolesPresencesVisible}>
	<div class="py-2 grid gap-1 w-full md:w-1/2">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Présences</p>
		<div class="flex flex-col h-screen">
			<select
				class="text-xs appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				bind:value={benevoleSelected}
			>
				{#each benevoles as b}
					<option value={b.benevole}>
						{b.benevole}
					</option>
				{/each}
			</select>
			<div class="flex-grow overflow-y-auto">
				<table id="BenevolesListe" class="text-sm text-gray-500 w-full">
					{#each presences as p}
						{#if p.benevole === benevoleSelected}
							<tr>
								<td class="w-1/2">{p.benevole}</td>
								<td class="w-1/12"
									>{p.soiree.substring(6, 8) +
										'/' +
										p.soiree.substring(4, 6) +
										'/' +
										p.soiree.substring(0, 4)}
								</td>
							</tr>
						{/if}
					{/each}
				</table>
			</div>
		</div>
	</div>
</div>
