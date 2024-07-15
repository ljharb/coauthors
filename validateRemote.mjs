import { execSync } from 'child_process';

/** @type {(remote: string, cwd?: string) => string | { __proto__: null, error: string }} */
export default function validateRemote(remote, cwd = process.cwd()) {
	if (remote === '' || remote.includes(' ')) {
		return {
			__proto__: null,
			error: 'Remote name must not be empty, nor contain spaces.',
		};
	}

	const allRemotes = `${execSync('git remote', { cwd })}`.split('\n');

	if (!allRemotes.includes(remote)) {
		return {
			__proto__: null,
			error: `Remote \`${remote}\` does not exist; check \`git remote\` output`,
		};
	}

	return remote;
}
