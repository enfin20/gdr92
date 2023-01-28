<script>
	import { clear_loops } from 'svelte/internal';

	export let currentEquipe;
	export let statutEnregistrement;

	import { MM_YYYY, date_YYYYMM, date_DD_MM, MM, YYYYMM, date_YYYYMMDD } from '$lib/date_functions';

	let calendriers = [];
	let soiree2 = MM_YYYY(1).date;
	let soirees = [];
	let lieux = [];
	var nbPresent = [];
	var nbRS = [];
	// special Camion
	var nbVaisselle = [];
	// special Maraude
	var nbHomme = [];
	var nbChauffeur = [];
	let soiree = '';
	let erreurMessage = '';

	showPlanningM2();

	function selectCol(col) {
		for (var i = 0; i < calendriers.length; i++) {
			for (var j = 0; j < calendriers[i].length; j++) {
				if (j === col) {
					calendriers[i][j].background = 'bg-slate-200';
				} else {
					calendriers[i][j].background = '';
				}
			}
		}
	}

	function CalendrierChangeStatut(button_id) {
		// changement du statut du bouton appelant

		// pour éviter les boucles
		let changed = false;

		// pour récupérer row & col du bouton sélectionné
		let row = -1;
		let col = -1;
		let presence = '';
		for (var i = 0; i < calendriers.length; i++) {
			for (var j = 0; j < calendriers[i].length; j++) {
				if (calendriers[i][j]._id === button_id) {
					row = i;
					col = j;
					presence = calendriers[i][j].presence;
					// pour indiquer qu'il y a eu un changement de statut
					calendriers[i][j].updated = 'Oui';
				}
			}
		}

		if (presence === '') {
			changed = true;
			calendriers[row][col].presence = 'Oui';
		}
		if (presence === 'Oui') {
			changed = true;
			calendriers[row][col].presence = 'Dispo';
		}
		if (presence === 'Dispo') {
			if (!changed) {
				calendriers[row][col].presence = 'RS';
				changed = true;
			}
		}
		// special Camion
		if (currentEquipe === 'Camion') {
			if (presence === 'RS') {
				if (!changed) {
					calendriers[row][col].presence = 'Vaisselle';
					changed = true;
				}
			}
			if (presence === 'Vaisselle') {
				if (!changed) {
					calendriers[row][col].presence = 'Maraude';
					changed = true;
				}
			}
			if (presence === 'Maraude') {
				if (!changed) {
					calendriers[row][col].presence = 'Absent';
					changed = true;
				}
			}
		}
		// special Maraude
		else {
			if (presence === 'RS') {
				if (!changed) {
					calendriers[row][col].presence = 'Absent';
					changed = true;
				}
			}
		}

		if (presence === 'Absent') {
			if (!changed) {
				calendriers[row][col].presence = 'Non';
				changed = true;
			}
		}
		if (presence === 'Non') {
			if (!changed) {
				calendriers[row][col].presence = 'Oui';
				changed = true;
			}
		}

		// remise à jour du nombre de bénévoles
		nbBenevoles();
	}

	export async function saveCalendrier() {
		// tableau cible des mises à jour
		var calUpdated = [];
		statutEnregistrement = '... en cours';
		for (var i = 0; i < calendriers.length; i++) {
			for (var j = 1; j < calendriers[i].length; j++) {
				var obj = new Object();
				obj._id = calendriers[i][j]._id;
				obj.statut = calendriers[i][j].presence;
				obj.soiree = soirees[j];
				obj.equipe = currentEquipe;
				obj.b_id = calendriers[i][0].b_id;
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
		//gestion des erreurs
		const ret = await res.json();
		if (res.status === 500) {
			erreurMessage = 'Erreur (contacte Olivier): ' + ret.erreur;
			statutEnregistrement = '';
		} else {
			statutEnregistrement = '    Calendrier enregistré';
		}
	}

	export async function showPlanningM() {
		// affichage du planning pour le mois en cours
		soiree = YYYYMM().date;

		getCalendrier();
	}

	export async function showPlanningM2() {
		// affichage du planning pour le mois suivant
		soiree = YYYYMM(1).date;

		getCalendrier();
	}

	export async function showPlanning() {
		// affichage du planning pour le mois X
		soiree = date_YYYYMM(soiree2).date;

		getCalendrier();
	}

	export async function getCalendrier() {
		// mise en forme du calendrier
		calendriers = [];
		lieux = [];
		soirees = [];
		erreurMessage = '';
		statutEnregistrement = '';

		try {
			const res = await fetch(
				'./calendrierBenevoles?soiree=' + soiree + '&equipe=' + currentEquipe
			);
			const cal = await res.json();
			// gestion des erreurs
			if (res.status === 500) {
				erreurMessage = 'Erreur (contacte Olivier): ' + cal.erreur;
			}
			// pas d'erreurs
			else {
				// remise au format des dates et des entêtes DD/MM
				for (var i = cal.tableau[0].length; i > 0; i--) {
					//cal.tableau[0][i] = date_DD_MM(cal.tableau[0][i - 1]).date;
					//gestion de la date
					cal.tableau[0][i] = cal.tableau[0][i - 1];
					lieux[i] =
						'<img src="/images/' +
						cal.tableau[0][i - 1].substring(11) +
						'.png" alt ="' +
						cal.tableau[0][i - 1].substring(11) +
						'" width="32px" height="32px" />';
				}
				lieux[0] = '';
				soirees = await cal.tableau[0];
				soirees[0] = '';
				// suppression de l'entête
				calendriers = await cal.tableau.slice(1);

				// calcul du nombre de bénévoles / soirées
				nbBenevoles();
			}
		} catch (error) {
			erreurMessage = 'Erreur compile (contacte Olivier):  ' + error;
		}
	}

	export function nbBenevoles() {
		// calcul du nombre de bénévoles / soirées
		nbPresent = [];
		nbPresent[0] = 'Nb bénévoles';
		nbRS = [];
		nbRS[0] = 'nb RS';
		nbVaisselle = [];
		nbVaisselle[0] = 'nb Vaisselle';
		nbHomme = [];
		nbHomme[0] = 'nb Hommes';
		nbChauffeur = [];
		nbChauffeur[0] = 'nb Chauffeur';
		for (var k = 1; k < calendriers[0].length; k++) {
			nbPresent[k] = 0;
			nbRS[k] = 0;
			nbVaisselle[k] = 0;
			nbChauffeur[k] = 0;
			nbHomme[k] = 0;
		}

		for (var i = 0; i < calendriers.length; i++) {
			for (var j = 1; j < calendriers[i].length; j++) {
				if (calendriers[i][j].presence === 'Oui') {
					nbPresent[j] = nbPresent[j] + 1;
					// special Maraude
					if (calendriers[i][0].homme) {
						nbHomme[j] = nbHomme[j] + 1;
					}
					if (calendriers[i][0].chauffeur) {
						nbChauffeur[j] = nbChauffeur[j] + 1;
					}
				}
				if (calendriers[i][j].presence === 'RS') {
					nbPresent[j] = nbPresent[j] + 1;
					nbRS[j] = nbRS[j] + 1;
					// special Maraude
					if (calendriers[i][0].homme) {
						nbHomme[j] = nbHomme[j] + 1;
					}
					if (calendriers[i][0].chauffeur) {
						nbChauffeur[j] = nbChauffeur[j] + 1;
					}
				}
				if (calendriers[i][j].presence === 'Vaisselle') {
					nbPresent[j] = nbPresent[j] + 1;
					nbVaisselle[j] = nbVaisselle[j] + 1;
				}
			}
		}
	}
</script>

<div class="py-2 grid gap-1 w-full">
	<p class="text-xl font-bold text-white bg-red-600">{erreurMessage}</p>
	<p class="text-2xl font-bold text-gray-800 md:text-xl">Gérer le calendrier</p>
	<div class="md:flex md:items-center">
		<div class="mr-3 md:py-4 inline-block text-gray-600">
			<button
				type="submit"
				name="s"
				class="bg-pink-300 hover:bg-pink-400 rounded py-1 px-3 text-gray-600"
				on:click={showPlanningM}
			>
				Planning {MM(new Date().getMonth()).mois}
			</button>
		</div>
		<div class="mr-3 md:py-4 inline-block text-gray-600">
			<button
				type="submit"
				name="s"
				class="bg-pink-300 hover:bg-pink-400 rounded py-1 px-3 text-gray-600"
				on:click={showPlanningM2}
			>
				Planning {MM(new Date().getMonth() + 1).mois}
			</button>
		</div>

		<div class="mr-3 md:py-4 inline-block text-gray-600">
			<form on:submit|preventDefault={showPlanning}>
				<input
					type="text"
					bind:value={soiree2}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
				<button type="submit" class="bg-pink-300 hover:bg-pink-400 rounded py-1 px-3 text-gray-600"
					>Entrer
				</button>
			</form>
		</div>
	</div>
	<div class="md:flex md:items-center">
		<div class="md:w-2/3">
			<button
				type="submit"
				class="shadow bg-green-400 hover:bg-green-500 focus:shadow-outline focus:outline-none text-gray-700  py-2 px-4 rounded"
				on:click={saveCalendrier}>Enregistrer le calendrier</button
			>
			{statutEnregistrement}
		</div>
	</div>

	<table class="text-sm">
		<thead class="">
			<tr class="">
				{#each soirees as cell}
					<th class="">{date_DD_MM(cell).date}</th>
				{/each}
			</tr>
			<tr class="">
				{#each lieux as cell, index}
					<th>
						<div class="flex items-center justify-center">
							<button on:click={() => selectCol(index)}>{@html cell}</button>
						</div></th
					>
				{/each}
			</tr>
			<tr class="">
				{#each nbPresent as cell}
					<th class="text-center font-bold[width:2%] text-gray-500 align-middle">
						{cell}
					</th>
				{/each}
			</tr>
			<tr class="">
				{#each nbRS as cell}
					<th class="text-center font-bold[width:2%] text-gray-500 align-middle">
						{cell}
					</th>
				{/each}
			</tr>
			{#if currentEquipe === 'Camion'}
				<tr class="">
					{#each nbVaisselle as cell}
						<th class="text-center font-bold[width:2%] text-gray-500 align-middle">
							{cell}
						</th>
					{/each}
				</tr>
			{/if}
			{#if currentEquipe === 'Maraude'}
				<tr class="">
					{#each nbHomme as cell}
						<th class="text-center font-bold[width:2%] text-gray-500 align-middle">
							{cell}
						</th>
					{/each}
				</tr>
				<tr class="">
					{#each nbChauffeur as cell}
						<th class="text-center font-bold[width:2%] text-gray-500 align-middle">
							{cell}
						</th>
					{/each}
				</tr>
			{/if}
		</thead>
		<tbody class="divide-y divide-gray-100">
			{#each calendriers as row}
				<tr class="hover:bg-slate-100">
					{#each row as cell}
						{#if typeof cell._id != 'undefined'}
							<td class="text-center align-middle {cell.background}">
								<div class="relative flex flex-col items-center group">
									<button
										class={cell.presence === 'Oui'
											? 'bg-green-400 hover:bg-green-600 text-gray-500 py-1 px-1 rounded'
											: cell.presence === 'RS'
											? 'bg-pink-300 hover:bg-pink-400 text-gray-500 py-1 px-1 rounded'
											: cell.presence === 'Dispo'
											? 'bg-gray-200 hover:bg-gray-300 text-gray-600 py-1 px-1 rounded'
											: cell.presence === 'Maraude'
											? 'bg-yellow-400 hover:bg-yellow-600 text-gray-500 py-1 px-1 rounded'
											: cell.presence === 'Vaisselle'
											? 'bg-blue-300 hover:bg-blue-400 text-gray-500 py-1 px-1 rounded'
											: cell.presence === 'Absent'
											? 'bg-red-500 hover:bg-red-600 text-gray-200 py-1 px-1 rounded'
											: 'text-gray-500 py-1 px-1 rounded'}
										id={cell._id}
										on:click={CalendrierChangeStatut(cell._id, cell.presence)}
									>
										{cell.presence.substring(0, 3)}
									</button>
									<span
										class="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex"
									>
										<span
											class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-gray-600 shadow-lg"
											>{cell.soiree}</span
										>
										<div class="w-3 h-3 -mt-2 rotate-45 bg-gray-600" />
									</span>
								</div>
							</td>
						{:else}
							<td>
								{cell.benevole}
								{#if currentEquipe === 'Camion'}
									<br />
									{#if cell.nbVaisselle !== ''}
										<span class="text-xs italic text-gray-400">
											nb Vais. : {cell.nbVaisselle} : {cell.lastVaisselle.substring(6, 8) +
												'/' +
												cell.lastVaisselle.substring(4, 6)}
										</span>
									{/if}
								{/if}
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
