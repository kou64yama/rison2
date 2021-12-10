// @ts-check

import { RISON } from 'rison2';

console.info(RISON.stringify({ message: 'こんにちは，世界' }));
// '(message:こんにちは，世界)'

console.info(RISON.parse('(message:こんにちは，世界)'));
// { message: 'こんにちは，世界' }
