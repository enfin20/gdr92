const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export function YYYYMMDD(shift = 0) {
	// shift : 1 --> année suivante, -1 --> année précédente
	let lastYear = new Date().getFullYear() + shift;
	const currentMonth = new Date().getMonth() + 1;
	const currentDay = new Date().getDate();
	let normedMonth = '0';
	if (currentMonth <= 9) {
		normedMonth = normedMonth.concat(currentMonth);
	}

	return {
		date: lastYear.toString().concat(normedMonth).concat(currentDay)
	};
}

export function YYYYMM(shift = 0) {
	// shift : 1 --> mois suivant
	let currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1 + shift;
	let normedMonth = '0';
	if (currentMonth <= 9) {
		normedMonth = normedMonth.concat(currentMonth);
	}
	// cas du mois de décembre
	if (currentMonth > 12) {
		normedMonth = '01';
		currentYear = currentYear + 1;
	}

	return {
		date: currentYear.toString().concat(normedMonth)
	};
}

export function MM(date) {
	// date = indice

	const mois = [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre'
	];

	return {
		mois: mois[date]
	};
}

export function MM_YYYY(shift = 0) {
	// shift : 1 --> mois suivant
	let currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1 + shift;
	let normedMonth = '0';
	if (currentMonth <= 9) {
		normedMonth = normedMonth.concat(currentMonth);
	}
	// cas du mois de décembre
	if (currentMonth > 12) {
		normedMonth = '01';
		currentYear = currentYear + 1;
	}

	return {
		date: normedMonth + '/' + currentYear.toString()
	};
}

export function YYYY_MM_DD(shift = 0) {
	// shift : 1 --> mois suivant
	let currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1 + shift;
	const currentDay = new Date().getDate();
	let normedMonth = '0';
	if (currentMonth <= 9) {
		normedMonth = normedMonth.concat(currentMonth);
	}
	// cas du mois de décembre
	if (currentMonth > 12) {
		normedMonth = '01';
		currentYear = currentYear + 1;
	}

	return {
		date: currentYear.toString().concat('-').concat(normedMonth).concat('-').concat(currentDay)
	};
}

export function date_YYYYMM(date) {
	// MM/YYYY --> YYYYMM
	const soireeY = date.substring(3, 8);
	const soireeM = date.substring(0, 2);
	return {
		date: soireeY.concat(soireeM)
	};
}

export function date_DD_MM(date) {
	// YYYYMMDD --> DD/MM
	const soireeM = date.substring(4, 6);
	const soireeD = date.substring(6, 8);
	return {
		date: soireeD.concat('/').concat(soireeM)
	};
}

export function date_MM_YYYY(date) {
	// YYYYMMDD --> MM/YYYY
	const soireeY = date.substring(0, 4);
	const soireeM = date.substring(4, 6);

	return {
		date: soireeM.concat('/').concat(soireeY)
	};
}

export function date_dd_MM_YYYY(date) {
	// YYYYMMDD --> format français
	return {
		date: new Date(
			date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
		).toLocaleDateString('fr-FR', dateOptions)
	};
}
export function date_mm_YYYY(date) {
	// YYYYMM --> MM YYYY, décalage de - 1 dans le tableau
	const mois = MM(Number(date.substring(4, 6)) - 1).mois;
	return {
		date: mois + ' ' + date.substring(0, 4)
	};
}

export function date_YYYYMMDD(date) {
	// DD/MM/YYYY --> YYYYMMDD
	const soireeY = date.substring(0, 4);
	const soireeM = date.substring(5, 7);
	const soireeD = date.substring(8, 10);

	return {
		date: soireeY.concat(soireeM).concat(soireeD)
	};
}
