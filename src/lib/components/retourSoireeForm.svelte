<script>
	export let benevole;

	let buttonStatutBg = 'bg-green-400 hover:bg-green-600';

	function ChangeStatus() {
		var changed = false;
		if (benevole.statut === 'Non') {
			changed = true;
			benevole.statut = 'Oui';
			buttonStatutBg = 'bg-green-400 hover:bg-green-600';
		} else {
			if (!changed) {
				benevole.statut = 'Non';
				buttonStatutBg = 'bg-red-200 hover:bg-red-400';
				changed = true;
			}
		}
	}
</script>

<div class="flex  mb-1">
	<div class="w-1/2">
		<span class="block text-gray-500 md:text-left mb-1 md:mb-0 pr-4 text-sm">
			{benevole.benevole}
		</span>
	</div>
	<div class="w-1/4">
		<span class="block text-gray-500 md:text-left mb-1 md:mb-0 pr-4 text-sm">
			<a href="tel:+{benevole.tel}"
				><img src="/images/phone.png" alt="appel" width="32px" height="32px" />
			</a>
		</span>
	</div>
	<div class="w-1/4">
		<button
			class=" text-gray-600 font-bold py-1 px-2 rounded {buttonStatutBg} text-sm"
			on:click={ChangeStatus}>{benevole.statut}</button
		>
	</div>
</div>
