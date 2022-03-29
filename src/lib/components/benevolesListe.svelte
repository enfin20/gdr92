<script>
	export let benevoles;

	// nouveau bénévole
	let new_prenom = '';
	let new_nom = '';
	let new_email = '';
	let new_tel = '';
	let new_maraude = false;
	let new_camion = false;
	let new_prepa = false;
	let new_rs = false;
	let new_rg = false;
	let new_homme = false;
	let new_chauffeur = false;
	let new_rsm = false;
	let new_rm = false;

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
		prepa,
		rs,
		rg,
		maraude,
		homme,
		chauffeur,
		rsm,
		rm
	) {
		// Mise à jour du bénévole
		var obj = new Object();
		obj._id = b_id;
		obj.prenom = prenom;
		obj.nom = nom.toUpperCase();
		obj.email = email;
		obj.tel = tel;
		obj.camion = camion;
		try {
			obj.prepa = prepa;
		} catch {
			obj.prepa = false;
		}
		try {
			obj.rs = rs;
		} catch {
			obj.rs = false;
		}
		try {
			obj.rg = rg;
		} catch {
			obj.rg = false;
		}
		obj.maraude = maraude;
		try {
			obj.homme = homme;
		} catch {
			obj.homme = false;
		}
		try {
			obj.chauffeur = chauffeur;
		} catch {
			obj.chauffeur = false;
		}
		try {
			obj.rsm = rsm;
		} catch {
			obj.rsm = false;
		}
		try {
			obj.rm = rm;
		} catch {
			obj.rm = false;
		}
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
		prepa,
		rs,
		rg,
		maraude,
		homme,
		chauffeur,
		rsm,
		rm
	) {
		var obj = new Object();
		obj.prenom = prenom;
		obj.nom = nom.toUpperCase();
		obj.email = email;
		obj.tel = tel;
		console.log('prépa ' + prepa);
		try {
			obj.camion = camion;
		} catch {
			obj.camion = false;
		}

		try {
			obj.prepa = new_prepa;
		} catch {
			obj.prepa = false;
		}
		try {
			obj.rs = rs;
		} catch {
			obj.rs = false;
		}
		try {
			obj.rg = rg;
		} catch {
			obj.rg = false;
		}
		try {
			obj.maraude = maraude;
		} catch {
			obj.maraude = false;
		}

		try {
			obj.homme = homme;
		} catch {
			obj.homme = false;
		}
		try {
			obj.chauffeur = chauffeur;
		} catch {
			obj.chauffeur = false;
		}
		try {
			obj.rsm = rsm;
		} catch {
			obj.rsm = false;
		}
		try {
			obj.rm = rm;
		} catch {
			obj.rm = false;
		}
		const res = await fetch('/benevoles/benevole', {
			method: 'POST',
			body: JSON.stringify(obj)
		});
		new_prenom = '';
		new_nom = '';
		new_email = '';
		new_tel = '';
		new_camion = false;
		new_rs = false;
		new_rg = false;
		new_maraude = false;
		new_homme = false;
		new_chauffeur = false;
		new_rsm = false;
		new_rm = false;
		showBenevoles();
	}
</script>

<div class="py-2 grid gap-1">
	<p class="text-2xl font-bold text-gray-800 md:text-xl">Gérer les bénévoles</p>

	<div class="flex flex-col h-screen">
		<div class="flex-grow overflow-y-auto">
			<table id="BenevolesListe" class="text-sm text-gray-500 w-full relative">
				<thead>
					<tr>
						<th colspan="2" class="w-[20%] sticky top-0 bg-white">Prénom</th>
						<th colspan="3" class="w-[25%] sticky top-0 bg-white">Nom</th>
						<th colspan="3" class="w-[25%] sticky top-0 bg-white">Email</th>
						<th colspan="2" class="w-[20%] sticky top-0 bg-white">Tél</th>
					</tr>
					<tr>
						<th class="w-[10%] sticky top-0 bg-blue-100">Camion</th>
						<th class="w-[10%] sticky top-0 bg-blue-100">Prepa</th>
						<th class="w-[10%] sticky top-0 bg-blue-100">RS</th>
						<th class="w-[10%] sticky top-0 bg-blue-100">RG</th>
						<th class="w-[10%] sticky top-0 bg-amber-200">Maraude</th>
						<th class="w-[10%] sticky top-0 bg-amber-200">Homme</th>
						<th class="w-[10%] sticky top-0 bg-amber-200">Conduc.</th>
						<th class="w-[10%] sticky top-0 bg-amber-200">RS Mar</th>
						<th class="w-[10%] sticky top-0 bg-amber-200">RG Mar</th>
						<th class="w-[10%] sticky top-0 bg-white" />
					</tr>
				</thead>
				<tbody class="">
					<tr class="align-middle text-center border-collapse border-t-[1px] border-slate-200">
						<td colspan="2" class="text-left align-middle py-1 px-1 w-[20%]">
							<input
								type="text"
								bind:value={new_prenom}
								class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
							/>
						</td>
						<td colspan="3" class="text-left align-middle py-1 px-1 w-[25%]">
							<input
								type="text"
								bind:value={new_nom}
								class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
							/>
						</td>
						<td colspan="3" class="text-left align-middle py-1 px-1 w-[25%]">
							<input
								type="text"
								bind:value={new_email}
								class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
							/>
						</td>
						<td colspan="2" class="text-left align-middle py-1 px-1 w-[20%]">
							<input
								type="text"
								bind:value={new_tel}
								class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
							/>
						</td>
					</tr>
					<tr class="align-middle text-center border-collapse border-slate-200">
						<td class="align-middle py-1 px-1 w-[10%] bg-blue-100">
							<input
								type="checkbox"
								bind:value={new_camion}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-blue-300 checked:border-blue-300 focus:outline-none float-center cursor-pointer"
							/>
						</td>
						<td class=" align-middle py-1 px-1 w-[10%] bg-blue-100">
							<input
								type="checkbox"
								bind:value={new_prepa}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-blue-300 checked:border-blue-300 focus:outline-none float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-blue-100">
							<input
								type="checkbox"
								bind:value={new_rs}
								class="appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-blue-300 checked:border-blue-300 float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-blue-100">
							<input
								type="checkbox"
								bind:value={new_rg}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-blue-300 checked:border-blue-300 focus:outline-none float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-amber-200">
							<input
								type="checkbox"
								bind:value={new_maraude}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-amber-400 checked:border-amber-400 focus:outline-none float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-amber-200">
							<input
								type="checkbox"
								bind:value={new_homme}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-amber-400 checked:border-amber-400 focus:outline-none float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-amber-200">
							<input
								type="checkbox"
								bind:value={new_chauffeur}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-amber-400 checked:border-amber-400 focus:outline-none float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-amber-200">
							<input
								type="checkbox"
								bind:value={new_rsm}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-amber-400 checked:border-amber-400 focus:outline-none float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-amber-200">
							<input
								type="checkbox"
								bind:value={new_rm}
								class=" h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-amber-400 checked:border-amber-400 focus:outline-none float-center cursor-pointer"
							/>
						</td>
						<td class="align-middle py-1 px-1 w-[10%]">
							<button
								class="bg-green-600 hover:bg-green-800 text-white py-1 px-1 rounded"
								on:click={insertBenevole(
									new_prenom,
									new_nom,
									new_email,
									new_tel,
									new_camion,
									new_prepa,
									new_rs,
									new_rg,
									new_maraude,
									new_homme,
									new_chauffeur,
									new_rsm,
									new_rm
								)}
								>Insérer
							</button>
						</td>
					</tr>
					{#each benevoles as b}
						<tr class="align-middle text-center border-collapse border-t-[1px] border-slate-200">
							<td colspan="2" class="text-left align-middle py-1 px-1 w-[20%]">
								<input
									type="text"
									bind:value={b.prenom}
									class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
							<td colspan="3" class="text-left align-middle py-1 px-1 w-[25%]">
								<input
									type="text"
									bind:value={b.nom}
									class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
							<td colspan="3" class="text-left align-middle py-1 px-1 w-[25%]">
								<input
									type="text"
									bind:value={b.email}
									class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
							<td colspan="2" class="text-left align-middle py-1 px-1 w-[20%]">
								<input
									type="text"
									bind:value={b.tel}
									class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
						</tr>
						<tr class="align-middle text-center border-collapse border-slate-200">
							<td class="align-middle py-1 px-1 w-[10%] bg-blue-100">
								<input
									type="checkbox"
									bind:checked={b.camion}
									class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-blue-300 checked:border-blue-300 focus:outline-none float-center cursor-pointer"
								/>
							</td>
							<td class="align-middle py-1 px-1 w-[10%] bg-blue-100">
								<input
									type="checkbox"
									bind:checked={b.prepa}
									class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-blue-300 checked:border-blue-300 focus:outline-none float-center cursor-pointer"
								/>
							</td>
							<td class="align-middle py-1 px-1 w-[10%] bg-blue-100">
								<input
									type="checkbox"
									bind:checked={b.rs}
									class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-blue-300 checked:border-blue-300 focus:outline-none float-center cursor-pointer"
								/>
							</td>
							<td class="align-middle py-1 px-1 w-[10%] bg-blue-100">
								<input
									type="checkbox"
									bind:checked={b.rg}
									class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-blue-300 checked:border-blue-300 focus:outline-none float-center cursor-pointer"
								/>
							</td>
							<td class="align-middle py-1 px-1 w-[10%] bg-amber-200">
								<input
									type="checkbox"
									bind:checked={b.maraude}
									class=" h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-amber-400 checked:border-amber-400 focus:outline-none float-center cursor-pointer"
								/>
							</td>
							<td class="align-middle py-1 px-1 w-[10%] bg-amber-200">
								<input
									type="checkbox"
									bind:checked={b.homme}
									class=" h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-amber-400 checked:border-amber-400 focus:outline-none float-center cursor-pointer"
								/>
							</td>
							<td class="align-middle py-1 px-1 w-[10%] bg-amber-200">
								<input
									type="checkbox"
									bind:checked={b.chauffeur}
									class=" h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-amber-400 checked:border-amber-400 focus:outline-none float-center cursor-pointer"
								/>
							</td>
							<td class="align-middle py-1 px-1 w-[10%] bg-amber-200">
								<input
									type="checkbox"
									bind:checked={b.rsm}
									class=" h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-amber-400 checked:border-amber-400 focus:outline-none float-center cursor-pointer"
								/>
							</td>
							<td class="align-middle py-1 px-1 w-[10%] bg-amber-200">
								<input
									type="checkbox"
									bind:checked={b.rm}
									class=" h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-amber-400 checked:border-amber-400 focus:outline-none float-center cursor-pointer"
								/>
							</td>
							<td class="align-middle py-1 px-1 w-[10%]">
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
										b.prepa,
										b.rs,
										b.rm,
										b.maraude,
										b.homme,
										b.chauffeur,
										b.rsm,
										b.rm
									)}>Modifier</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	<div class="table text-center text-sm" />
</div>
