<script>
	export let retourSoirees;

	import { date_dd_MM_YYYY } from '$lib/date_functions';
</script>

<table id="RetourSoirees" class="text-sm text-gray-500">
	<thead>
		<tr>
			<th class="w-[15%]" />
			<th class="w-[10%]" />
			<th colspan="3" class="w-[10%]">
				<div class="flex items-center justify-center">
					<img
						src="https://www.orientsport.fr/oflash/img/entrepot.png"
						class=""
						alt="repas"
						style="display: inline"
						width="36px"
						height="36px"
					/>
				</div>
			</th>
			<th colspan="2" class="w-[10%]">
				<div class="flex items-center justify-center">
					<img
						src="https://www.orientsport.fr/oflash/img/present.png"
						class=""
						alt="present"
						style="display: inline"
						width="36px"
						height="36px"
					/>
				</div>
			</th>
			<th colspan="2" class="w-[10%]">
				<div class="flex items-center justify-center">
					<img
						src="https://www.orientsport.fr/oflash/img/absent.png"
						class=""
						alt="gare"
						style="display: inline"
						width="36px"
						height="36px"
					/>
				</div>
			</th>
			<th class="w-1/2" />
		</tr>
		<tr>
			<th class="text-left font-bold w-[15%]">Soirée</th>
			<th class="text-left font-bold w-[10%]">Responsable</th>
			<th class="w-[5%]">
				<div class="flex items-center justify-center">
					<img
						src="https://www.orientsport.fr/oflash/img/gare.png"
						class=""
						alt="gare"
						style="display: inline"
						width="36px"
						height="36px"
					/>
				</div>
			</th>
			<th class="w-[5%]">
				<div class="flex items-center justify-center">
					<img
						src="https://www.orientsport.fr/oflash/img/gp.png"
						class=""
						alt="gp"
						style="display: inline"
						width="36px"
						height="36px"
					/>
				</div>
			</th>
			<th class="w-[5%]">
				<div class="flex items-center justify-center">
					<img
						src="https://www.orientsport.fr/oflash/img/repas.png"
						class=""
						alt="total"
						style="display: inline"
						width="36px"
						height="36px"
					/>
				</div>
			</th>
			<th class="w-[5%]">
				<div class="flex items-center justify-center">
					<img
						src="https://www.orientsport.fr/oflash/img/gare.png"
						class=""
						alt="gare"
						style="display: inline"
						width="36px"
						height="36px"
					/>
				</div>
			</th>
			<th class="w-[5%]">
				<div class="flex items-center justify-center">
					<img
						src="https://www.orientsport.fr/oflash/img/gp.png"
						class=""
						alt="gp"
						style="display: inline"
						width="36px"
						height="36px"
					/>
				</div>
			</th>
			<th class="w-[5%]">
				<div class="flex items-center justify-center">
					<img
						src="https://www.orientsport.fr/oflash/img/gare.png"
						class=""
						alt="gare"
						style="display: inline"
						width="36px"
						height="36px"
					/>
				</div>
			</th>
			<th class="w-[5%]">
				<div class="flex items-center justify-center">
					<img
						src="https://www.orientsport.fr/oflash/img/gp.png"
						class=""
						alt="gp"
						style="display: inline"
						width="36px"
						height="36px"
					/>
				</div>
			</th>
			<th class="text-left font-bold">Commentaires</th>
		</tr>
	</thead>
	<tbody class="divide-y divide-gray-100">
		{#each retourSoirees as cell}
			<tr class="align-middle divide-y divide-gray-100 hover:bg-slate-100 text-center">
				<td class="text-left align-middle py-1 px-1">
					{date_dd_MM_YYYY(cell.soiree).date}
				</td>
				<td class="text-left align-middle py-1 px-1">
					{cell.rs.substring(0, cell.rs.indexOf(' ') + 2) + '.'}
				</td>
				<td class="align-middle py-1 px-1 w-[5%]">
					{cell.nbGare}
				</td>
				<td class="align-middle py-1 px-1 w-[5%]">
					{cell.nbPeri}
				</td>
				<td class=" align-middle py-1 px-1 font-bold w-[5%]">
					{Number(cell.nbGare) + Number(cell.nbPeri)}
				</td>
				<td class="align-middle py-1 px-1 w-[5%]">
					{cell.gare_present}
				</td>
				<td class="align-middle py-1 px-1 w-[5%]">
					{cell.gp_present}
				</td>
				<td class="align-middle py-1 px-1 w-[5%]">
					{cell.gare_absent}
				</td>
				<td class="align-middle py-1 px-1 w-[5%]">
					{cell.gp_absent}
				</td>
				<td class=" text-left align-middle py-1 px-1">
					{cell.commentaires}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
