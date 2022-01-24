<script context="module">
</script>

<script>
	import { date_DD_MM, date_mm_YYYY } from '$lib/date_functions';
	import { respond } from '@sveltejs/kit/ssr';
	import {
		claim_element,
		clear_loops,
		each,
		text,
		time_ranges_to_array,
		to_number
	} from 'svelte/internal';

	import CalendrierTableau from '/src/lib/components/calendrierDisplay.svelte';
	// pour récupérer dans l'addresse le champ 'mois'
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const mois = urlParams.get('mois');

	let calendriers = [];
	let soirees = [];
	let lieux = [];
	getCalendrier();

	export async function getCalendrier() {
		// mise en forme du calendrier
		const res = await fetch('./calendrierBenevoles?soiree=' + mois);
		const cal = await res.json();

		// remise au format des dates et des entêtes DD/MM
		for (var i = cal.tableau[0].length; i > 0; i--) {
			cal.tableau[0][i] = date_DD_MM(cal.tableau[0][i - 1]).date;
			lieux[i] =
				'<img src="https://www.orientsport.fr/oflash/img/' +
				cal.tableau[0][i - 1].substring(11) +
				'.png" alt ="' +
				cal.tableau[0][i - 1].substring(11) +
				'" width="32px" height="32px"/>';
		}
		lieux[0] = '';
		cal.tableau[0][0] = 'Calendrier ';
		soirees = await cal.tableau[0];
		// suppression de l'entête
		calendriers = await cal.tableau.slice(1);
	}
</script>

<svelte:head>
	<title>Planning restos Colombes</title>
</svelte:head>
<div class="flex py-2 w-full md:w-1/2">
	<a href="/">
		<div class="mr-3 inline-block bg-pink-200 hover:bg-pink-300 rounded py-1 px-3  text-gray-600">
			Retour accueil
		</div>
	</a>
</div>
<div class="flex py-2 w-full">
	<h1 class="text-2xl my-8 font-bold text-gray-800 md:text-3xl">
		Planning de {date_mm_YYYY(mois).date}
	</h1>
</div>
<div class="flex py-2 w-full">
	<CalendrierTableau {soirees} {lieux} {calendriers} />
</div>
