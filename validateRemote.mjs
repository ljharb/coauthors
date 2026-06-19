import { execSync } from 'child_process';

/** @type {(remote: string, cwd?: string) => string | { toString(): string }} */
export default function validateRemote(remote, cwd = process.cwd()) {
	if (remote === '' || remote.includes(' ')) {
		return /** @type {{ toString(): string }} */ ({
			__proto__: null,
			toString() { return 'Remote name must not be empty, nor contain spaces.'; },
		});
	}

	const allRemotes = `${execSync('git remote', { cwd })}`.split('\n');

	if (!allRemotes.includes(remote)) {
		return /** @type {{ toString(): string }} */ ({
			__proto__: null,
			toString() { return `Remote \`${remote}\` does not exist; check \`git remote\` output`; },
		});
	}

	return remote;
}
