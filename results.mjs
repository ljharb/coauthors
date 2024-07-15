import { execSync } from 'child_process';

import { commitToCoAuthors } from 'commit-to-co-authors';

import getDefaultBranch from './getDefaultBranch.mjs';

/** @type {(remote: string) => Set<string>} */
export default function getResults(remote) {
	const defaultBranch = getDefaultBranch(remote);

	const logCommitters = `${execSync(`git shortlog -sne ${remote}/${defaultBranch}..HEAD`)}`;
	const mappedLogCommitters = logCommitters.matchAll(/\t(?<author>.*)$/gm)
	// @ts-expect-error waiting on https://github.com/microsoft/TypeScript/pull/58222
		.map(/** @type {(m: { groups: { author: string } }) => string} */ ({ groups: { author } }) => author);
	/** @type {Set<string>} */
	const fromLogs = new Set(mappedLogCommitters);

	const logText = `${execSync(`git log --no-expand-tabs --pretty=full ${remote}/${defaultBranch}..HEAD`)}`;
	/** @type {Set<string>} */
	const fromMsgs = new Set(commitToCoAuthors(logText).map(({ name, email }) => `${name} <${email}>`));

	return fromMsgs.union(fromLogs);
}
