<script>
	export let email;
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function getBenevole() {
		dispatch('message', {
			text: email
		});
	}
</script>

<div class="md:flex md:items-center mb-6">
	<div class="md:w-1/3">
		<label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="email">
			Email
		</label>
	</div>
	<div class="md:w-2/3">
		<input
			type="text"
			bind:value={email}
			name="email"
			placeholder="Email"
			class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
		/>
	</div>
</div>
<div class="md:flex md:items-center">
	<div class="md:w-1/3" />
	<div class="md:w-2/3">
		<button
			type="submit"
			class="shadow bg-pink-400 hover:bg-pink-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
			on:click={getBenevole}>Entrer</button
		>
	</div>
</div>
