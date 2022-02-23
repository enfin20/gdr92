<script>
	export let benevoles;

	// nouveau bénévole
	let new_prenom = '';
	let new_nom = '';
	let new_email = '';
	let new_tel = '';
	let new_maraude = '';
	let new_camion = '';
	let new_sexe = '';
	let new_chauffeur = '';
	let new_rsm = '';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function showBenevoles() {
		dispatch('showBenevoles');
	}

	export async function updateBenevole(
		b_id,
		prenom,
		nom,
		email,
		tel,
		camion,
		maraude,
		sexe,
		chauffeur,
		rsm
	) {
		// Mise à jour du bénévole
		var obj = new Object();
		obj._id = b_id;
		obj.prenom = prenom;
		obj.nom = nom.toUpperCase();
		obj.email = email;
		obj.tel = tel;
		obj.maraude = maraude.substring(0, 1) === 'O' ? 'O' : 'N';
		obj.camion = camion.substring(0, 1) === 'O' ? 'O' : 'N';
		obj.sexe = sexe;
		obj.chauffeur = chauffeur.substring(0, 1) === 'O' ? 'O' : 'N';
		obj.rsm = rsm.substring(0, 1) === 'O' ? 'O' : 'N';
		const res = await fetch('/benevoles/benevole', {
			method: 'PUT',
			body: JSON.stringify(obj)
		});
	}

	export async function insertBenevole(
		prenom,
		nom,
		email,
		tel,
		camion,
		maraude,
		sexe,
		chauffeur,
		rsm
	) {
		var obj = new Object();
		obj.prenom = prenom;
		obj.nom = nom.toUpperCase();
		obj.email = email;
		obj.tel = tel;
		obj.maraude = maraude.substring(0, 1) === 'O' ? 'O' : 'N';
		obj.camion = camion.substring(0, 1) === 'O' ? 'O' : 'N';
		obj.sexe = sexe;
		obj.chauffeur = chauffeur.substring(0, 1) === 'O' ? 'O' : 'N';
		obj.rsm = rsm.substring(0, 1) === 'O' ? 'O' : 'N';

		const res = await fetch('/benevoles/benevole', {
			method: 'POST',
			body: JSON.stringify(obj)
		});
		new_prenom = '';
		new_nom = '';
		new_email = '';
		new_tel = '';
		new_camion = '';
		new_maraude = '';
		new_sexe = '';
		new_chauffeur = '';
		new_rsm = '';
		showBenevoles();
	}

	export async function deleteBenevole(b_id) {
		const res = await fetch('/benevoles/benevole', {
			method: 'DELETE',
			body: JSON.stringify(b_id)
		});
		showBenevoles();
	}
</script>

<div class="py-2 grid gap-1">
	<p class="text-2xl font-bold text-gray-800 md:text-xl">Gérer les bénévoles</p>
	<div class="table text-center text-sm">
		<div class="table-row-group align-middle hover:bg-slate-100 font-bold text-gray-600">
			<div class=" table-cell text-left w-1/6 align-middle py-1 px-1">Prénom</div>
			<div class=" table-cell text-left w-1/6 align-middle py-1 px-1">Nom</div>
			<div class=" table-cell text-left w-1/4 align-middle py-1 px-1">Email</div>
			<div class=" table-cell text-left w-1/6 align-middle py-1 px-1">Tél</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">Camion</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">Maraude</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">H/F</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">Chauffeur</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">Resp Mar</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1" />
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1" />
		</div>
		<div class="table-row-group align-middle hover:bg-slate-100">
			<div class=" table-cell text-left w-1/6 align-middle py-1 px-1">
				<input
					type="text"
					bind:value={new_prenom}
					class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class=" table-cell text-left w-1/6 align-middle py-1 px-1">
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
			<div class=" table-cell text-left w-1/6 align-middle py-1 px-1">
				<input
					type="text"
					bind:value={new_tel}
					class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
				<input
					type="text"
					bind:value={new_camion}
					class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
				<input
					type="text"
					bind:value={new_maraude}
					class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
				<input
					type="text"
					bind:value={new_sexe}
					class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
				<input
					type="text"
					bind:value={new_chauffeur}
					class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
				<input
					type="text"
					bind:value={new_rsm}
					class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
				/>
			</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
				<button
					class="bg-green-600 hover:bg-green-800 text-white py-1 px-1 rounded"
					on:click={insertBenevole(
						new_prenom,
						new_nom,
						new_email,
						new_tel,
						new_camion,
						new_maraude,
						new_sexe,
						new_chauffeur,
						new_rsm
					)}>Insérer</button
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
				<div class=" table-cell text-left w-1/6 align-middle py-1 px-1">
					<input
						type="text"
						bind:value={b.nom}
						class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
				<div class=" table-cell text-left w-1/6 align-middle py-1 px-1">
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
					<input
						type="text"
						bind:value={b.camion}
						class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
				<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
					<input
						type="text"
						bind:value={b.maraude}
						class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
				<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
					<input
						type="text"
						bind:value={b.sexe}
						class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
				<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
					<input
						type="text"
						bind:value={b.chauffeur}
						class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
				<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
					<input
						type="text"
						bind:value={b.rsm}
						class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
					/>
				</div>
				<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
					<button
						class="bg-green-400 hover:bg-green-600 text-gray-500 py-1 px-1 rounded"
						id={b._id}
						on:click={updateBenevole(
							b._id,
							b.prenom,
							b.nom,
							b.email,
							b.tel,
							b.camion,
							b.maraude,
							b.sexe,
							b.chauffeur,
							b.rsm
						)}>Modifier</button
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
