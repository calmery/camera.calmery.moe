<div align="center">
  <img src="https://user-images.githubusercontent.com/12670155/75626669-b5579400-5c0c-11ea-87c9-d03f2083a06e.jpg" height="128"/>
</div>

# camera.calmery.moe: Calmery-chan camera :camera:

![Uchinoko Kawaii](https://img.shields.io/badge/%E3%81%86%E3%81%A1%E3%81%AE%E5%AD%90-%E3%81%8B%E3%82%8F%E3%81%84%E3%81%84-FF91BE)
[![GitHub Actions](https://github.com/calmery-chan/camera.calmery.moe/workflows/GitHub%20Actions/badge.svg)](https://github.com/calmery-chan/calmery.moe/actions)
[![WakaTime](https://wakatime.com/badge/github/calmery-chan/camera.calmery.moe.svg)](https://wakatime.com/badge/github/calmery-chan/camera.calmery.moe)

[master](https://camera.calmery.moe) / [develop](https://develop.camera.calmery.moe)

## Usage

Install Node.js v12.18.0 and npm 6.14.5.

### Commands

```bash
$ npm ci
```

```bash
$ npm run build
$ npm run lint
$ npm run storybook
$ npm start
$ npm test
```

### Docker (Deprecated)

If you are using Docker, please execute the following command:

```bash
$ docker-compose run --rm next npm ci
$ docker-compose up
```

```bash
$ docker-compose run --rm next npm run lint
$ git commit --no-verify
```

## Design

See [Figma](<https://www.figma.com/file/Hb64KyJ84kwCrxPo9e42AX/Calmery-chan-Camera-(Public)>).

![Design](https://user-images.githubusercontent.com/12670155/75629651-070d1800-5c27-11ea-931c-ecfdb8cc919f.jpg)

## Notes

### Alias Paths

[Resolve | webpack](https://webpack.js.org/configuration/resolve/#resolvealias)

| Alias Path | Original Path |  Example  |
| :--------: | :-----------: | :-------: |
|     ~/     |     src/      | `~/pages` |

## Contributors

Thanks a lot ! Illustration by [@metanen0x0](https://twitter.com/metanen0x0) and logo design by [@sorano_design](https://twitter.com/sorano_design).
