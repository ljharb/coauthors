import test from 'tape';
import esmock from 'esmock';

import validateRemote from '../validateRemote.mjs';

test('validateRemote', async (t) => {
	const empty = validateRemote('foo bar');
	t.notEqual(typeof empty, 'string', 'is not a string');
	t.equal(Object.getPrototypeOf(empty), null, 'null proto');
	t.equal(
		`${empty}`,
		'Remote name must not be empty, nor contain spaces.',
		'stringifies to expected error',
	);

	const result = validateRemote('');
	t.notEqual(typeof result, 'string', 'is not a string');
	t.equal(Object.getPrototypeOf(result), null, 'null proto');
	t.equal(
		`${result}`,
		'Remote name must not be empty, nor contain spaces.',
		'stringifies to expected error',
	);

	/** @type {(x: string) => (string | { toString(): string })} */
	const mockedValidateRemote = await esmock('../validateRemote.mjs', {
		child_process: { // eslint-disable-line camelcase
			/** @type {(cmd: string) => Buffer} */
			execSync(cmd) {
				t.equal(cmd, 'git remote', 'command is as expected');

				return Buffer.from('origin\nupstream\n');
			},
		},
	});

	const nope = mockedValidateRemote('foo');
	t.notEqual(typeof nope, 'string', 'is not a string');
	t.equal(Object.getPrototypeOf(nope), null, 'null proto');
	t.equal(
		`${nope}`,
		'Remote `foo` does not exist; check `git remote` output',
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
