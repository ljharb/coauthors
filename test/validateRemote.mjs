import test from 'tape';
import esmock from 'esmock';

import validateRemote from '../validateRemote.mjs';

test('validateRemote', async (t) => {
	t.deepEqual(
		validateRemote(''),
		{ __proto__: null, error: 'Remote name must not be empty, nor contain spaces.' },
		'empty string',
	);

	t.deepEqual(
		validateRemote('foo bar'),
		{ __proto__: null, error: 'Remote name must not be empty, nor contain spaces.' },
		'has spaces',
	);

	const mockedValidateRemote = await esmock('../validateRemote.mjs', {
		child_process: { // eslint-disable-line camelcase
			/** @type {(cmd: string) => Buffer} */
			execSync(cmd) {
				t.equal(cmd, 'git remote', 'command is as expected');

				return Buffer.from('origin\nupstream\n');
			},
		},
	});

	t.deepEqual(
		mockedValidateRemote('foo'),
		{ __proto__: null, error: 'Remote `foo` does not exist; check `git remote` output' },
		'nonexistent remote does not exist',
	);

	t.equal(
		mockedValidateRemote('origin'),
		'origin',
		'existing remote origin exists',
	);

	t.equal(
		mockedValidateRemote('upstream'),
		'upstream',
		'existing remote upstream exists',
	);
});
