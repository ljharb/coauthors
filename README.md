# @ljharb/coauthors <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

A cli to generate a complete git co-authors list, including existing co-authors, for use in a commit message.

## Usage

```sh
npx @ljharb/coauthors # if not installed

coauthors # if installed and in the PATH
```

```sh
$ coauthors --help
Usage:
co-authors <remote>

`remote` defaults to `origin`.
```

## Install

```
npm install --save-dev @ljharb/coauthors
```

## License

MIT

[package-url]: https://npmjs.org/package/@ljharb/coauthors
[npm-version-svg]: https://versionbadg.es/ljharb/coauthors.svg
[deps-svg]: https://david-dm.org/ljharb/coauthors.svg
[deps-url]: https://david-dm.org/ljharb/coauthors
[dev-deps-svg]: https://david-dm.org/ljharb/coauthors/dev-status.svg
[dev-deps-url]: https://david-dm.org/ljharb/coauthors#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/@ljharb/coauthors.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/@ljharb/coauthors.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/@ljharb/coauthors.svg
[downloads-url]: https://npm-stat.com/charts.html?package=@ljharb/coauthors
[codecov-image]: https://codecov.io/gh/ljharb/coauthors/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/ljharb/coauthors/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/ljharb/coauthors
[actions-url]: https://github.com/ljharb/coauthors/actions
