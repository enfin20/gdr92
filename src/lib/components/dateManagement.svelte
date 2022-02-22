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
