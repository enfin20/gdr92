<script>
	export let dates;
	export let calendriers;
</script>

<!-- table pour les impressions -->
<div class="flex flex-col h-screen">
	<div class="flex-grow overflow-auto">
		<table id="tableCalendrier" class="text-sm text-gray-500 w-full relative">
			<thead>
				<tr>
					{#each dates as cell}
						<th class="sticky top-0 bg-white">{@html cell} </th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#each calendriers as row}
					<tr class="hover:bg-slate-100 text-center">
						{#each row as cell}
							{#if typeof cell._id != 'undefined'}
								<td
									class={cell.presence === 'Oui'
										? 'bg-green-400  text-gray-500 py-1 px-1 '
										: cell.presence === 'RS'
										? 'bg-pink-300  text-gray-500 py-1 px-1 '
										: cell.presence === 'Dispo'
										? 'bg-gray-200  text-gray-600 py-1 px-1 '
										: cell.presence === 'Maraude'
										? 'bg-yellow-400  text-gray-500 py-1 px-1 '
										: cell.presence === 'Vaisselle'
										? 'bg-blue-300  text-gray-500 py-1 px-1 '
										: cell.presence === 'Absent'
										? 'bg-red-500  text-gray-200 py-1 px-1 '
										: 'text-gray-500 py-1 px-1 '}
								>
									{cell.presence.substring(0, 3)}
								</td>
							{:else}
								<td class="text-gray-500 py-1 px-1 text-left">
									{cell.benevole}
								</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
