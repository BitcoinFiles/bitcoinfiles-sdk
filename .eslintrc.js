module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true
	},
	plugins: ['react', 'react-hooks', 'class-property'],
	extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2018
	},
	settings: {
		react: {
			version: 'detect'
		}
	},
	rules: {
		'linebreak-style': ['error', 'unix'],
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'react/prop-types': 0,
		'react/display-name': 0,
		'react/react-in-jsx-scope': 0,
		'react/jsx-no-target-blank': 0,
		'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
		'no-useless-escape': 0,
		'require-atomic-updates': 0
	}
};
