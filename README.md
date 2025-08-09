# Rison2

[![Node.js CI](https://github.com/kou64yama/rison2/workflows/Node.js%20CI/badge.svg?branch=main&event=push)](https://github.com/kou64yama/rison2/actions?query=workflow:%22Node.js+CI%22+branch:main+event:push)
[![codecov](https://codecov.io/gh/kou64yama/rison2/branch/main/graph/badge.svg?token=0JNGZN3XYR)](https://codecov.io/gh/kou64yama/rison2)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B21095%2Fgithub.com%2Fkou64yama%2Frison2.svg?type=shield)](https://app.fossa.com/projects/custom%2B21095%2Fgithub.com%2Fkou64yama%2Frison2?ref=badge_shield)

Rison2 is a parser/stringifier of
[Rison](https://github.com/Nanonid/rison).

> Rison is a slight variation of JSON that looks vastly superior after
> URI encoding. Rison still expresses exactly the same set of data
> structures as JSON, so data can be translated back and forth without
> loss or guesswork.

## Installation

```bash
$ npm install rison2
```

## Usage

Rison2 has a
[JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)-like
interface.

```js
import { RISON } from 'rison2'

console.info(RISON.stringify({ message: 'こんにちは，世界' }))
// '(message:こんにちは，世界)'

console.info(RISON.parse('(message:こんにちは，世界)'))
// { message: 'こんにちは，世界' }
```

If you need percent encoding, import `rison2/lib/escaped` instead of
`rison2`.

```js
import { RISON } from 'rison2/lib/escaped'

console.info(RISON.stringify({ kanji: '漢字' }))
// '(kanji:%E6%BC%A2%E5%AD%97)'

console.info(RISON.parse('(kanji:%E6%BC%A2%E5%AD%97)'))
// { kanji: '漢字' }
```

## Node.js Support Policy

Rison2 supports Node.js versions that are currently in [Active LTS or Maintenance LTS](https://nodejs.org/en/about/previous-releases). This ensures compatibility with stable and actively supported Node.js environments.

## Contributing

1. Fork it ( http://github.com/kou64yama/rison2/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request

## License

[MIT License](https://github.com/kou64yama/rison2/blob/main/LICENSE)

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B21095%2Fgithub.com%2Fkou64yama%2Frison2.svg?type=large)](https://app.fossa.com/projects/custom%2B21095%2Fgithub.com%2Fkou64yama%2Frison2?ref=badge_large)
