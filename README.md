# text-encoding-compress
compress encoding-indexes.js, The size is reduced from 518K to 155k

The [inexorabletash](https://github.com/inexorabletash)/**[text-encoding](https://github.com/inexorabletash/text-encoding)** Size is Big, Compression encoding- indexes.js , re encode, and use Pako to compress binary, and finally export Base64.

new_pack :  new lib 新包目录
ziplib : compress algorithm 压缩算法

Use:

```js
const { EncodingIndexes } = require('../../text-encoding/EncodingIndexes');
EncodingIndexes.init(textEncoding.EncodingIndexes)
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();
/**
 * 转换 字符串 为 Uint8Array
 * @param {string} str
 * @return {Uint8Array}
 */
function stringToBytes(str) {
    return textEncoder.encode(str);
}

/**
 * 转换 Array 或 ArrayBuffer 或 Uint8Array 为字符串
 * @param {Array|Uint8Array|ArrayBuffer} arr
 * @return {string}
 */
function bytesToString(arr) {
    if (arr instanceof ArrayBuffer) {
        arr = new Uint8Array(arr);
    }
    return textDecoder.decode(arr);
}
```



本库使用了  [inexorabletash](https://github.com/inexorabletash)/**[text-encoding](https://github.com/inexorabletash/text-encoding)** , 里面的核心文件 encoding-indexes.js 518kb, 太大了, 我在小程序里使用了, 由于空间限制, 所以对这个文件进行了压缩, 只实现了设计的部分算法, 压缩到了155k, 还有些空间, 不过暂时我没那么大需求, 就先这样. 

