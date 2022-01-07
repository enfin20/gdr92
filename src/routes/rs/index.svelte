<script context="module">
</script>

<script>
	import { respond } from '@sveltejs/kit/ssr';
	import { each, select_multiple_value, select_option, text } from 'svelte/internal';
	import RetourSoireeForm from '/src/lib/components/retourSoireeForm.svelte';
	import LoginForm from '/src/lib/components/loginForm.svelte';
	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	//	const dateCal = { year: 'numeric', month: 'numeric', day: 'numeric' };
	let loginVisible = 'flex';
	let statutVisible = 'none';
	let retourVisible = 'none';
	let retourSoiree = [];
	let benevoles = [];
	let rs = '';
	let currentDate = new Date();
	let soiree = currentDate
		.getFullYear()
		.toString()
		.concat('-')
		.concat(currentDate.getMonth() + 1)
		.concat('-')
		.concat(currentDate.getDate());
	let email = '';

	export async function getBenevole(event) {
		email = event.detail.text;
		const res = await fetch('./benevole?email=' + email);
		const benevole = await res.json();
		try {
			if (benevole.benevole.rs === 'Oui') {
				rs = benevole.benevole.prenom + ' ' + benevole.benevole.nom;
				const res = await fetch('./retourSoiree?soiree=' + soiree);
				const retour = await res.json();
				const ben = await retour.benevoles;
				retourSoiree = await retour.retourSoiree[0];
				const soireeY = retourSoiree.soiree.substring(0, 4);
				const soireeM = retourSoiree.soiree.substring(4, 6);
				const soireeD = retourSoiree.soiree.substring(6, 8);
				//console.log(ben);
				const benT = [];
				retourSoiree.soireeD = new Date(soireeY + '-' + soireeM + '-' + soireeD).toLocaleDateString(
					'fr-FR',
					dateOptions
				);
				for (var i = 0; i < ben.length; i++) {
					var obj = new Object();
					obj.benevole = ben[i];
					obj.statut = 'Oui';
					benT.push(obj);
				}
				benevoles = await benT;
				console.log(benevoles);
				retourVisible = 'block';
				loginVisible = 'none';
			}
		} catch {
			alert('Email non valide');
		}
	}

	export async function updateSoiree() {
		var retSoiree = new Object();
		retSoiree.soiree = retourSoiree.soiree;
		retSoiree.rs = email;
		retSoiree.nbGare = retourSoiree.nbGare;
		retSoiree.nbPeri = retourSoiree.nbPeri;
		retSoiree.commentaires = retourSoiree.commentaires;
		retSoiree.benevoles = benevoles;
		console.log(retSoiree);
		const res = await fetch('/retourSoiree', {
			method: 'PUT',
			body: JSON.stringify(retSoiree)
		});
		statutVisible = 'block';
	}
</script>

<svelte:head>
	<title>Planning restos Colombes</title>
</svelte:head>

<div style="display: {loginVisible};">
	<div class="py-4 grid gap-1">
		<h1 class="text-2xl my-8 font-bold text-gray-800 md:text-3xl">Responsable de soirée</h1>
		<div class="md:flex md:items-center mb-6">
			<div class="md:w-1/3">
				<label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="soiree">
					Soirée
				</label>
			</div>
			<div class="md:w-2/3">
				<input
					id="soiree"
					type="date"
					bind:value={soiree}
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
		</div>
		<LoginForm {email} on:message={getBenevole} />
	</div>
</div>
<div style="display: {retourVisible};">
	<div
		class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
		style="display: {statutVisible};"
	>
		<span class="block sm:inline">Soirée enregistrée.</span>
	</div>
	<div class="flex">
		<div class="py-2 grid gap-1">
			<div class="md:flex md:items-center mb-2">
				<div class="md:w-2/3">
					<span class="block text-gray-500 font-bold  mb-1 md:mb-0 pr-4 text-xl">
						{retourSoiree.soireeD}
					</span>
				</div>
				<div class="md:w-1/3" />
			</div>
			<div class="md:flex md:items-center mb-2">
				<div class="md:w-1/2">
					<span class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
						Responsable soirée
					</span>
				</div>
				<div class="md:w-1/2">
					<span class="block text-gray-500 font-bold  mb-1 md:mb-0 pr-4">
						{rs}
					</span>
				</div>
			</div>

			{#each benevoles as benevole}
				<RetourSoireeForm {benevole} />
			{/each}

			<div class="md:flex md:items-center mb-2">
				<div class="md:w-1/2">
					<label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="gare">
						Nombre Gare
					</label>
				</div>
				<div class="md:w-1/2">
					<input
						type="text"
						bind:value={retourSoiree.nbGare}
						name="gare"
						placeholder=""
						class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
			</div>
			<div class="md:flex md:items-center mb-2">
				<div class="md:w-1/2">
					<label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="peri">
						Nombre Gabriel Péri
					</label>
				</div>
				<div class="md:w-1/2">
					<input
						type="text"
						bind:value={retourSoiree.nbPeri}
						name="peri"
						placeholder=""
						class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
			</div>
			<div class="md:flex md:items-center mb-2">
				<div class="md:w-1/2">
					<label
						class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
						for="commentaires"
					>
						Commentaires
					</label>
				</div>
				<div class="md:w-1/2">
					<textarea
						rows="10"
						bind:value={retourSoiree.commentaires}
						name="commentaires"
						class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
			</div>
			<form class="my-6" on:submit|preventDefault={updateSoiree}>
				<div class="md:flex md:items-center">
					<div class="md:w-1/2" />
					<div class="md:w-1/2">
						<button
							type="submit"
							class="shadow bg-green-400 hover:bg-green-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
							>Entrer</button
						>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
