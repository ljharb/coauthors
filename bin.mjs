#! /usr/bin/env node

import validateRemote from './validateRemote.mjs';
import getResults from './results.mjs';

import pargs from 'pargs';

const {
	help,
	positionals,
	errors,
} = await pargs(import.meta.filename, { allowPositionals: 1 });

const remote = validateRemote(positionals[0] ?? 'origin');

if (typeof remote !== 'string') {
	errors.push(remote.error);
}

await help();

// eslint-disable-next-line no-extra-parens
const results = Array.from(getResults(/** @type {string} */ (remote)), (x) => `Co-authored-by: ${x}`);

console.log(results.join('\n'));
