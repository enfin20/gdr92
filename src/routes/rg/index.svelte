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

	let calendriers = [];
	var nbPresent = [];
	var nbRS = [];
	var nbVaisselle = [];
	let benevoles = [];
	let benevolesSansReponses = [];
	let soiree = '';
	let soiree2 = MM_YYYY(1).date;
	let soirees = [];
	let retourSoirees = [];
	let lieux = [];

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
	let plageActive = [true, true, true];
	var plage = ['18h15-20h', '20h-21h30', '14h-18h'];
	let lieu = ['gare', 'gp', 'entrepot'];

	// nouveau bénévole
	let new_prenom = '';
	let new_nom = '';
	let new_email = '';
	let new_tel = '';

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
		const res = await fetch('./benevoles/benevole?email=' + email + '&rg=Oui&pwd=' + pwd);
		const benevole = await res.json();
		try {
			if (benevole.benevole.rg === 'Oui') {
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

		// initialisation de soirée au mois suivant
		showPlanningM2();
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

		const res = await fetch('/calendrierBenevoles/benevolesSansReponse');
		const b = await res.json();
		benevolesSansReponses = await b.benevoles;
	}
	export async function getCalendrier() {
		// mise en forme du calendrier
		calendriers = [];
		lieux = [];
		soirees = [];

		const res = await fetch('./calendrierBenevoles?soiree=' + soiree);
		const cal = await res.json();

		// remise au format des dates et des entêtes DD/MM
		for (var i = cal.tableau[0].length; i > 0; i--) {
			cal.tableau[0][i] = date_DD_MM(cal.tableau[0][i - 1]).date;
			lieux[i] =
				'<img src="https://www.orientsport.fr/oflash/img/' +
				cal.tableau[0][i - 1].substring(11) +
				'.png" alt ="' +
				cal.tableau[0][i - 1].substring(11) +
				'" width="32px" height="32px"/>';
		}
		lieux[0] = '';
		cal.tableau[0][0] = 'Calendrier ';
		soirees = await cal.tableau[0];
		// suppression de l'entête
		calendriers = await cal.tableau.slice(1);

		// calcul du nombre de bénévoles / soirées
		nbBenevoles();
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

		obj.soiree = soiree.replaceAll('-', '');
		obj.statut = '';

		// récupération des bénévoles
		const res = await fetch('/benevoles');
		let benevoles = await res.json();
		for (var i = 0; i < benevoles.benevoles.length; i++) {
			obj.email = benevoles.benevoles[i].email;
			obj.benevole = benevoles.benevoles[i].prenom + ' ' + benevoles.benevoles[i].nom;
			obj.b_id = benevoles.benevoles[i]._id;
			for (var j = 0; j <= 2; j++) {
				if (plageActive[j]) {
					obj.plage = plage[j];
					obj.lieu = lieu[j];
					const res = await fetch('/calendrierBenevoles/addCalendrierBenevoles', {
						method: 'POST',
						body: JSON.stringify(obj)
					});
				}
			}
		}

		// enregistrement du retour de soirée
		obj2.soiree = soiree.replaceAll('-', '');
		obj2.nbGare = 0;
		obj2.nbPeri = 0;
		obj2.Commentaires = '';
		obj2.rs = '';

		const retourSoiree = await fetch('/retourSoirees', {
			method: 'POST',
			body: JSON.stringify(obj2)
		});
		statutEnregistrement = soiree + ' : enregistrée';
	}

	export async function inactivateCalendrier() {
		const res = await fetch('/calendrierBenevoles/inactivate', {
			method: 'PUT',
			body: JSON.stringify(soiree)
		});
	}

	function CalendrierChangeStatut(button_id) {
		// changement du statut du bouton appelant

		// pour éviter les boucles
		let changed = false;

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

	export async function updateBenevole(b_id, prenom, nom, email, tel) {
		// Mise à jour du bénévole
		var obj = new Object();
		obj._id = b_id;
		obj.prenom = prenom;
		obj.nom = nom.toUpperCase();
		obj.email = email;
		obj.tel = tel;
		const res = await fetch('/benevoles/benevole', {
			method: 'PUT',
			body: JSON.stringify(obj)
		});
	}

	export async function insertBenevole(prenom, nom, email, tel) {
		var obj = new Object();
		obj.prenom = prenom;
		obj.nom = nom.toUpperCase();
		obj.email = email;
		obj.tel = tel;
		const res = await fetch('/benevoles/benevole', {
			method: 'POST',
			body: JSON.stringify(obj)
		});
		new_prenom = '';
		new_nom = '';
		new_email = '';
		showBenevoles();
	}

	export async function deleteBenevole(b_id) {
		const res = await fetch('/benevoles/benevole', {
			method: 'DELETE',
			body: JSON.stringify(b_id)
		});
		showBenevoles();
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

	export function nbBenevoles() {
		// calcul du nombre de bénévoles / soirées
		nbPresent = [];
		nbPresent[0] = 'Nb bénévoles';
		nbRS = [];
		nbRS[0] = 'nb RS';
		nbVaisselle = [];
		nbVaisselle[0] = 'nb Vaisselle';
		for (var k = 1; k < calendriers[0].length; k++) {
			nbPresent[k] = 0;
			nbRS[k] = 0;
			nbVaisselle[k] = 0;
		}

		for (var i = 0; i < calendriers.length; i++) {
			for (var j = 1; j < calendriers[i].length; j++) {
				if (calendriers[i][j].presence === 'Oui') {
					nbPresent[j] = nbPresent[j] + 1;
				}
				if (calendriers[i][j].presence === 'RS') {
					nbPresent[j] = nbPresent[j] + 1;
					nbRS[j] = nbRS[j] + 1;
				}
				if (calendriers[i][j].presence === 'Vaisselle') {
					nbPresent[j] = nbPresent[j] + 1;
					nbVaisselle[j] = nbVaisselle[j] + 1;
				}
			}
		}
		console.log(nbPresent);
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
	<div class="py-2 grid gap-1 w-full">
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
					<button
						type="submit"
						class="bg-pink-300 hover:bg-pink-400 rounded py-1 px-3 text-gray-600"
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
			</div>
		</div>

		<table class="text-sm">
			<thead class="">
				<tr class="">
					{#each soirees as cell}
						<th class="">{cell}</th>
					{/each}
				</tr>
				<tr class="">
					{#each lieux as cell}
						<th> <div class="flex items-center justify-center">{@html cell}</div></th>
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
				<tr class="">
					{#each nbVaisselle as cell}
						<th class="text-center font-bold[width:2%] text-gray-500 align-middle">
							{cell}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#each calendriers as row}
					<tr class="hover:bg-slate-100">
						{#each row as cell}
							{#if typeof cell._id != 'undefined'}
								<td class="text-center align-middle">
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
								</td>
							{:else}
								<td>
									{cell.benevole}<br />
									{#if cell.nbVaisselle !== ''}
										<span class="text-xs italic text-gray-400">
											nb Vais. : {cell.nbVaisselle} : {cell.lastVaisselle.substring(6, 8) +
												'/' +
												cell.lastVaisselle.substring(4, 6)}
										</span>
									{/if}
								</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
<div class={benevolesVisible}>
	<div class="py-2 grid gap-1">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Gérer les bénévoles</p>
		<div class="table text-center text-sm">
			<div class="table-row-group align-middle hover:bg-slate-100">
				<div class=" table-cell text-left w-1/6 align-middle py-1 px-1">
					<input
						type="text"
						bind:value={new_prenom}
						class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
				<div class=" table-cell text-left w-1/4 align-middle py-1 px-1">
					<input
						type="text"
						bind:value={new_nom}
						class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
				<div class=" table-cell text-left w-1/4 align-middle py-1 px-1">
					<input
						type="text"
						bind:value={new_email}
						class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
				<div class=" table-cell text-left w-1/4 align-middle py-1 px-1">
					<input
						type="text"
						bind:value={new_tel}
						class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
				<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
					<button
						class="bg-green-600 hover:bg-green-800 text-white py-1 px-1 rounded"
						on:click={insertBenevole(new_prenom, new_nom, new_email, new_tel)}>Insérer</button
					>
				</div>
				<div class=" table-cell text-left w-1/12 align-middle py-1 px-1" />
			</div>
			{#each benevoles as b}
				<div class="table-row-group align-middle hover:bg-slate-100">
					<div class=" table-cell text-left w-1/6 align-middle py-1 px-1">
						<input
							type="text"
							bind:value={b.prenom}
							class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
						/>
					</div>
					<div class=" table-cell text-left w-1/4 align-middle py-1 px-1">
						<input
							type="text"
							bind:value={b.nom}
							class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
						/>
					</div>
					<div class=" table-cell text-left w-1/4 align-middle py-1 px-1">
						<input
							type="text"
							bind:value={b.email}
							class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
						/>
					</div>
					<div class=" table-cell text-left w-1/6 align-middle py-1 px-1">
						<input
							type="text"
							bind:value={b.tel}
							class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
						/>
					</div>
					<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
						<button
							class="bg-green-400 hover:bg-green-600 text-gray-500 py-1 px-1 rounded"
							id={b._id}
							on:click={updateBenevole(b._id, b.prenom, b.nom, b.email, b.tel)}>Modifier</button
						>
					</div>
					<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
						<button
							class="bg-red-400 hover:bg-red-600 text-white py-1 px-1 rounded"
							id={b._id}
							on:click={deleteBenevole(b._id)}>Supprimer</button
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
<div class={soireeVisible}>
	<div class="py-2 grid gap-1 w-full">
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
