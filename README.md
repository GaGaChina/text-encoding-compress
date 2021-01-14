# text-encoding-compress
compress encoding-indexes.js, The size is reduced from 518K to 155k

The [inexorabletash](https://github.com/inexorabletash)/**[text-encoding](https://github.com/inexorabletash/text-encoding)** Size is Big, Compression encoding- indexes.js , re encode, and use Pako to compress binary, and finally export Base64.

本库使用了  [inexorabletash](https://github.com/inexorabletash)/**[text-encoding](https://github.com/inexorabletash/text-encoding)** , 里面的核心文件 encoding-indexes.js 518kb, 太大了, 我在小程序里使用了, 由于空间限制, 所以对这个文件进行了压缩, 只实现了设计的部分算法, 压缩到了155k, 还有些空间, 不过暂时我没那么大需求, 就先这样. 

