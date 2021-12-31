<script context="module">
</script>

<script>
	import { respond } from '@sveltejs/kit/ssr';
	import { each, text, time_ranges_to_array } from 'svelte/internal';
	import LoginForm from '/src/lib/components/loginForm.svelte';
	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

	var calendriers = ['1', '2'];
	let loginVisible = 'flex';
	let soiree = '';
	let soirees = [''];
	let calendrierVisible = 'none';
	let plageActive = [true, true, true];
	var plage = ['18h15-19h45', '20h-21h30', '14h-18h'];
	let lieu = ['gare', 'Gabriel Péri', 'entrepot'];
	let statutEnregistrement = '';

	let email = '';

	// login du rg
	export async function getBenevole(event) {
		email = event.detail.text;
		const res = await fetch('./benevole?email=' + email);
		const benevole = await res.json();
		try {
			if (benevole.benevole.rg === 'Oui') {
				calendrierVisible = 'flex';
				loginVisible = 'none';
			} else {
				calendrierVisible = 'none';
			}
		} catch {
			alert('Email non valide');
		}
	}
	//visualisation du calendrier complet
	export async function getCalendrier() {
		const res = await fetch('./calendrierBenevoles');
		const cal = await res.json();

		// remise au format des dates et des entêtes
		for (var i = cal.tableau[0].length; i > 0; i--) {
			cal.tableau[0][i] =
				new Date(cal.tableau[0][i - 1].substring(0, 24)).toLocaleString('fr-FR', dateOptions) +
				'<br/>' +
				cal.tableau[0][i - 1].substring(27);
		}
		cal.tableau[0][0] = 'Calendrier ';
		soirees = await cal.tableau[0];
		// suppression de l'entête
		for (var j = 0; j < cal.tableau.length; j++) {
			cal.tableau[j] = cal.tableau[j + 1];
		}
		cal.tableau[j + 1] = '';
		calendriers = await cal.tableau;
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
					const res = await fetch('/addCalendrierBenevoles', {
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

		const retourSoiree = await fetch('/addRetourSoirees', {
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
		<LoginForm {email} on:message={getBenevole} />
	</div>
</span>
<span style="display: {calendrierVisible};">
	<div class="py-2 grid gap-1">
		<form class="my-1" on:submit|preventDefault={addCalendrier}>
			<input type="date" bind:value={soiree} class="text-gray-800" /><br />
			<input type="checkbox" bind:checked={plageActive[0]} />
			<input type="text" bind:value={plage[0]} />
			<input type="text" bind:value={lieu[0]} /><br />
			<input type="checkbox" bind:checked={plageActive[1]} />
			<input type="text" bind:value={plage[1]} />
			<input type="text" bind:value={lieu[1]} /><br />
			<input type="checkbox" bind:checked={plageActive[2]} />
			<input type="text" bind:value={plage[2]} />
			<input type="text" bind:value={lieu[2]} /><br />
			<button
				type="submit"
				class="bg-green-400 hover:bg-green-600 text-gray-600 font-bold py-2 px-4 rounded"
				>Enregistrer</button
			>
			<p>{statutEnregistrement}</p>
		</form>
		<form class="my-1" on:submit|preventDefault={getCalendrier}>
			<button
				type="submit"
				class="bg-green-400 hover:bg-green-600 text-gray-600 font-bold py-2 px-4 rounded"
				>Calendrier</button
			>
		</form>

		<div class="bg-green-500 block">nb rows : {calendriers.length}</div>
		<div class="table text-center">
			<div class="table-header-group">
				{#each soirees as cell}
					<div class=" table-cell">{@html cell}</div>
				{/each}
			</div>
			{#each calendriers as row}
				<div class="table-row-group">
					{#each row as cell}
						<div class=" table-cell">{@html cell}</div>
					{/each}
				</div>
			{/each}
		</div>
		<div class="py-4 grid gap-1">
			<div class="container mb-2 flex mx-auto w-full items-center justify-center" />
		</div>
	</div>
</span>
