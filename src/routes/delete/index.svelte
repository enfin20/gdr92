<script context="module">
</script>

<script>
	let statutEnregistrement = '';
	let email = '';

	export async function deleteBenevole() {
		statutEnregistrement = '';
		var obj = new Object();
		obj.email = email;
		const res = await fetch('/benevoles/benevole', {
			method: 'DELETE',
			body: JSON.stringify(obj)
		});
		statutEnregistrement = 'Bénévole supprimé';
	}
</script>

<svelte:head>
	<title>Planning restos Colombes</title>
</svelte:head>
{statutEnregistrement}
Email
<input
	type="text"
	bind:value={email}
	class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
/>
<button
	class="bg-green-600 hover:bg-green-800 text-white py-1 px-1 rounded"
	on:click={deleteBenevole}
	>Supprimer
</button>
