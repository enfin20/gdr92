<script>
	export let retourSoirees;

	import { date_dd_MM_YYYY } from '$lib/date_functions';
</script>

<div class="flex flex-col h-screen">
	<div class="flex-grow overflow-auto">
		<table id="RetourSoirees" class="text-sm text-gray-500 w-full md:w-1/2 relative">
			<thead>
				<tr>
					<th class="w-[15%] sticky top-0 bg-white" />
					<th class="w-[10%] sticky top-0 bg-white" />
					<th colspan="3" class="w-[15%] sticky top-0 bg-white">
						<div class="flex items-center justify-center">
							<img
								src="https://www.orientsport.fr/oflash/img/entrepot.png"
								class="h-8 w-8 object-contain"
								alt="repas"
								style="display: inline"
							/>
						</div>
					</th>
					<th colspan="2" class="w-[10%] sticky top-0 bg-white">
						<div class="flex items-center justify-center">
							<img
								src="https://www.orientsport.fr/oflash/img/present.png"
								class="h-8 w-8 object-contain"
								alt="present"
								style="display: inline"
							/>
						</div>
					</th>
					<th colspan="2" class="w-[10%] sticky top-0 bg-white">
						<div class="flex items-center justify-center">
							<img
								src="https://www.orientsport.fr/oflash/img/absent.png"
								class="h-8 w-8 object-contain"
								alt="gare"
								style="display: inline"
							/>
						</div>
					</th>
				</tr>
				<tr>
					<th class="text-left font-bold w-[15%] sticky top-0 bg-white">Soirée</th>
					<th class="text-left font-bold w-[10%] sticky top-0 bg-white">Responsable</th>
					<th class="w-[5%] sticky top-0 bg-white">
						<div class="flex items-center justify-center">
							<img
								src="https://www.orientsport.fr/oflash/img/gare.png"
								class="h-8 w-8 object-contain"
								alt="gare"
								style="display: inline"
							/>
						</div>
					</th>
					<th class="w-[5%] sticky top-0 bg-white">
						<div class="flex items-center justify-center">
							<img
								src="https://www.orientsport.fr/oflash/img/gp.png"
								class="h-8 w-8 object-contain"
								alt="gp"
								style="display: inline"
							/>
						</div>
					</th>
					<th class="w-[5%] sticky top-0 bg-white">
						<div class="flex items-center justify-center">
							<img
								src="https://www.orientsport.fr/oflash/img/repas.png"
								class="h-8 w-8 object-contain"
								alt="total"
								style="display: inline"
							/>
						</div>
					</th>
					<th class="w-[5%] sticky top-0 bg-white">
						<div class="flex items-center justify-center">
							<img
								src="https://www.orientsport.fr/oflash/img/gare.png"
								class="h-8 w-8 object-contain"
								alt="gare"
								style="display: inline"
							/>
						</div>
					</th>
					<th class="w-[5%] sticky top-0 bg-white">
						<div class="flex items-center justify-center">
							<img
								src="https://www.orientsport.fr/oflash/img/gp.png"
								class="h-8 w-8 object-contain"
								alt="gp"
								style="display: inline"
							/>
						</div>
					</th>
					<th class="w-[5%] sticky top-0 bg-white">
						<div class="flex items-center justify-center">
							<img
								src="https://www.orientsport.fr/oflash/img/gare.png"
								class="h-8 w-8 object-contain"
								alt="gare"
								style="display: inline"
							/>
						</div>
					</th>
					<th class="w-[5%] sticky top-0 bg-white">
						<div class="flex items-center justify-center">
							<img
								src="https://www.orientsport.fr/oflash/img/gp.png"
								class="h-8 w-8 object-contain"
								alt="gp"
								style="display: inline"
							/>
						</div>
					</th>
				</tr>
			</thead>
			<tbody class="">
				{#each retourSoirees as cell}
					<tr class="align-middle text-center border-collapse border-t-[1px] border-slate-200">
						<td rowspan="2" class="text-left align-middle py-1 px-1 w-[15%]">
							{date_dd_MM_YYYY(cell.soiree).date}
						</td>
						<td class="text-left align-middle py-1 px-1 w-[10%] font-bold">
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
					</tr>
					<tr class="">
						<td colspan="9" class="text-gray-700 text-left align-middle py-1 px-1 w-full">
							{cell.commentaires}
						</td></tr
					>
				{/each}
			</tbody>
		</table>
	</div>
</div>
