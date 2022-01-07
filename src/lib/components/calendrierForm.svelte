<script>
	export let calendrier;
	export let maraude;
	export let prepa;
	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	let soiree = '';
	let rowbg = '';
	let buttonStatutBg = '';
	let displayPrepa = 'flex';

	// mise au format français
	try {
		const soireeY = calendrier.soiree.substring(0, 4);
		const soireeM = calendrier.soiree.substring(4, 6);
		const soireeD = calendrier.soiree.substring(6, 8);

		soiree = new Date(soireeY + '-' + soireeM + '-' + soireeD).toLocaleDateString(
			'fr-FR',
			dateOptions
		);
	} catch (error) {
		console.log(error);
	}
	//initialisation de l'affichage
	if (calendrier.lieu === 'entrepot' && prepa !== 'Oui') {
		displayPrepa = 'none';
	}
	if (calendrier.statut === 'Oui') {
		buttonStatutBg = 'bg-green-400 hover:bg-green-600';
	} else if (calendrier.statut === 'Maraude') {
		buttonStatutBg = 'bg-amber-300 hover:bg-amber-600';
	} else {
		calendrier.statut = 'Non';
		buttonStatutBg = 'bg-red-200 hover:bg-red-400';
	}
	if (soiree.substring(0, 3) === 'lun') {
		rowbg = 'bg-gray-100';
	} else if (soiree.substring(0, 3) === 'mer') {
		rowbg = 'bg-gray-300';
	}
	if (calendrier.lieu === 'entrepot' && soiree.substring(0, 3) === 'lun') {
		rowbg = 'bg-blue-100';
	}
	if (calendrier.lieu === 'entrepot' && soiree.substring(0, 3) === 'mer') {
		rowbg = 'bg-blue-200';
	}

	function ChangeStatus() {
		if (maraude === 'Oui') {
			// cas spécifique des bénévoles faisant la maraude
			if (calendrier.statut === 'Non') {
				calendrier.statut = 'Oui';
				buttonStatutBg = 'bg-green-400 hover:bg-green-600';
			} else if (calendrier.statut === 'Oui') {
				calendrier.statut = 'Maraude';
				buttonStatutBg = 'bg-amber-300 hover:bg-amber-600';
			} else {
				calendrier.statut = 'Non';
				buttonStatutBg = 'bg-red-200 hover:bg-red-400';
			}
		} else {
			// cas standard
			if (calendrier.statut === 'Non') {
				calendrier.statut = 'Oui';
				buttonStatutBg = 'bg-green-400 hover:bg-green-600';
			} else {
				calendrier.statut = 'Non';
				buttonStatutBg = 'bg-red-200 hover:bg-red-400';
			}
		}
	}
</script>

<li class="flex flex-row" style="display:{displayPrepa}">
	<div
		class="select-none flex flex-1 items-center p-1 rounded-xl hover:shadow-2xl border-gray-400 {rowbg} mt-1"
	>
		<div class="w-2/12 text-wrap text-center flex flex-col justify-center items-center mr-2 p-2">
			<img
				src="/src/lib/images/{calendrier.lieu}.png"
				class=""
				alt=""
				style="display: inline"
				width="36px"
				height="36px"
			/>
		</div>
		<div class="w-8/12 font-medium text-gray-800">
			{soiree} : {calendrier.plage}
		</div>
		<div class="w-2/12 text-wrap text-left flex flex-col justify-center items-center mr-2 p-2">
			<button
				class="{buttonStatutBg} text-gray-600 font-bold py-2 px-4 rounded bg"
				on:click={ChangeStatus}>{calendrier.statut}</button
			>
		</div>
	</div>
</li>
