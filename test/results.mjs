import test from 'tape';
import esmock from 'esmock';

test('getResults', async (t) => {
	const logText = '';

	const { default: getResults } = await esmock('../results.mjs', {
		'../getDefaultBranch.mjs': {
			/** @type {(remote: string) => string} */
			default(remote) {
				if (remote !== 'destination') {
					// eslint-disable-next-line no-throw-literal
					throw `Uncaught Error: Command failed: git rev-parse --abbrev-ref ${remote}/HEAD
                    fatal: ambiguous argument '${remote}/HEAD': unknown revision or path not in the working tree.`;
				}
				return 'mainiac';
			},
		},
		'commit-to-co-authors': {
			/** @type {(commit: string) => ReturnType<import('commit-to-co-authors')['commitToCoAuthors']>} */
			commitToCoAuthors(commit) {
				t.equal(commit, logText, 'git log text is sent to commit-to-co-authors as expected');

				return [
					{
						name: 'foo',
						email: 'foo@example.com',
					},
					{
						name: 'bar',
						email: 'bar@example.com',
					},
					{
						name: 'baz',
						email: 'baz@example.com',
					},
				];
			},
		},
		child_process: { // eslint-disable-line camelcase
			/** @type {(cmd: string) => Buffer} */
			execSync(cmd) {
				t.match(cmd, /^git (?:shortlog|log) .*mainiac\.\.HEAD$/, `command is as expected (${cmd})`);

				if (cmd.startsWith('git log ')) {
					return Buffer.from(logText);
				}
				return Buffer.from(`
    11	quux <quux@example.com>
     3	baz <baz@example.com>
`);
			},
		},
	});

	t.throws(
		() => getResults('nonexistent'),
		'nonexistent remote throws',
	);

	t.deepEqual(
		getResults('destination'),
		new Set([
			'foo <foo@example.com>',
			'bar <bar@example.com>',
			'baz <baz@example.com>',
			'quux <quux@example.com>',
		]),
	);
});
