<script>
	export let benevole;
	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	let soiree = '';
	let rowbg = '';
	let buttonStatutBg = '';
	let displayPrepa = 'flex';
	console.log('Display ' + calendrier);
	// mise au format français

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

<li class="flex flex-row">
	<div
		class="select-none flex flex-1 items-center p-1 rounded-xl hover:shadow-2xl border-gray-400 mt-1"
	>
		<div class="flex-1 pl-1 mr-16 ">
			<div class="font-medium text-gray-800">
				c'est bon {benevole}
			</div>
		</div>
		<div class="w-1/6 text-wrap text-center flex flex-col justify-center items-center mr-2 p-2">
			<div class="font-medium text-gray-800" />
		</div>
		<div class="w-1/6 text-wrap text-center flex flex-col justify-center items-center mr-2 p-2">
			<div class="font-medium text-gray-800" />
		</div>
		<div class="w-1/6 text-wrap text-center flex flex-col justify-center items-center mr-2 p-2">
			<div class="font-medium text-gray-800" />
		</div>
	</div>
</li>
