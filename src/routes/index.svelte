<script context="module">
</script>

<script>
	import { respond } from '@sveltejs/kit/ssr';
	import { text } from 'svelte/internal';
	import { YYYY_MM_DD, MM, YYYYMM, date_mm_YYYY, date_DD_MM } from '$lib/date_functions';

	let loginVisible = 'flex';
	let calendrierVisible = 'hidden';
	let menuVisible = 'hidden';
	let retourVisible = 'hidden';
	let planningVisible = 'hidden';
	let erreurMessage = '';

	let loggedBenevole = '';
	let statutSauvegarde =
		' Même si tu ne viens pas du tout, enregistre-toi (ça évitera les relances)';

	let soirees = [];
	let dates = [];
	let calendriers = [];
	let mois = '';
	let maraude = false;
	let camion = false;
	let prepa = '';
	let retourSoiree = [];
	let retourSoirees = [];
	let benevoles = [];
	let rs = '';
	let chargement = '';
	let equipe = '';
	let soiree = YYYY_MM_DD().date;

	import CalendrierForm from '/src/lib/components/calendrierForm.svelte';
	import LoginForm from '/src/lib/components/loginForm.svelte';
	import RetourSoireeForm from '/src/lib/components/retourSoireeForm.svelte';
	import RetourSoireeListe from '/src/lib/components/retourSoireesListe.svelte';
	import CalendrierTableau from '/src/lib/components/calendrierDisplay.svelte';
	let email = '';

	export async function getBenevole(event) {
		// login et affichage du formulaire de saisie
		email = event.detail.email;
		email = email.toLowerCase();
		erreurMessage = event.detail.erreurMessage;
		if (erreurMessage === '') {
			try {
				var benevole = event.detail.benevole;
				loggedBenevole = benevole.benevole.prenom + ' ' + benevole.benevole.nom;
				if (benevole.benevole.camion === undefined) {
					camion = false;
				} else {
					camion = benevole.benevole.camion;
				}
				if (benevole.benevole.maraude === undefined) {
					maraude = false;
				} else {
					maraude = benevole.benevole.maraude;
				}
				if (benevole.benevole.prepa === undefined) {
					prepa = false;
				} else {
					prepa = benevole.benevole.prepa;
				}
				if (benevole.benevole.rs === undefined || !benevole.benevole.rs) {
					menuVisible = 'hidden';
				} else {
					menuVisible = '';
					rs = loggedBenevole;
					equipe = 'Camion';
				}
				// pour charger le calendrier du bénévole
				const res = await fetch(
					'/calendrierBenevoles/calendrierBenevole?email=' +
						email +
						'&maraude=' +
						maraude +
						'&camion=' +
						camion
				);
				const cs = await res.json();
				if (res.status === 500) {
					erreurMessage = 'Erreur (contacte Olivier): ' + cs.erreur;
				} else {
					loginVisible = 'hidden';
					calendrierVisible = 'inline';
					planningVisible = 'hidden';
					soirees = cs.calendrier;
				}
			} catch (err) {
				erreurMessage = err.message;
			}
		}
	}

	export async function updateCalendrier() {
		//enregistrement du calendrier

		statutSauvegarde = '    ... en cours';
		const res = await fetch('/calendrierBenevoles/calendrierBenevole', {
			method: 'PUT',
			body: JSON.stringify(soirees)
		});

		// gestion des erreurs
		const ret = await res.json();
		if (res.status === 500) {
			erreurMessage = 'Erreur (contacte Olivier): ' + ret.erreur;
			statutSauvegarde = '';
		} else {
			statutSauvegarde = '    Calendrier enregistré';
		}
	}

	export function reload() {
		loginVisible = 'flex';
		calendrierVisible = 'hidden';
		menuVisible = 'hidden';
		retourVisible = 'hidden';
		planningVisible = 'hidden';

		loggedBenevole = '';
		statutSauvegarde = ' Même si tu ne viens pas du tout, enregistre-toi (ça évitera les relances)';

		soirees = [];
		dates = [];
		calendriers = [];
		mois = '';
		maraude = false;
		prepa = false;
		retourSoiree = [];
		retourSoirees = [];
		benevoles = [];
		rs = '';
		chargement = '';
		soiree = YYYY_MM_DD().date;
	}

	export async function showSoiree() {
		chargement = 'Chargement en cours ...';
		// vérification de l'existence de la soirée à la date saisie
		const res = await fetch('./retourSoirees/isSoiree?soiree=' + soiree);
		const soir = await res.json();

		if (res.status === 500) {
			erreurMessage = 'Erreur (contacte Olivier): ' + soir.erreur;
			chargement = '';
		} else {
			statutSauvegarde = '    Calendrier enregistré';
			if (soir.retourSoirees.length === 1) {
				// affichage des soirées pour les rs
				retourVisible = 'block';
				calendrierVisible = 'hidden';
				getBenevolesSoiree();
				getRetourSoirees();
			} else {
				erreurMessage = 'Pas de soirée à cette date !';
			}
			chargement = '';
		}
	}

	export async function showCamionPlanningM() {
		// affichage du planning pour le mois en cours
		mois = YYYYMM().date;
		equipe = 'Camion';
		getPlanning();
	}

	export async function showCamionPlanningM2() {
		// affichage du planning pour le mois suivant
		mois = YYYYMM(1).date;
		equipe = 'Camion';
		getPlanning();
	}
	export async function showMaraudePlanningM() {
		// affichage du planning pour le mois en cours
		mois = YYYYMM().date;
		equipe = 'Maraude';
		getPlanning();
	}

	export async function showMaraudePlanningM2() {
		// affichage du planning pour le mois suivant
		mois = YYYYMM(1).date;
		equipe = 'Maraude';
		getPlanning();
	}

	export async function getBenevolesSoiree() {
		// affichage des bénévoles présents à la soirée
		benevoles = [];
		try {
			const res = await fetch('/retourSoirees/retourSoiree?soiree=' + soiree);
			const retour = await res.json();
			const ben = await retour.benevoles;
			//gestion des erreurs
			if (res.status === 500) {
				erreurMessage = 'Erreur (contacte Olivier): ' + retour.erreur;
			} else {
				const benT = [];
				if (ben.length < 1) {
					erreurMessage = "il n'y a pas eu de soirée à cette date! il faut recharger la page";
				}

				for (var i = 0; i < ben.length; i++) {
					var obj = new Object();
					obj.benevole = ben[i].prenom + ' ' + ben[i].nom;
					obj.tel = ben[i].tel;
					obj.statut = 'Oui';
					benT.push(obj);
				}
				benevoles = await benT;

				retourSoiree = await retour.retourSoiree[0];
			}
		} catch (err) {
			erreurMessage = 'Erreur compile (contacte Olivier): ' + err.message;
		}
	}

	export async function getRetourSoirees() {
		// affichage des précédentes soirées
		statutSauvegarde = '';
		retourSoirees = [];
		const res = await fetch('./retourSoirees?equipe=' + equipe);
		const soir = await res.json();
		if (res.status === 500) {
			erreurMessage = 'Erreur (contacte Olivier): ' + soir.erreur;
		} else {
			retourSoirees = await soir.retourSoirees;
		}
	}

	export async function getPlanning() {
		chargement = 'Chargement en cours ...';
		dates = [];
		calendriers = [];
		retourVisible = 'hidden';
		calendrierVisible = 'hidden';
		planningVisible = 'block';

		// mise en forme du calendrier
		const res = await fetch('./calendrierBenevoles?soiree=' + mois + '&equipe=' + equipe);
		const cal = await res.json();

		//gestion des erreurs
		if (res.status === 500) {
			erreurMessage = 'Erreur (contacte Olivier): ' + cal.erreur;
		} else {
			// remise au format des dates et des entêtes DD/MM
			for (var i = cal.tableau[0].length; i > 0; i--) {
				cal.tableau[0][i] =
					date_DD_MM(cal.tableau[0][i - 1]).date +
					'<div class="flex items-center justify-center"><img src="/images/' +
					cal.tableau[0][i - 1].substring(11) +
					'.png" alt ="' +
					cal.tableau[0][i - 1].substring(11) +
					'" width="32px" height="32px"/></div>';
			}
			cal.tableau[0][0] = 'Calendrier ';
			dates = await cal.tableau[0];
			// suppression de l'entête
			calendriers = await cal.tableau.slice(1);
		}
		chargement = '';
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
		const res = await fetch('/retourSoirees/retourSoiree', {
			method: 'PUT',
			body: JSON.stringify(retSoiree)
		});

		// gestion des erreurs
		const ret = await res.json();
		if (res.status === 500) {
			erreurMessage = 'Erreur (contacte Olivier): ' + ret.erreur;
			statutSauvegarde = '';
		} else {
			statutSauvegarde = '    Soirée enregistrée';
		}
	}
</script>

<svelte:head>
	<title>Planning restos Colombes</title>
</svelte:head>
<p class="text-center text-xl font-bold text-white bg-red-600">{erreurMessage}</p>
<div class="block md:flex w-full">
	<div class="grid grid-cols-5 text-xs md:text-base bg-white w-full">
		<button type="submit" name="s2" on:click={reload}>
			<img src="/images/logo.webp" alt="Restos du coeur" class="w-1/2 md:w-1/4" /></button
		>
		<button
			type="submit"
			name="benevoles"
			class="mr-1 md:mr-3 inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase md:font-bold "
			on:click={showCamionPlanningM}
		>
			Camion {MM(new Date().getMonth()).mois}
		</button>
		<button
			type="submit"
			name="date"
			class="mr-1 md:mr-3 inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3 text-gray-600 uppercase md:font-bold  "
			on:click={showCamionPlanningM2}
		>
			Camion {MM(new Date().getMonth() + 1).mois}
		</button>
		<button
			type="submit"
			name="calendrier"
			class="mr-1 md:mr-3 inline-block bg-purple-200 hover:bg-purple-300 rounded py-1 px-3 text-gray-600 uppercase md:font-bold  "
			on:click={showMaraudePlanningM}
		>
			Maraude {MM(new Date().getMonth()).mois}
		</button>
		<button
			type="submit"
			name="benevolesSansReponse"
			class="mr-1 md:mr-3 inline-block bg-purple-200 hover:bg-purple-300 rounded py-1 px-3 text-gray-600 uppercase md:font-bold  "
			on:click={showMaraudePlanningM2}
		>
			Maraude {MM(new Date().getMonth() + 1).mois}
		</button>
	</div>
</div>

<div class="{menuVisible} grid grid-cols-3 text-xs md:text-base bg-white w-full">
	<div />
	<div class="mr-3 py-2 md:py-4 inline-block text-gray-600 ">
		<input
			id="soiree"
			type="date"
			bind:value={soiree}
			class="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
		/>
	</div>
	<div class="mr-3 py-2 md:py-4 inline-block text-gray-600 ">
		<button
			type="submit"
			name="s"
			class="bg-pink-300 hover:bg-pink-400 rounded py-1 px-3 text-gray-600 text-base uppercase md:font-bold"
			on:click={showSoiree}
		>
			Retour soirée
		</button>
	</div>
</div>
<div class="mr-3 md:py-4 inline-block text-gray-600">
	{chargement}
</div>

<span class={loginVisible}>
	<div class="py-4 grid gap-1">
		<h1 class="text-2xl my-8 font-bold text-gray-800 md:text-3xl">Login</h1>

		<LoginForm {email} on:message={getBenevole} />
	</div>
</span>
<div class={calendrierVisible}>
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
					<CalendrierForm {calendrier} {prepa} />
				{/each}
			</ul>
		</div>
	</div>
</div>
<div class={retourVisible}>
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
<div class={planningVisible}>
	<div class="flex py-2 w-full">
		<h1 class="text-2xl my-8 font-bold text-gray-800 md:text-3xl">
			Planning {equipe} de {date_mm_YYYY(mois).date}
		</h1>
	</div>
	<div class="flex py-2 w-full">
		<CalendrierTableau {dates} {calendriers} />
	</div>
</div>
