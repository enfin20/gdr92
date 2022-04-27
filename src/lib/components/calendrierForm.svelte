<script>
	import { date_dd_MM_YYYY } from '$lib/date_functions';
	export let calendrier;
	export let prepa;
	let soiree = '';
	let rowbg = '';
	let buttonStatutBg = '';
	let displayPrepa = 'flex';

	// mise au format français
	soiree = date_dd_MM_YYYY(calendrier.soiree).date;

	//initialisation de l'affichage
	if (calendrier.lieu === 'entrepot' && !prepa) {
		displayPrepa = 'none';
	}
	if (calendrier.statut === 'Oui') {
		buttonStatutBg = 'bg-green-400 hover:bg-green-600';
	} else if (calendrier.statut === 'Maraude') {
		calendrier.statut = 'Non';
		buttonStatutBg = 'bg-red-200 hover:bg-red-400';
	} else {
		calendrier.statut = 'Non';
		buttonStatutBg = 'bg-red-200 hover:bg-red-400';
	}
	if (soiree.substring(0, 3) === 'lun') {
		rowbg = 'bg-gray-100';
	} else if (soiree.substring(0, 3) === 'mer') {
		rowbg = 'bg-gray-300';
	} else {
		rowbg = 'bg-amber-200';
	}
	if (calendrier.lieu === 'maraude') {
		rowbg = 'bg-indigo-100';
	}
	if (calendrier.lieu === 'entrepot' && soiree.substring(0, 3) === 'lun') {
		rowbg = 'bg-blue-100';
	}
	if (calendrier.lieu === 'entrepot' && soiree.substring(0, 3) === 'mer') {
		rowbg = 'bg-blue-200';
	}

	function ChangeStatus() {
		if (calendrier.statut === 'Non') {
			calendrier.statut = 'Oui';
			buttonStatutBg = 'bg-green-400 hover:bg-green-600';
		} else {
			calendrier.statut = 'Non';
			buttonStatutBg = 'bg-red-200 hover:bg-red-400';
		}
	}
</script>

<li class="flex flex-row" style="display:{displayPrepa}">
	<div
		class="select-none flex flex-1 items-center p-1 rounded-xl hover:shadow-2xl border-gray-400 {rowbg} mt-1"
	>
		<div class="w-1/8 text-wrap text-center flex flex-col justify-center items-center mr-2 p-2">
			<img
				src="https://www.orientsport.fr/oflash/img/{calendrier.lieu}.png"
				class=""
				alt={calendrier.lieu}
				style="display: inline"
				width="36px"
				height="36px"
			/>
		</div>
		<div class="w-3/4 font-medium text-gray-800">
			{soiree} : {calendrier.plage}
		</div>
		<div class="w-1/8 text-wrap text-left flex flex-col justify-center items-center mr-2 p-2">
			<button
				class="{buttonStatutBg} text-gray-600 font-bold py-2 px-4 rounded bg"
				on:click={ChangeStatus}>{calendrier.statut}</button
			>
		</div>
	</div>
</li>
