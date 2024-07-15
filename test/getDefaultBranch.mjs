import test from 'tape';
import esmock from 'esmock';

/** @type {Record<string, string>} */
const fakeRemotes = {
	// @ts-expect-error TS can't handle null objects
	__proto__: null,
	origin: 'mainiac',
	upstream: 'def',
};

test('getDefaultBranch', async (t) => {
	const { default: getDefaultBranch } = await esmock(
		'../getDefaultBranch.mjs',
		{
			child_process: { // eslint-disable-line camelcase
				/** @type {(cmd: string) => Buffer} */
				execSync(cmd) {
					t.match(cmd, /^git rev-parse --abbrev-ref [^ ]+\/HEAD$/, 'command is as expected');

					const remote = cmd.slice('git rev-parse --abbrev-ref '.length, -'/HEAD'.length);

					if (!(remote in fakeRemotes)) {
						// eslint-disable-next-line no-throw-literal
						throw `Uncaught Error: Command failed: git rev-parse --abbrev-ref ${remote}/HEAD
fatal: ambiguous argument '${remote}/HEAD': unknown revision or path not in the working tree.`;
					}

					return Buffer.from(`${remote}/${fakeRemotes[remote]}\n`);
				},
			},
		},
	);

	t.equal(getDefaultBranch('origin'), 'mainiac', 'mocked remote `origin` exists');
	t.equal(getDefaultBranch('upstream'), 'def', 'mocked remote `upstream` exists');

	t.throws(
		() => getDefaultBranch('nonexistent'),
		/Uncaught Error: Command failed: git rev-parse --abbrev-ref nonexistent\/HEAD/,
		'nonexistent remote throws',
	);
});
