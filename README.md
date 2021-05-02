<div align="center">
  <img src="https://user-images.githubusercontent.com/12670155/75626669-b5579400-5c0c-11ea-87c9-d03f2083a06e.jpg" height="128"/>
</div>

# camera.calmery.moe: Calmery-Chan Camera :camera_flash:

![Calmery-Chan](https://user-images.githubusercontent.com/12670155/83776573-4da95d00-a6c3-11ea-98c0-7c2633e72c24.jpg)

![Uchinoko Kawaii](https://img.shields.io/badge/%E3%81%86%E3%81%A1%E3%81%AE%E5%AD%90-%E3%81%8B%E3%82%8F%E3%81%84%E3%81%84-FF91BE)
[![Build, Lint And Test](https://github.com/calmery-chan/camera.calmery.moe/actions/workflows/build-lint-and-test.yml/badge.svg)](https://github.com/calmery-chan/camera.calmery.moe/actions/workflows/build-lint-and-test.yml)
[![WakaTime](https://wakatime.com/badge/github/calmery-chan/camera.calmery.moe.svg)](https://wakatime.com/badge/github/calmery-chan/camera.calmery.moe)

## Usage

```
$ brew install puma/puma/puma-dev
$ sudo puma-dev -setup
$ puma-dev -install
$ echo 3000 > ~/.puma-dev/calmery
```

Install Node.js v14.16.1 and npm 6.14.12.

```bash
$ npm ci
```

```bash
$ npm run build
$ npm run fix
$ npm run lint
$ npm run watch
```

## Notes

### Alias Paths

[Resolve | webpack](https://webpack.js.org/configuration/resolve/#resolvealias)

| Alias Path | Original Path |  Example  |
| :--------: | :-----------: | :-------: |
|     ~/     |     src/      | `~/pages` |
