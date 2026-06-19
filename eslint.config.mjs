import ljharb from '@ljharb/eslint-config/flat/node/20';

export default [
	...ljharb,
	{
		rules: {
			complexity: 'off',
			'max-lines-per-function': 'off',
			'max-statements': 'off',
			'no-extra-parens': 'off',
			'no-magic-numbers': 'off',
			'sort-keys': 'off',
		},
	},
];
