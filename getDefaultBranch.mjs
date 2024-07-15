import { execSync } from 'child_process';

/** @type {(remote: string) => string} */
export default function getDefaultBranch(remote) {
	const gitResult = `${execSync(`git rev-parse --abbrev-ref ${remote}/HEAD`)}`.trim();

	const match = (/\/(?<defaultBranch>\S+)$/).exec(gitResult);

	return match?.groups?.defaultBranch ?? 'main';
}
