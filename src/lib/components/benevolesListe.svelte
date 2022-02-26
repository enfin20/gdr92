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
	let new_sexe = '';
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
		sexe,
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
		obj.camion = camion.substring(0, 1) === 'O' ? 'O' : 'N';
		try {
			obj.prepa = prepa.substring(0, 1) === 'O' ? 'O' : 'N';
		} catch {
			obj.prepa = 'N';
		}
		try {
			obj.rs = rs.substring(0, 1) === 'O' ? 'O' : 'N';
		} catch {
			obj.rs = 'N';
		}
		try {
			obj.rg = rg.substring(0, 1) === 'O' ? 'O' : 'N';
		} catch {
			obj.rg = 'N';
		}
		obj.maraude = maraude.substring(0, 1) === 'O' ? 'O' : 'N';
		try {
			obj.sexe = sexe;
		} catch {
			obj.sexe = '';
		}
		try {
			obj.chauffeur = chauffeur.substring(0, 1) === 'O' ? 'O' : 'N';
		} catch {
			obj.chauffeur = 'N';
		}
		try {
			obj.rsm = rsm.substring(0, 1) === 'O' ? 'O' : 'N';
		} catch {
			obj.rsm = 'N';
		}
		try {
			obj.rm = rm.substring(0, 1) === 'O' ? 'O' : 'N';
		} catch {
			obj.rm = 'N';
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
		sexe,
		chauffeur,
		rsm,
		rm
	) {
		var obj = new Object();
		obj.prenom = prenom;
		obj.nom = nom.toUpperCase();
		obj.email = email;
		obj.tel = tel;
		obj.camion = camion.substring(0, 1) === 'O' ? 'O' : 'N';
		try {
			obj.prepa = prepa.substring(0, 1) === 'O' ? 'O' : 'N';
		} catch {
			obj.prepa = 'N';
		}
		try {
			obj.rs = rs.substring(0, 1) === 'O' ? 'O' : 'N';
		} catch {
			obj.rs = 'N';
		}
		try {
			obj.rg = rg.substring(0, 1) === 'O' ? 'O' : 'N';
		} catch {
			obj.rg = 'N';
		}
		obj.maraude = maraude.substring(0, 1) === 'O' ? 'O' : 'N';
		try {
			obj.sexe = sexe;
		} catch {
			obj.sexe = '';
		}
		try {
			obj.chauffeur = chauffeur.substring(0, 1) === 'O' ? 'O' : 'N';
		} catch {
			obj.chauffeur = 'N';
		}
		try {
			obj.rsm = rsm.substring(0, 1) === 'O' ? 'O' : 'N';
		} catch {
			obj.rsm = 'N';
		}
		try {
			obj.rm = rm.substring(0, 1) === 'O' ? 'O' : 'N';
		} catch {
			obj.rm = 'N';
		}

		const res = await fetch('/benevoles/benevole', {
			method: 'POST',
			body: JSON.stringify(obj)
		});
		new_prenom = '';
		new_nom = '';
		new_email = '';
		new_tel = '';
		new_camion = '';
		new_rs = '';
		new_rg = '';
		new_maraude = '';
		new_sexe = '';
		new_chauffeur = '';
		new_rsm = '';
		new_rm = '';
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

	<div class="flex flex-col h-screen">
		<div class="flex-grow overflow-y-auto">
			<table id="BenevolesListe" class="text-sm text-gray-500 w-full relative">
				<thead>
					<tr>
						<th colspan="2" class="w-[20%] sticky top-0 bg-white">Prénom</th>
						<th colspan="3" class="w-[20%] sticky top-0 bg-white">Nom</th>
						<th colspan="3" class="w-[20%] sticky top-0 bg-white">Email</th>
						<th colspan="2" class="w-[20%] sticky top-0 bg-white">Tél</th>
						<th colspan="2" class="w-[20%] sticky top-0 bg-white" />
					</tr>
					<tr>
						<th class="w-[10%] sticky top-0 bg-green-100">Camion</th>
						<th class="w-[10%] sticky top-0 bg-green-100">Prepa</th>
						<th class="w-[10%] sticky top-0 bg-green-100">RS</th>
						<th class="w-[10%] sticky top-0 bg-green-100">RG</th>
						<th class="w-[10%] sticky top-0 bg-purple-100">Maraude</th>
						<th class="w-[10%] sticky top-0 bg-purple-100">H/F</th>
						<th class="w-[10%] sticky top-0 bg-purple-100">Conduc.</th>
						<th class="w-[10%] sticky top-0 bg-purple-100">RS Mar</th>
						<th class="w-[10%] sticky top-0 bg-purple-100">RG Mar</th>
						<th colspan="2" class="w-[10%] sticky top-0 bg-white" />
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
						</td> <td colspan="2" class="text-left align-middle py-1 px-1 w-[10%]" />
					</tr>
					<tr class="align-middle text-center border-collapse border-slate-200">
						<td class="align-middle py-1 px-1 w-[10%] bg-green-100">
							<input
								type="checkbox"
								bind:value={new_camion}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-green-300 checked:border-green-300 focus:outline-none float-center cursor-pointer"
							/>
						</td>
						<td class=" align-middle py-1 px-1 w-[10%] bg-green-100">
							<input
								type="checkbox"
								bind:value={new_prepa}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-green-300 checked:border-green-300 focus:outline-none float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-green-100">
							<input
								type="checkbox"
								bind:value={new_rs}
								class="appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-green-300 checked:border-green-300 float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-green-100">
							<input
								type="checkbox"
								bind:value={new_rg}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-green-300 checked:border-green-300 focus:outline-none float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-purple-100">
							<input
								type="checkbox"
								bind:value={new_maraude}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-pink-300 checked:border-pink-300 focus:outline-none float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-purple-100">
							<input
								type="checkbox"
								bind:value={new_sexe}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-pink-300 checked:border-pink-300 focus:outline-none float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-purple-100">
							<input
								type="checkbox"
								bind:value={new_chauffeur}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-pink-300 checked:border-pink-300 focus:outline-none float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-purple-100">
							<input
								type="checkbox"
								bind:value={new_rsm}
								class=" appearance-none h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-pink-300 checked:border-pink-300 focus:outline-none float-center cursor-pointer"
							/></td
						>
						<td class="align-middle py-1 px-1 w-[10%] bg-purple-100">
							<input
								type="checkbox"
								bind:value={new_rm}
								class=" h-6 w-6 border border-slate-300 rounded-sm bg-white checked:bg-pink-300 checked:border-pink-300 focus:outline-none float-center cursor-pointer"
							/>
						</td>
						<td class="text-left align-middle py-1 px-1 w-[5%]">
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
									new_sexe,
									new_chauffeur,
									new_rsm,
									new_rm
								)}>Insérer</button
							></td
						>
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
							<td colspan="2" class="text-left align-middle py-1 px-1 w-[10%]" />
						</tr>
						<tr class="align-middle text-center border-collapse border-slate-200">
							<td class="text-left align-middle py-1 px-1 w-[10%]">
								<input
									type="text"
									bind:value={b.camion}
									class="appearance-none border-2 bg-green-100 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
							<td class="text-left align-middle py-1 px-1 w-[10%]">
								<input
									type="text"
									bind:value={b.prepa}
									class="appearance-none border-2 bg-green-100 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
							<td class="text-left align-middle py-1 px-1 w-[10%]">
								<input
									type="text"
									bind:value={b.rs}
									class="appearance-none border-2 bg-green-100 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
							<td class="text-left align-middle py-1 px-1 w-[10%]">
								<input
									type="text"
									bind:value={b.rg}
									class="appearance-none border-2 bg-green-100 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
							<td class="text-left align-middle py-1 px-1 w-[10%]">
								<input
									type="text"
									bind:value={b.maraude}
									class="appearance-none border-2 bg-purple-100 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
							<td class="text-left align-middle py-1 px-1 w-[10%]">
								<input
									type="text"
									bind:value={b.sexe}
									class="appearance-none border-2 bg-purple-100 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
							<td class="text-left align-middle py-1 px-1 w-[10%]">
								<input
									type="text"
									bind:value={b.chauffeur}
									class="appearance-none border-2 bg-purple-100 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
							<td class="text-left align-middle py-1 px-1 w-[10%]">
								<input
									type="text"
									bind:value={b.rsm}
									class="appearance-none border-2 bg-purple-100 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
							<td class="text-left align-middle py-1 px-1 w-[10%]">
								<input
									type="text"
									bind:value={b.rm}
									class="appearance-none border-2 bg-purple-100 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
								/>
							</td>
							<td class="text-left align-middle py-1 px-1 w-[5%]">
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
										b.sexe,
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
