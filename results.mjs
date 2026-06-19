import { execSync } from 'child_process';

import { commitToCoAuthors } from 'commit-to-co-authors';

import getDefaultBranch from './getDefaultBranch.mjs';

/** @param {string} remote */
export default function getResults(remote) {
	const defaultBranch = getDefaultBranch(remote);

	const logCommitters = `${execSync(`git shortlog -sne ${remote}/${defaultBranch}..HEAD`)}`;
	const mappedLogCommitters = logCommitters.matchAll(/\t(?<author>.*)$/gm)
		// @ts-expect-error TODO: file TS bug about `groups` always being present when a group is in the regex
		.map((x) => x.groups.author);

	const fromLogs = new Set(mappedLogCommitters);

	const logText = `${execSync(`git log --no-expand-tabs --pretty=full ${remote}/${defaultBranch}..HEAD`)}`;
	const fromMsgs = new Set(commitToCoAuthors(logText).map(({ name, email }) => `${name} <${email}>`));

	return fromMsgs.union(fromLogs);
}
