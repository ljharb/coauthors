#! /usr/bin/env node

import { readFile } from 'fs/promises';
import path from 'path';

import validateRemote from './validateRemote.mjs';
import getResults from './results.mjs';

import pargs from './pargs.mjs';

async function getHelpText() {
	return `${await readFile(path.join(import.meta.dirname, './help.txt'), 'utf-8')}`;
}

const {
	values: { help },
	positionals,
	errors,
} = await pargs(
	import.meta.filename,
	{
		options: {
			help: { type: 'boolean' },
		},
		allowPositionals: 1,
	},
);

const remote = validateRemote(positionals[0] ?? 'origin');

if (typeof remote !== 'string') {
	errors.push(remote.error);
}

if (help || errors.length > 0) {
	const helpText = await getHelpText();
	if (errors.length === 0) {
		console.log(helpText);
	} else {
		console.error(`${helpText}${errors.length === 0 ? '' : '\n'}`);

		process.exitCode ||= parseInt('1'.repeat(errors.length), 2);
		errors.forEach((error) => console.error(error));
	}

	process.exit();
}

// eslint-disable-next-line no-extra-parens
const results = Array.from(getResults(/** @type {string} */ (remote)), (x) => `Co-authored-by: ${x}`);

console.log(results.join('\n'));
