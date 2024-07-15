import { parseArgs } from 'util';
import { realpathSync } from 'fs';

/** @typedef {import('util').ParseArgsConfig} ParseArgsConfig */

/** @typedef {(Error | TypeError) & { code: 'ERR_PARSE_ARGS_UNKNOWN_OPTION' | 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE' | 'ERR_INVALID_ARG_TYPE' | 'ERR_INVALID_ARG_VALUE' | 'ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL'}} ParseArgsError */

/** @type {(e: unknown) => e is ParseArgsError} */
function isParseArgsError(e) {
	return !!e
		&& typeof e === 'object'
		&& 'code' in e
		&& (
			e.code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION'
			|| e.code === 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE'
			|| e.code === 'ERR_INVALID_ARG_TYPE'
			|| e.code === 'ERR_INVALID_ARG_VALUE'
			|| e.code === 'ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL'
		);
}
/** @typedef {Omit<ParseArgsConfig, 'args' | 'strict' | 'allowPositionals'> & { allowPositionals?: boolean | number }} PargsConfig */

/** @type {(entrypointPath: ImportMeta['filename'], obj: PargsConfig) => Promise<{ errors: string[] } & ReturnType<typeof parseArgs>>} */
export default async function pargs(entrypointPath, obj) {
	const argv = process.argv.flatMap((arg) => {
		try {
			const realpathedArg = realpathSync(arg);
			if (
				realpathedArg === process.execPath
				|| realpathedArg === entrypointPath
			) {
				return [];
			}
		} catch (e) { /**/ }
		return arg;
	});

	if ('help' in obj) {
		throw new TypeError('The "help" option is reserved');
	}

	/** @type {ParseArgsConfig & { tokens: true }} */
	const newObj = {
		args: argv,
		...obj,
		options: {
			...obj.options,
			help: {
				default: false,
				type: 'boolean',
			},
		},
		tokens: true,
		// @ts-expect-error blocked on @types/node v22
		allowNegative: true,
		allowPositionals: typeof obj.allowPositionals !== 'undefined',
		strict: true,
	};

	const errors = [];

	try {
		const { tokens, ...results } = parseArgs(newObj);

		const posCount = typeof obj.allowPositionals === 'number' ? obj.allowPositionals : obj.allowPositionals ? Infinity : 0;
		if (results.positionals.length > posCount) {
			errors.push(`Only ${posCount} positional arguments allowed; got ${results.positionals.length}`);
		}

		/** @typedef {Extract<typeof tokens[number], { kind: 'option' }>} OptionToken */
		const optionTokens = tokens.filter(/** @type {(token: typeof tokens[number]) => token is OptionToken} */ (token) => token.kind === 'option');

		const bools = obj.options ? Object.entries(obj.options).filter(([, { type }]) => type === 'boolean') : [];
		const boolMap = new Map(bools);
		for (let i = 0; i < optionTokens.length; i += 1) {
			const { name, value } = optionTokens[i];
			if (boolMap.has(name) && typeof value !== 'boolean' && typeof value !== 'undefined') {
				errors.push(`Error: Argument --${name} must be a boolean`);
			}
		}

		const passedArgs = new Set(optionTokens.map(({ name, rawName }) => (rawName === '--no-help' ? rawName : name)));

		const groups = Object.groupBy(passedArgs, (x) => x.replace(/^no-/, ''));
		for (let i = 0; i < bools.length; i++) {
			const [key] = bools[i];
			if ((groups[key]?.length ?? 0) > 1) {
				errors.push(`Error: Arguments \`--${key}\` and \`--no-${key}\` are mutually exclusive`);
			}
			if (passedArgs.has(`no-${key}`)) {
				// @ts-expect-error
				results.values[key] = !results.values[`no-${key}`];
			}
			// @ts-expect-error
			delete results.values[`no-${key}`];
		}

		const knownOptions = obj.options ? Object.keys(obj.options) : [];
		const unknownArgs = knownOptions.length > 0 ? passedArgs.difference(new Set(knownOptions)) : passedArgs;
		if (unknownArgs.size > 0) {
			errors.push(`Error: Unknown option(s): ${Array.from(unknownArgs, (x) => `\`${x}\``).join(', ')}`);
		}

		return {
			errors,
			...results,
			...obj.tokens && { tokens },
		};
	} catch (e) {
		if (isParseArgsError(e)) {
			return {
				values: {},
				positionals: [],
				errors: [`Error: ${e.message}`],
			};
		}
		throw e;
	}
}
