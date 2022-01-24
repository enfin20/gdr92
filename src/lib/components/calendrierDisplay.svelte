<script>
	export let dates;
	export let lieux;
	export let calendriers;
</script>

<!-- table pour les impressions -->
<table id="tableCalendrier" class="text-sm text-gray-500">
	<thead>
		<tr>
			{#each dates as cell}
				<th>{cell}</th>
			{/each}
		</tr>
		<tr class="">
			{#each lieux as cell}
				<th> <div class="flex items-center justify-center">{@html cell}</div></th>
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
