import { MM_YYYY, date_YYYYMM, date_DD_MM } from '$lib/date_functions';

export function calendriers_formatte(tableau) {
	// suppression de l'entête
	return {
		calendriers: tableau.slice(1)
	};
}

export function lieux_formatte(tableau) {
	var l = [];
	for (var i = tableau[0].length; i > 0; i--) {
		l[i] =
			'<img src="https://www.orientsport.fr/oflash/img/' +
			tableau[0][i - 1].substring(11) +
			'.png" alt ="' +
			tableau[0][i - 1].substring(11) +
			'" width="32px" height="32px"/>';
	}
	l[0] = '';
	return {
		lieux: l
	};
}

export function soirees_formatte(tableau) {
	var s = [];
	for (var i = tableau[0].length; i > 0; i--) {
		tableau[0][i] = date_DD_MM(tableau[0][i - 1]).date;
	}
	tableau[0][0] = 'Calendrier ';
	s = tableau[0];

	return {
		soirees: s
	};
}
