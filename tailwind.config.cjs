module.exports = {
	mode: 'jit',
	content: ['./src/**/*.svelte' /* ... */],
	variants: {
		extend: {
			visibility: ['group-hover']
		}
	},
	plugins: [require('@tailwindcss/forms')]
};
