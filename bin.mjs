#! /usr/bin/env node

import validateRemote from './validateRemote.mjs';
import getResults from './results.mjs';

import pargs from 'pargs';

const {
	help,
	positionals,
	errors,
} = await pargs(import.meta.filename, {
	allowPositionals: 1,
	positionals: [{ description: 'the git remote to read co-authors from (default: origin)', name: 'remote' }],
});

const remote = validateRemote(positionals[0] ?? 'origin');

if (typeof remote !== 'string') {
	errors[errors.length] = `${remote}`;
}

await help();

const results = Array.from(getResults(`${remote}`), (x) => `Co-authored-by: ${x}`);

console.log(results.join('\n'));
