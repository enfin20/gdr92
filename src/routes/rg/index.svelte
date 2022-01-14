<script context="module">
</script>

<script>
	import { respond } from '@sveltejs/kit/ssr';
	import { claim_element, clear_loops, each, text, time_ranges_to_array } from 'svelte/internal';
	import LoginForm from '/src/lib/components/loginForm.svelte';
	import RetourSoireeForm from '/src/lib/components/retourSoireeForm.svelte';
	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

	var calendriers = [];
	var presences = [];
	let benevolesListe = [];
	let loginVisible = 'flex';
	let soiree = '';
	let soirees = [];
	let lieux = [];
	let mois = [];
	let menuVisible = 'none';
	let calendrierVisible = 'none';
	let dateVisible = 'none';
	let benevoleVisible = 'none';
	let soireeVisible = 'none';
	let plageActive = [true, true, true];
	var plage = ['18h15-20h', '20h-21h30', '14h-18h'];
	let lieu = ['gare', 'gp', 'entrepot'];
	let statutEnregistrement = '';
	const pwdVisible = 'flex';

	let email = '';
	let pwd = '';

	// login du rg
	export async function getBenevole(event) {
		email = event.detail.text;
		let pwd = event.detail.pwd;
		const res = await fetch('./benevoles/benevole?email=' + email + '&rg=Oui&pwd=' + pwd);
		const benevole = await res.json();
		console.log('bene,' + benevole.benevole.nom);
		try {
			if (benevole.benevole.rg === 'Oui') {
				menuVisible = 'flex';
				loginVisible = 'none';
			} else {
				menuVisible = 'none';
				calendrierVisible = 'none';
				dateVisible = 'none';
			}
		} catch {
			alert('Email non valide');
		}
	}

	export async function showBenevole() {
		benevoleVisible = 'flex';
		dateVisible = 'none';
		calendrierVisible = 'none';
		soireeVisible = 'none';
		const res = await fetch('/calendrierBenevoles/updateBenevole', {
			method: 'PUT',
			body: JSON.stringify('essai')
		});
		/* 		const res = await fetch('./benevoles');
		benevolesListe = await res.json();
		console.log(benevolesListe); */
	}
	export async function showDate() {
		benevoleVisible = 'none';
		dateVisible = 'flex';
		calendrierVisible = 'none';
		soireeVisible = 'none';
	}
	export async function ShowCalendrier() {
		benevoleVisible = 'none';
		dateVisible = 'none';
		calendrierVisible = 'flex';
		soireeVisible = 'none';
		let currentYear = new Date().getFullYear();
		let currentMonth = new Date().getMonth() + 2;
		let normedMonth = '0';
		if (currentMonth <= 9) {
			normedMonth = normedMonth.concat(currentMonth);
		}
		if (currentMonth > 12) {
			normedMonth = '01';
			currentYear = currentYear + 1;
		}
		soiree = normedMonth + '/' + currentYear.toString();
		console.log(soiree);
		getCalendrier();
	}
	export async function showSoiree() {
		benevoleVisible = 'none';
		dateVisible = 'none';
		calendrierVisible = 'none';
		soireeVisible = 'flex';
	}
	export async function getCalendrier() {
		calendriers = [];
		lieux = [];
		soirees = [];
		const soireeNormed = soiree.substring(3, 8).toString().concat(soiree.substring(0, 2));
		console.log('Normed : ' + soireeNormed);
		const res = await fetch('./calendrierBenevoles?soiree=' + soireeNormed);
		const cal = await res.json();

		// remise au format des dates et des entêtes
		for (var i = cal.tableau[0].length; i > 0; i--) {
			const soireeM = cal.tableau[0][i - 1].substring(4, 6);
			const soireeD = cal.tableau[0][i - 1].substring(6, 8);
			cal.tableau[0][i] = soireeD + '/' + soireeM;
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
		nbBenevoles();
	}
	export async function deleteCalendrier() {
		const soireeNormed = soiree.substring(3, 8).toString().concat(soiree.substring(0, 2));
		console.log('Normed : ' + soireeNormed);
		const res = await fetch('/calendrierBenevoles', {
			method: 'DELETE',
			body: JSON.stringify(soireeNormed)
		});
	}
	export async function saveCalendrier() {
		var calUpdated = [];

		for (var i = 0; i < calendriers.length; i++) {
			for (var j = 1; j < calendriers[i].length; j++) {
				var obj = new Object();
				obj._id = calendriers[i][j]._id;
				obj.statut = calendriers[i][j].presence;
				obj.updated = '';
				if (calendriers[i][j].updated === 'Oui') {
					calUpdated.push(obj);
				}
			}
		}
		console.log('0 1' + calendriers[0][1]._id);
		const res = await fetch('/calendrierBenevoles', {
			method: 'PUT',
			body: JSON.stringify(calUpdated)
		});
	}

	function CalendrierChangeStatut(button_id) {
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
		nbBenevoles();
	}

	function nbBenevoles() {
		presences = [];
		presences[0] = 'Nb bénévoles';
		for (var k = 1; k < calendriers[0].length; k++) {
			presences[k] = 0;
		}

		for (var i = 0; i < calendriers.length; i++) {
			for (var j = 1; j < calendriers[i].length; j++) {
				if (calendriers[i][j].presence === 'Oui') {
					presences[j] = presences[j] + 1;
				}
				if (calendriers[i][j].presence === 'RS') {
					presences[j] = presences[j] + 1;
				}
				if (calendriers[i][j].presence === 'Vaisselle') {
					presences[j] = presences[j] + 1;
				}
			}
		}
		console.log(presences);
	}

	export async function addCalendrier() {
		var obj = new Object();
		var obj2 = new Object();

		obj.soiree = soiree.replaceAll('-', '');
		obj.statut = '';
		obj.actif = 'Oui';

		// récupération des bénévoles actifs
		const res = await fetch('/benevoles');
		let benevoles = await res.json();
		for (var i = 0; i < benevoles.benevoles.length; i++) {
			obj.email = benevoles.benevoles[i].email;
			obj.benevole = benevoles.benevoles[i].prenom + ' ' + benevoles.benevoles[i].nom;
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
		obj2.benevoles = '';

		const retourSoiree = await fetch('/retourSoirees/addRetourSoirees', {
			method: 'POST',
			body: JSON.stringify(obj2)
		});
		statutEnregistrement = soiree + ' : enregistrée';
	}
</script>

<svelte:head>
	<title>Planning restos Colombes</title>
</svelte:head>

<span style="display: {loginVisible};">
	<div class="py-4 grid gap-1">
		<h1 class="text-2xl my-8 font-bold text-gray-800 md:text-3xl">Login Responsable du groupe</h1>
		<LoginForm {email} {pwdVisible} on:message={getBenevole} />
	</div>
</span>
<div style="display: {menuVisible};">
	<button
		type="submit"
		name="benevoles"
		class="mr-3 inline-block   bg-pink-200 hover:bg-pink-300 rounded py-1 px-3  text-gray-600"
		on:click={showBenevole}
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
		name="soiree"
		class="mr-3 inline-block   bg-pink-200 hover:bg-pink-300 rounded py-1 px-3  text-gray-600"
		on:click={showSoiree}
	>
		Soirées
	</button>
</div>
<div style="display: {dateVisible};">
	<div class="py-2 grid gap-1">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Ajouter une soirée</p>
		<form class="my-1" on:submit|preventDefault={addCalendrier}>
			<div class="py-2">
				<input
					type="date"
					bind:value={soiree}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/3 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class="py-2">
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
			<div class="py-2">
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
			<div class="py-2 ">
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
			<div class="py-2 ">
				<button
					type="submit"
					class="bg-green-400 hover:bg-green-600 text-gray-600 font-bold py-2 px-4 rounded"
					>Enregistrer</button
				>
				<p>{statutEnregistrement}</p>
			</div>
		</form>
	</div>
</div>
<div style="display: {calendrierVisible};">
	<div class="py-2 grid gap-1">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Gérer le calendrier</p>
		<div class="md:flex md:items-center">
			<div class="md:w-2/3">
				<form on:submit|preventDefault={getCalendrier}>
					<input
						type="text"
						bind:value={soiree}
						class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
					<button
						type="submit"
						class="shadow bg-green-400 hover:bg-green-500 focus:shadow-outline focus:outline-none text-gray-700  py-2 px-4 rounded"
						>Entrer</button
					>
				</form>
			</div>
			<div class="md:w-2/3">
				<form on:submit|preventDefault={deleteCalendrier}>
					<button
						type="submit"
						class="shadow bg-red-400 hover:bg-red-500 focus:shadow-outline focus:outline-none text-gray-700  py-2 px-4 rounded"
						>Supprimer</button
					>
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
		<div class="table text-center text-sm">
			<div class="table-header-group">
				{#each soirees as cell}
					<div class=" table-cell text-center w-1/12">{cell}</div>
				{/each}
			</div>
			<div class="table-header-group ">
				{#each lieux as cell}
					<div class=" table-cell  w-1/12">
						<div class="flex items-center justify-center">{@html cell}</div>
					</div>
				{/each}
			</div>
			<div class="table-header-group align-middle">
				{#each presences as cell}
					<div class=" table-cell text-center font-bold w-1/12 text-gray-500 align-middle">
						{cell}
					</div>
				{/each}
			</div>
			{#each calendriers as row}
				<div class="table-row-group align-middle">
					{#each row as cell}
						{#if typeof cell._id != 'undefined'}
							<div class=" table-cell text-center w-1/12 align-middle">
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
							</div>
						{:else}
							<div class=" table-cell text-left w-1/4 align-middle py-1 px-1">
								{cell}
							</div>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
<div style="display: {benevoleVisible};">
	<div class="py-2 grid gap-1">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Gérer les bénévoles</p>
	</div>
</div>
<div style="display: {soireeVisible};">
	<div class="py-2 grid gap-1">
		<p class="text-2xl font-bold text-gray-800 md:text-xl">Gérer les soirées</p>
	</div>
</div>
