// @ts-check

import { RISON } from 'rison2/lib/escaped';

console.info(RISON.stringify({ kanji: '漢字' }));
// '(kanji:%E6%BC%A2%E5%AD%97)'

console.info(RISON.parse('(kanji:%E6%BC%A2%E5%AD%97)'));
// { kanji: '漢字' }
