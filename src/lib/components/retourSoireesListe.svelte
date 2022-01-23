<script>
	export let retourSoirees;

	import { date_dd_MM_YYYY } from '$lib/date_functions';
</script>

<div class="table text-center text-sm ">
	<div class="table-header-group font-bold">
		<div class=" table-cell text-left w-2/12 align-middle py-1 px-1">Soirée</div>
		<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">Responsable</div>
		<div class=" table-cell w-1/12 align-middle py-1 px-1">
			<img
				src="https://www.orientsport.fr/oflash/img/gare.png"
				class=""
				alt="gare"
				style="display: inline"
				width="36px"
				height="36px"
			/>
		</div>
		<div class=" table-cell w-1/12 align-middle py-1 px-1">
			<img
				src="https://www.orientsport.fr/oflash/img/gp.png"
				class=""
				alt="Gabriel Péri"
				style="display: inline"
				width="36px"
				height="36px"
			/>
		</div>
		<div class=" table-cell w-1/12 align-middle py-1 px-1">
			<img
				src="https://www.orientsport.fr/oflash/img/entrepot.png"
				class=""
				alt="Total"
				style="display: inline"
				width="36px"
				height="36px"
			/>
		</div>
		<div class=" table-cell w-6/12  text-left align-middle py-1 px-1">Commentaires</div>
	</div>
	{#each retourSoirees as cell}
		<div class="table-row-group align-middle">
			<div class=" table-cell text-left w-2/12 align-middle py-1 px-1">
				{date_dd_MM_YYYY(cell.soiree).date}
			</div>
			<div class=" table-cell text-left w-1/12 align-middle py-1 px-1">
				{cell.rs.substring(0, cell.rs.indexOf(' ') + 2) + '.'}
			</div>
			<div class=" table-cell w-1/12 align-middle py-1 px-1">
				{cell.nbGare}
			</div>
			<div class=" table-cell w-1/12 align-middle py-1 px-1">
				{cell.nbPeri}
			</div>
			<div class=" table-cell w-1/12 align-middle py-1 px-1 font-bold">
				{Number(cell.nbGare) + Number(cell.nbPeri)}
			</div>
			<div class=" table-cell w-6/12  text-left align-middle py-1 px-1">
				{cell.commentaires}
			</div>
		</div>
	{/each}
</div>
