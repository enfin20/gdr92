<script context="module">
</script>

<script>
	import { MM_YYYY, date_DD_MM, YYYYMMDD_1, date_YYYYMMDD_1 } from '$lib/date_functions';
	import LoginForm from '$lib/components/loginForm.svelte';
	import RetourSoireeListe from '$lib/components/retourSoireesListe.svelte';
	import BenevolesListe from '$lib/components/benevolesListe.svelte';
	import CalendrierManagement from '$lib/components/calendrierManagement.svelte';
	import chartjs, { registerables } from 'chart.js/auto';
	import { onMount } from 'svelte';

	let benevoles = [];
	let benevoleSelected = '';
	let benevolesSansReponses = [];
	let benevolesAbsents = [];
	let benevolesLastSoiree = [];
	let presences = [];
	let soiree = '';
	let retourSoirees = [];
	let nbBeneficiairesGare = [];
	let nbBeneficiairesPeri = [];
	let nbBeneficiairesTotal = [];
	let nbBeneficiairesGare_max = 0;
	let nbBeneficiairesGare_min = 100;
	let nbBeneficiairesPeri_max = 0;
	let nbBeneficiairesPeri_min = 100;
	let nbPresentsGare_max = 0;
	let nbPresentsGare_min = 100;
	let nbPresentsPeri_max = 0;
	let nbPresentsPeri_min = 100;
	let nbAbsentsGare_max = 0;
	let nbAbsentsGare_min = 100;
	let nbAbsentsPeri_max = 0;
	let nbAbsentsPeri_min = 100;
	let soirees = [];
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

	let chartNbBeneficiaires;
	let ctxNbBeneficiaires;
	var chartNbBeneficiairesData = [];

	onMount(async (promise) => {
		const res = await fetch('./retourSoirees?equipe=Camion');
		const soir = await res.json();

		if (res.status === 500) {
			erreurMessageRG = 'Erreur (contacte Olivier): ' + soir.erreur;
		} else {
			retourSoirees = await soir.retourSoirees;

			for (var i = retourSoirees.length - 1; i >= 0; i--) {
				soirees.push(date_DD_MM(retourSoirees[i].soiree).date);
				nbBeneficiairesGare.push(retourSoirees[i].nbGare);
				nbBeneficiairesPeri.push(retourSoirees[i].nbPeri);
				nbBeneficiairesTotal.push(
					Number(retourSoirees[i].nbPeri) + Number(retourSoirees[i].nbGare)
				);
				if (Number(retourSoirees[i].nbGare) >= nbBeneficiairesGare_max) {
					nbBeneficiairesGare_max = Number(retourSoirees[i].nbGare);
				}
				if (Number(retourSoirees[i].nbGare) <= nbBeneficiairesGare_min) {
					nbBeneficiairesGare_min = Number(retourSoirees[i].nbGare);
				}
				if (Number(retourSoirees[i].nbPeri) >= nbBeneficiairesPeri_max) {
					nbBeneficiairesPeri_max = Number(retourSoirees[i].nbPeri);
				}
				if (Number(retourSoirees[i].nbPeri) <= nbBeneficiairesPeri_min) {
					nbBeneficiairesPeri_min = Number(retourSoirees[i].nbPeri);
				}
				if (retourSoirees[i].gare_present >= nbPresentsGare_max) {
					nbPresentsGare_max = retourSoirees[i].gare_present;
				}
				if (retourSoirees[i].gare_present <= nbPresentsGare_min) {
					nbPresentsGare_min = retourSoirees[i].gare_present;
				}
				if (retourSoirees[i].gp_present >= nbPresentsPeri_max) {
					nbPresentsPeri_max = retourSoirees[i].gp_present;
				}
				if (retourSoirees[i].gp_present <= nbPresentsPeri_min) {
					nbPresentsPeri_min = retourSoirees[i].gp_present;
				}
				if (retourSoirees[i].gare_absent >= nbAbsentsGare_max) {
					nbAbsentsGare_max = retourSoirees[i].gare_absent;
				}
				if (retourSoirees[i].gare_absent <= nbAbsentsGare_min) {
					nbAbsentsGare_min = retourSoirees[i].gare_absent;
				}
				if (retourSoirees[i].gp_absent >= nbAbsentsPeri_max) {
					nbAbsentsPeri_max = retourSoirees[i].gp_absent;
				}
				if (retourSoirees[i].gp_absent <= nbAbsentsPeri_min) {
					nbAbsentsPeri_min = retourSoirees[i].gp_absent;
				}
			}
		}
		ctxNbBeneficiaires = chartNbBeneficiaires.getContext('2d');
		chartNbBeneficiairesData = new chartjs(ctxNbBeneficiaires, {});
	});

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
		divHidden();
		soireeVisible = 'flex';

		chartNbBeneficiairesData.destroy();
		chartNbBeneficiairesData = new chartjs(ctxNbBeneficiaires, {
			type: 'line',
			data: {
				labels: soirees,
				datasets: [
					{ label: 'Gare', data: nbBeneficiairesGare },
					{ label: 'Péri', data: nbBeneficiairesPeri },
					{ label: 'Total', data: nbBeneficiairesTotal }
				]
			},
			options: {
				responsive: true,
				plugins: { legend: { labels: { boxWidth: 20 } } },
				borderWidth: 2,
				pointStyle: false
			}
		});
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
		let currentSoiree = soiree.replaceAll('-', '');
		let isCamion = '';
		statutEnregistrement = '.... en cours';
		// test pour éviter de saisir 2 fois la même date
		let res = await fetch(
			'/calendrierBenevoles/isSoiree?soiree=' + currentSoiree + '&equipe=Camion'
		);
		let soireeExiste = await res.json();

		if (soireeExiste.length > 0) {
			statutEnregistrement = 'Soirée déjà enregistrée !!';
		} else {
			// récupération des bénévoles
			res = await fetch('/benevoles');
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
	<div class="grid grid-cols-1 md:grid-cols-2 gap-1">
		<div class="w-full">
			<p class="text-base font-bold text-gray-800 mt-2 mb-2">
				Nombre de personnes accueillies depuis le {date_YYYYMMDD_1().date}
			</p>
			<canvas bind:this={chartNbBeneficiaires} id="nbBeneficiairesGare" />
			<table class="text-base text-gray-500 w-1/2 mt-3">
				<tr>
					<th />
					<th colspan="2">
						<div class="flex items-center justify-center">
							<img
								src="/images/entrepot.png"
								class="h-8 w-8 object-contain"
								alt="present"
								style="display: inline"
							/>
						</div>
					</th>
					<th colspan="2">
						<div class="flex items-center justify-center">
							<img
								src="/images/present.png"
								class="h-8 w-8 object-contain"
								alt="present"
								style="display: inline"
							/>
						</div>
					</th>
					<th colspan="2">
						<div class="flex items-center justify-center">
							<img
								src="/images/absent.png"
								class="h-8 w-8 object-contain"
								alt="gare"
								style="display: inline"
							/>
						</div>
					</th>
				</tr>
				<tr>
					<th />
					<th>Max</th><th>Min</th><th>Max</th><th>Min</th><th>Max</th><th>Min</th>
				</tr>
				<tr>
					<td>Gare</td>
					<td class="text-center">{nbBeneficiairesGare_max}</td>
					<td class="text-center">{nbBeneficiairesGare_min}</td>
					<td class="text-center">{nbPresentsGare_max}</td>
					<td class="text-center">{nbPresentsGare_min}</td>
					<td class="text-center">{nbAbsentsGare_max}</td>
					<td class="text-center">{nbAbsentsGare_min}</td>
				</tr>
				<tr>
					<td>Gabriel Péri</td>
					<td class="text-center">{nbBeneficiairesPeri_max}</td>
					<td class="text-center">{nbBeneficiairesPeri_min}</td>
					<td class="text-center">{nbPresentsPeri_max}</td>
					<td class="text-center">{nbPresentsPeri_min}</td>
					<td class="text-center">{nbAbsentsPeri_max}</td>
					<td class="text-center">{nbAbsentsPeri_min}</td>
				</tr>
			</table>
		</div>
		<div class="mt-2">
			<RetourSoireeListe {retourSoirees} />
		</div>
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
