/**
 * 将 encoding 编码格式进行压缩
 * 
 * 前后差值排序int8 -128 127,0
 * 
 * 高度重复
 * 128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160
 * 
 * 
 * 结构体
 * [Uint8 类型]
 * --------从这个后将读入下一个数组
 * [  0] : 下一个对象分割
 * --------按照相同格式读取长度
 * [  1] : [2费]数组 [Uint8  长] Uint8
 * [  2] : [2费]数组 [Uint8  长] Uint16
 * [  3] : [2费]数组 [Uint8  长] Uint32
 * [  4] : [2费]数组 [Uint8  长] Int8
 * [  5] : [2费]数组 [Unit8  长] Int16
 * [  6] : [2费]数组 [Uint8  长] Int32
 * [ 11] : [3费]数组 [Unit16 长] Uint8  
 * [ 12] : [3费]数组 [Unit16 长] Uint16 
 * [ 13] : [3费]数组 [Unit16 长] Uint32
 * [ 14] : [3费]数组 [Unit16 长] Int8
 * [ 15] : [3费]数组 [Unit16 长] Int16
 * [ 16] : [3费]数组 [Unit16 长] Int32
 * --------设置一个模板来管理
 * [ 50] : [2费][全局][模板库]设置 [Unit8  长] 结构体          优先级 : 10 [未启用]
 * [ 51] : [3费][全局][模板库]设置 [Unit16 长] 结构体          优先级 : 10 [未启用]
 * [ 52] : [2费][全局][模板库]使用 [Unit8 ] Index的索引        优先级 : 10 [未启用]
 * [ 53] : [3费][全局][模板库]使用 [Unit16] Index的索引        优先级 : 10 [未启用]
 * --------重复 数字 次数
 * [100] : [3费]复制 [Unit8  数字][Unit8  次数]               优先级 : 9
 * [101] : [4费]复制 [Unit16 数字][Unit8  次数]               优先级 : 9
 * [102] : [3费]复制 [Unit8  数字][Unit16 次数]               优先级 : 9
 * [103] : [4费]复制 [Unit16 数字][Unit16 次数]               优先级 : 9
 * --------从 起数 +1 递增 排到 结束数
 * [110] : [3费]连排 [Unit8  起数][Unit8  结数]               优先级 : 9
 * [111] : [5费]连排 [Unit16 起数][Unit16 结数]               优先级 : 9
 * [112] : [5费]连排 [Unit32 起数][Unit32 结数]               优先级 : 9
 * -------- ±X 递增   操作多少次   开始数       每次操作数
 * [140] : [4费]连排 [Unit8  长][Unit8  起数][Int8  操作数]    优先级 : 5
 * [141] : [4费]连排 [Unit8  长][Unit8  起数][Unit8 操作数]    优先级 : 5
 * [142] : [4费]连排 [Unit16 长][Unit8  起数][Int8  操作数]    优先级 : 5
 * [143] : [4费]连排 [Unit16 长][Unit8  起数][Unit8 操作数]    优先级 : 5
 * [144] : [4费]连排 [Unit8  长][Unit8  起数][Int16 操作数]    优先级 : 5
 * [145] : [4费]连排 [Unit8  长][Unit8  起数][Unit16操作数]    优先级 : 5
 * [146] : [4费]连排 [Unit16 长][Unit8  起数][Int16 操作数]    优先级 : 5
 * [147] : [4费]连排 [Unit16 长][Unit8  起数][Unit16操作数]    优先级 : 5
 * -------- ±X 递增   操作多少次   开始数       每次操作数
 * [150] : [4费]连排 [Unit8  长][Unit16 起数][Int8  操作数]    优先级 : 5
 * [151] : [4费]连排 [Unit8  长][Unit16 起数][Unit8 操作数]    优先级 : 5
 * [152] : [4费]连排 [Unit16 长][Unit16 起数][Int8  操作数]    优先级 : 5
 * [153] : [4费]连排 [Unit16 长][Unit16 起数][Unit8 操作数]    优先级 : 5
 * [154] : [4费]连排 [Unit8  长][Unit16 起数][Int16 操作数]    优先级 : 5
 * [155] : [4费]连排 [Unit8  长][Unit16 起数][Unit16操作数]    优先级 : 5
 * [156] : [4费]连排 [Unit16 长][Unit16 起数][Int16 操作数]    优先级 : 5
 * [157] : [4费]连排 [Unit16 长][Unit16 起数][Unit16操作数]    优先级 : 5
 *  * -------- ±X 递增   操作多少次   开始数       每次操作数
 * [160] : [4费]连排 [Unit8  长][Uint32 起数][Int8  操作数]    优先级 : 5
 * [161] : [4费]连排 [Unit8  长][Uint32 起数][Unit8 操作数]    优先级 : 5
 * [162] : [4费]连排 [Unit16 长][Uint32 起数][Int8  操作数]    优先级 : 5
 * [163] : [4费]连排 [Unit16 长][Uint32 起数][Unit8 操作数]    优先级 : 5
 * [164] : [4费]连排 [Unit8  长][Uint32 起数][Int16 操作数]    优先级 : 5
 * [165] : [4费]连排 [Unit8  长][Uint32 起数][Unit16操作数]    优先级 : 5
 * [166] : [4费]连排 [Unit16 长][Uint32 起数][Int16 操作数]    优先级 : 5
 * [167] : [4费]连排 [Unit16 长][Uint32 起数][Unit16操作数]    优先级 : 5
 * 
 * --------设置数组为2维数组, 每个数组元素数量    [先不用]
 * [240] : [1费][Unit8  长] 元素数量            [先不用]
 * [241] : [1费][Unit16 长] 元素数量            [先不用]
 * 
 * --------设置 null 的长度
 * [250] : [1费]null 写入1个
 * [251] : [2费]null [Unit8  长] 数量
 * [252] : [3费]null [Unit16 长] 数量
 */

const o = require("./../lib/encoding-indexes.js")["encoding-indexes"];
const base64Toarraybuffer = require("./arrayBase64")


const pako = require("./pako/index")

console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
console.log('------------------------------------------------------------------------------');

// 
runPako()
function runPako() {
    let json = JSON.stringify(o)
    var out = pako.deflate(json, {
        to: 'string',
        /* 0表示不压缩，1表示压缩时间最快，压缩率最小；9表示压缩率最大，时间最长；默认6 */
        level: 9,
    });
    console.log('out : ', Object.prototype.toString.call(out));
    let base64Str = base64Toarraybuffer.encode(out.buffer)
    console.log('转JSON长 : ' + objLength(json) + ' pako压后 : ' + objLength(out) + ' 二进制Base64 : ' + objLength(base64Str));
    let gzip = pako.gzip(json)
    base64Str = base64Toarraybuffer.encode(gzip.buffer)
    console.log('gzip压后 : ' + objLength(gzip) + ' 二进制Base64 : ' + objLength(base64Str));
    start()
}

function toLength(num) {
    if (num > 1024) {
        num = Math.floor(num / 1024)
        return num + 'k'
    }
    return num
}

function objLength(o) {
    let num = o.length
    return toLength(num)
}

/** 开始处理 */
function start() {
    if (false) {
        for (const key in o) {
            if (Object.hasOwnProperty.call(o, key)) {
                console.log('key : ', key);
                const item = o[key];
                if (key === 'gb18030-ranges') {
                    //进行特殊处理
                    check(getGb18030(item))
                } else {
                    check(item)
                }
                console.log('\n');
            }
        }
    }
    console.log('-------------------------------------');
    startGaGaZip()
}

function getGb18030(item) {
    let newArray = []
    for (let i = 0; i < item.length; i++) {
        const element = item[i];
        typeString = Object.prototype.toString.call(element)
        if (typeString === '[object Array]' && element.length === 2) {
            newArray.push(element[0])
            newArray.push(element[1])
        } else {
            console.log('getGb18030 验证错误');
        }
    }
    return newArray
}

/**
 * 对数据做一些检测
 * 
 * @param {item} params
 */
function check(item) {
    if (Object.prototype.toString.call(item) === '[object Array]') {
        console.log('    数组, 长 : ', item.length);
        let min_max_start = false
        let min = 0
        let max = 0
        // 取出不同长度的数量
        let unit8 = 0
        let unit16 = 0
        let unit32 = 0
        // 记录连续的状态, 连续{numtimes:1, times:10}
        let lianXu = []
        let lianXuLen = 0
        let bugMinToMax = 0
        // 数字数量
        let lenNum = 0
        // Null数量
        let lenNull = 0
        // 0 出现的次数
        let zero = 0
        // 其他类型列表
        let otherType = []
        let typeString = ''

        for (let i = 0; i < item.length; i++) {
            const element = item[i];
            typeString = Object.prototype.toString.call(element)
            if (typeString === '[object Number]') {
                lenNum++
                if (min_max_start === false) {
                    min = element
                    max = element
                    min_max_start = true
                } else {
                    if (element < min) {
                        min = element
                    }
                    if (element > max) {
                        max = element
                    }
                }
                if (element === 0) zero++;
                // 统计出连续
                if (i !== 0) {
                    if (item[i - 1] > element) bugMinToMax++
                    if ((item[i - 1] + 1) === element) {
                        lianXuLen++
                    } else if (lianXuLen !== 0) {
                        let lianXuItem = lianXu.find(item => item.numtimes === lianXuLen)
                        if (lianXuItem) {
                            lianXuItem.times++
                        } else {
                            lianXuItem = { 'numtimes': lianXuLen, 'times': 1 }
                            lianXu.push(lianXuItem)
                        }
                        lianXuLen = 0
                    }
                }
                if (element < 256) {
                    unit8++
                } else if (element < 65536) {
                    unit16++
                } else {
                    unit32++
                }
            } else if (element === null) {
                lenNull++
            } else {
                if (otherType.indexOf(typeString) === -1) {
                    otherType.push(typeString)
                }
            }
        }
        console.log(`    结构 数字[ ${lenNum} ][ ${min} - ${max} ] Null[ ${lenNull} ] 0[ ${zero} ] 其他类型:`, otherType);
        let lianXuStr = ''
        // 连续出现的数字个数
        let lianXuNumLen = 0
        let lianXuNumTime = 0
        for (let l = 0; l < lianXu.length; l++) {
            const element = lianXu[l];
            lianXuStr = lianXuStr + '[' + element.numtimes + ',' + element.times + ']'
            lianXuNumLen = lianXuNumLen + ((element.numtimes + 1) * element.times)
            lianXuNumTime = lianXuNumTime + element.times
        }

        console.log(`    意外小-大[ ${bugMinToMax} ] 连续 ${lianXuNumLen} - ${lianXuNumTime} : `, lianXuStr);
        console.log(`    数据分布[ ${unit8} ][ ${unit16} ][ ${unit32} ]`);
    } else {
        console.log('    值非数组');
    }
}

/** 搜索出适合模板的内容 */
function findTemp() {
    // 

}

/** 搜索出 从一个数到另一个数 */
function findAToB() {

}

/** 搜索出 重复的数字 */
function findNumRe() {

}

var keyList = ''
var byte = new ArrayBuffer();
var byteLen = 0
// 计算上一个节点的长度
var byteLenSave = 0
var byteU8 = new Uint8Array(byte)
var byteView = new DataView(byte)
var noIn = false
var noInIndex = 0
// 可以归类到 Int8 的数量
var noInInt8 = 0
var noInInt16 = 0
var noInInt32 = 0
var noInUint8 = 0
var noInUint16 = 0
var noInUint32 = 0

/** 开始执行 */
function startGaGaZip() {
    keyList = ''
    byte = new ArrayBuffer(1024 * 1024 * 10);
    byteLen = 0
    byteLenSave = 0
    byteU8 = new Uint8Array(byte)
    byteView = new DataView(byte)
    noIn = false
    noInIndex = 0
    noInInt8 = 0
    noInInt16 = 0
    noInInt32 = 0
    noInUint8 = 0
    noInUint16 = 0
    noInUint32 = 0
    console.log('开始进行压缩');
    let itemIndex = 0
    for (const key in o) {
        if (Object.hasOwnProperty.call(o, key)) {
            if (keyList) {
                keyList = keyList + ',' + key
            } else {
                keyList = key
            }
            var item = o[key];
            if (byteLen !== 0) byteView.setUint8(byteLen++, 0)

            if (key === 'gb18030-ranges') {
                item = getGb18030(item)
                // 这个逻辑先不用
                // byteView.setUint8(byteLen++, 240)
                // byteView.setUint8(byteLen++, 2)
            }

            // ---- 写入分隔符
            for (itemIndex = 0; itemIndex < item.length;) {
                var element = item[itemIndex];
                var element2 = 0
                // ---- 判断后面的内容写法
                if (Object.prototype.toString.call(element) === '[object Number]') {
                    let zipJson = getZipQZ(item, itemIndex, 0)
                    if (itemIndex === 1573 && key === 'big5') {
                        console.log('1573', zipJson);
                        console.log(item[zipJson.start])
                        console.log(item[zipJson.end])
                    }
                    if (zipJson) {
                        if (zipJson.type === 'getNumAddLen') {
                            if (zipJson.addIndex !== 0) {
                                addNoInItem(element, itemIndex)
                                itemIndex++
                            } else {
                                runNoIn(item, itemIndex)
                                element = item[itemIndex];
                                if (zipJson.typeInfo === 0) {
                                    if (likeLen < 256) {
                                        if (element < 256) {
                                            //[100] : [3费]复制 [Unit8  数字][Unit8  次数]               优先级 : 9
                                            byteView.setUint8(byteLen++, 100)
                                            byteView.setUint8(byteLen++, element)
                                            byteView.setUint8(byteLen++, zipJson.len)
                                        } else {
                                            //[101] : [4费]复制 [Unit16 数字][Unit8  次数]               优先级 : 9
                                            byteView.setUint8(byteLen++, 101)
                                            byteView.setUint16(byteLen, element)
                                            byteLen += 2
                                            byteView.setUint8(byteLen++, zipJson.len)
                                        }
                                    } else {
                                        if (element < 256) {
                                            //[102] : [3费]复制 [Unit8  数字][Unit16 次数]               优先级 : 9
                                            byteView.setUint8(byteLen++, 102)
                                            byteView.setUint8(byteLen++, element)
                                            byteView.setUint16(byteLen, zipJson.len)
                                            byteLen += 2
                                        } else {
                                            //[103] : [4费]复制 [Unit16 数字][Unit16 次数]               优先级 : 9
                                            byteView.setUint8(byteLen++, 103)
                                            byteView.setUint16(byteLen, element)
                                            byteLen += 2
                                            byteView.setUint16(byteLen, zipJson.len)
                                            byteLen += 2
                                        }
                                    }
                                } else if (zipJson.typeInfo === 1) {
                                    element2 = item[zipJson.end]
                                    if (element < 256 && element2 < 256) {
                                        //[110] : [3费]连排 [Unit8  起数][Unit8  结数]               优先级 : 9
                                        byteView.setUint8(byteLen++, 110)
                                        byteView.setUint8(byteLen++, element)
                                        byteView.setUint8(byteLen++, element2)
                                    } else if (element < 65536 && element2 < 65536) {
                                        //[111] : [5费]连排 [Unit16 起数][Unit16 结数]               优先级 : 9
                                        byteView.setUint8(byteLen++, 111)
                                        byteView.setUint16(byteLen, element)
                                        byteLen += 2
                                        byteView.setUint16(byteLen, element2)
                                        byteLen += 2
                                    } else {
                                        //[112] : [5费]连排 [Unit32 起数][Unit32 结数]               优先级 : 9
                                        byteView.setUint8(byteLen++, 112)
                                        byteView.setUint32(byteLen, element)
                                        byteLen += 4
                                        byteView.setUint32(byteLen, element2)
                                        byteLen += 4
                                    }
                                } else {
                                    // 起始数
                                    let startFun, startLen, idAdd = 0
                                    if (element < 256) {
                                        startFun = 'setUint8'
                                        startLen = 1
                                    } else if (element < 65536) {
                                        startFun = 'setUint16'
                                        startLen = 2
                                        idAdd = 10
                                    } else if (element < 4294967296) {
                                        startFun = 'setUint32'
                                        startLen = 4
                                        idAdd = 20
                                    }
                                    // 排序长度
                                    let timesFun = zipJson.len < 256 ? 'setUint8' : 'setUint16'
                                    let timesLen = zipJson.len < 256 ? 1 : 2
                                    // 操作数
                                    let timesAddFun, timesAddLen, typeId;
                                    if (zipJson.typeInfo < 0) {
                                        timesAddFun = (element > -129 && element < 128) ? 'setInt8' : 'setInt16'
                                        timesAddLen = (element > -129 && element < 128) ? 1 : 2
                                        if (element > -129 && element < 128) {
                                            //[140] : [4费]连排 [Unit8  长][Unit8  起数][Int8  操作数]    优先级 : 5
                                            //[142] : [4费]连排 [Unit16 长][Unit8  起数][Int8  操作数]    优先级 : 5
                                            typeId = zipJson.len < 256 ? 140 : 142
                                        } else {
                                            //[144] : [4费]连排 [Unit8  长][Unit8  起数][Int16 操作数]    优先级 : 5
                                            //[146] : [4费]连排 [Unit16 长][Unit8  起数][Int16 操作数]    优先级 : 5
                                            typeId = zipJson.len < 256 ? 144 : 146
                                        }
                                    } else {
                                        timesAddFun = zipJson.typeInfo < 256 ? 'setUint8' : 'setUint16'
                                        timesAddLen = zipJson.typeInfo < 256 ? 1 : 2
                                        if (zipJson.typeInfo < 256) {
                                            //[141] : [4费]连排 [Unit8  长][Unit8  起数][Unit8 操作数]    优先级 : 5
                                            //[143] : [4费]连排 [Unit16 长][Unit8  起数][Unit8 操作数]    优先级 : 5
                                            typeId = zipJson.len < 256 ? 141 : 143
                                        } else {
                                            //[145] : [4费]连排 [Unit8  长][Unit8  起数][Unit16操作数]    优先级 : 5
                                            //[147] : [4费]连排 [Unit16 长][Unit8  起数][Unit16操作数]    优先级 : 5
                                            typeId = zipJson.len < 256 ? 145 : 147
                                        }
                                    }
                                    typeId += idAdd
                                    byteView.setUint8(byteLen++, typeId)
                                    byteView[timesFun](byteLen, zipJson.len)
                                    byteLen += timesLen
                                    byteView[startFun](byteLen, element)
                                    byteLen += startLen
                                    byteView[timesAddFun](byteLen, zipJson.typeInfo)
                                    byteLen += timesAddLen
                                }
                                itemIndex += zipJson.len
                            }
                        } else {
                            console.log('超级 BUG');
                        }
                    } else {
                        addNoInItem(element, itemIndex)
                        itemIndex++
                    }
                } else if (element === null) {
                    runNoIn(item, itemIndex)
                    let nullLen = getNullLen(item, itemIndex)
                    if (nullLen === 1) {
                        byteView.setUint8(byteLen++, 250)
                    } else if (nullLen < 256) {
                        byteView.setUint8(byteLen++, 251)
                        byteView.setUint8(byteLen++, nullLen)
                    } else {
                        byteView.setUint8(byteLen++, 252)
                        byteView.setUint16(byteLen, nullLen)
                        byteLen += 2
                    }
                    itemIndex += nullLen
                } else {
                    console.log('♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦');
                    console.log(itemIndex, item[itemIndex]);
                    console.log(element);
                    console.log(Object.prototype.toString.call(element));
                    console.log(item);
                    itemIndex += item.length
                }
            }
            runNoIn(item, itemIndex)
            console.log('处理:', key, ' 长:', objLength(item), ' JSON长:', objLength(JSON.stringify(item)), ' 处理后长:' + toLength(byteLen - byteLenSave));
            byteLenSave = byteLen
        }
    }
    var copyU8 = byteU8.slice(0, byteLen);
    var copy = copyU8.buffer
    console.log('压缩后长度 : ' + toLength(byteLen), copy, copyU8);
    var copyBase64 = base64Toarraybuffer.encode(copy)
    console.log('copyBase64 : ' + objLength(copyBase64));
    var out = pako.deflate(copyBase64, {
        to: 'string',
        /* 0表示不压缩，1表示压缩时间最快，压缩率最小；9表示压缩率最大，时间最长；默认6 */
        level: 9,
    });

    var outGzip = pako.gzip(copy);

    console.log('out : ', Object.prototype.toString.call(out));
    let base64Str = base64Toarraybuffer.encode(out.buffer)
    console.log(' pako压后 : ' + objLength(out) + ' 二进制Base64 : ' + objLength(base64Str));
    base64Str = base64Toarraybuffer.encode(outGzip.buffer)
    console.log(' pakoGzip : ' + objLength(outGzip) + ' 二进制Base64 : ' + objLength(base64Str));
    var fs = require('fs');
    fs.writeFile('./压缩后文件.txt', base64Str, function (error) {
        if (error) {
            console.log('写入成功')
        } else {
            console.log('写入成功')
        }
    });
    console.log('[' + keyList + ']');
}

/**
 * 将未找到最优解的单个元素添加到队列
 *
 * @param {*} element
 */
function addNoInItem(element, itemIndex) {
    if (noIn === false) {
        noIn = true
        noInIndex = itemIndex
    }
    if (element > -1) {
        if (element < 256) {
            noInUint8++
            noInUint16++
            noInUint32++
        } else if (element < 65536) {
            noInUint16++
            noInUint32++
        } else if (element < 4294967296) {
            noInUint32++
        }
    } else {
        if (element > -129 && element < 128) {
            noInInt8++
            noInInt16++
            noInInt32++
        } else if (element > -32769 && element < 32768) {
            noInInt16++
            noInInt32++
        } else if (element > -2147483649 && element < 2147483648) {
            noInInt32++
        }
    }
}


/**
 * 权重算法, 获取压缩最优比
 * {start:开始位置, end:结束位置, type:压缩算法, s_len:原始长度, z_len:压缩长度, z_bfb:压缩后的百分比, addIndex:是否向后迭代}
 * 
 * @param {*} item 要运算的数组
 * @param {*} itemIndex 现在的索引
 * @param {*} runAdd 向后多迭代多少次
 * @returns
 */
function getZipQZ(item, itemIndex, runAdd) {
    // 保存全部采集结果
    let returnInfo = []
    // 保存单个采集结果
    let returnItem = {}
    for (let i = 0; i < runAdd + 1; i++) {
        // check检测的索引
        let checkIndex = itemIndex + i
        let checkItem = item[checkIndex]
        // 跳过区域需要累加的长度
        let jumpLen = 0
        if (i !== 0) {
            jumpLen = getRectNumLen(item, itemIndex, checkIndex)
        }
        // 测试从 -500 - 500 的累加
        for (let r = -1500; r < 1501; r++) {
            // 包含自己的缩进
            let checkLen = getNumAddLen(item, checkIndex, checkItem, r)
            let checkEnd = checkIndex + checkLen - 1
            // 原始的字节
            let checkStartLen = getRectNumLen(item, checkIndex, checkEnd)
            // 原始长 加 第一次[连续次数]
            let checkRunLen = 1 + (checkLen > 255) ? 2 : 1
            // 包含区域内数据最大长度
            checkRunLen += getRectNumBig(item, checkIndex, checkEnd)
            // 累加量的数量
            checkRunLen += r > 255 ? 2 : 1
            // 只有压缩后比原始大才进行统计
            checkStartLen += jumpLen
            checkRunLen += jumpLen
            if (checkStartLen > checkRunLen) {
                returnItem = {
                    'start': checkIndex,
                    'end': checkEnd,
                    'len': checkLen,
                    'type': 'getNumAddLen',
                    'typeInfo': r,
                    's_len': checkStartLen,
                    'z_len': checkRunLen,
                    'z_bfb': checkRunLen / checkStartLen,
                    'addIndex': i
                }
                returnInfo.push(returnItem)
            }
        }
    }
    // 查到 z_bfb 最小的组合
    let min = -1
    let out = null
    for (let i = 0; i < returnInfo.length; i++) {
        returnItem = returnInfo[i]
        if (min === -1) {
            min = returnItem.z_bfb
            out = returnItem
        } else if (returnItem.z_bfb < min) {
            min = returnItem.z_bfb
            out = returnItem
        }
    }
    return out
}

/**
 * 获取数字开始到结果未知的数据长度
 *
 * @param {*} item  数组
 * @param {*} indexStart 开始的索引
 * @param {*} indexEnd 结束的索引, 包含
 */
function getRectNumLen(item, indexStart, indexEnd) {
    let oldType = ''
    let allLen = 0
    for (; indexStart < indexEnd + 1; indexStart++) {
        const element = item[indexStart];
        let type = ''
        let len = 1
        if (element > -1) {
            if (element < 256) {
                type = 'Uint8'
            } else if (element < 65536) {
                type = 'Uint16'
                len = 2
            } else if (element < 4294967296) {
                type = 'Uint32'
                len = 4
            }
        } 
        if (element > -129 && element < 128) {
            type = 'Int8'
        } else if (element > -32769 && element < 32768) {
            type = 'Int16'
            len = 2
        } else if (element > -2147483649 && element < 2147483648) {
            type = 'Int32'
            len = 4
        }
        // 类型切换长度加1
        if (oldType !== '' && oldType !== type) {
            len++
        }
        allLen += len
        oldType = type
    }
    return allLen
}

/**
 * 获取数字最大的占用字节
 * @param {*} item  数组
 * @param {*} indexStart 开始索引
 * @param {*} indexEnd 结束索引[包含]
 */
function getRectNumBig(item, indexStart, indexEnd) {
    let size = 1
    for (; indexStart <= indexEnd; indexStart++) {
        const element = item[indexStart];
        if (element > -1) {
            if (element < 256) {
            } else if (element < 65536) {
                if (size < 2) size = 2
            } else if (element < 4294967296) {
                return 4
            }
        } else {
            if (element > -129 && element < 128) {
            } else if (element > -32769 && element < 32768) {
                if (size < 2) size = 2
            } else if (element > -2147483649 && element < 2147483648) {
                return 4
            }
        }
    }
    return size
}

/**
 * 结束掉没有处理的部分
 *
 * @param {*} item 操作的数组
 * @param {*} itemIndex 不包含
 */
function runNoIn(item, itemIndex) {
    if (noIn) {
        if (noInIndex < itemIndex) {
            var len = itemIndex - noInIndex
            var fun = null
            var add = 0
            if (len === noInInt8) {
                fun = 'setInt8'
                add = 1
                byteView.setUint8(byteLen++, len < 256 ? 4 : 14)
            } else if (len === noInUint8) {
                fun = 'setUint8'
                add = 1
                byteView.setUint8(byteLen++, len < 256 ? 1 : 11)
            } else if (len === noInInt16) {
                fun = 'setInt16'
                add = 2
                byteView.setUint8(byteLen++, len < 256 ? 5 : 15)
            } else if (len === noInUint16) {
                fun = 'setUint16'
                add = 2
                byteView.setUint8(byteLen++, len < 256 ? 2 : 12)
            } else if (len === noInInt32) {
                fun = 'setInt32'
                add = 4
                byteView.setUint8(byteLen++, len < 256 ? 6 : 16)
            } else if (len === noInUint32) {
                fun = 'setUint32'
                add = 4
                byteView.setUint8(byteLen++, len < 256 ? 3 : 13)
            } else {
                console.log('完犊子');
            }
            if (len < 256) {
                byteView.setUint8(byteLen++, len)
            } else {
                byteView.setUint16(byteLen, len)
                byteLen += 2
            }
            while (noInIndex < itemIndex) {
                let element = item[noInIndex];
                if (fun === null) {
                    console.log('fun:', fun, ' noInIndex:', noInIndex, ' itemIndex:', itemIndex, ' len:', len);
                    console.log(`noInInt8:${noInInt8}, noInInt16:${noInInt16}, noInInt32:${noInInt32}, noInUint8:${noInUint8}, noInUint16:${noInUint16}, noInUint32:${noInUint32}`);
                }
                byteView[fun](byteLen, element)
                byteLen += add
                noInIndex++
            }
        }
        noInIndex = 0
        noInInt8 = 0
        noInInt16 = 0
        noInInt32 = 0
        noInUint8 = 0
        noInUint16 = 0
        noInUint32 = 0
        noIn = false
    }
}

/** [包含自己]返回后面还有连续多少个null */
function getNullLen(item, itemIndex) {
    var i = 1;
    while (item.length > (itemIndex + i)) {
        if (item[itemIndex + i] !== null) {
            break;
        }
        i++
    }
    return i;
}

/** [包含自己]返回后面还有多少个 + 1 数字 */
function getNumAddLen(item, itemIndex, num, add) {
    var i = 1;
    var v = add
    while (item.length > (itemIndex + i)) {
        if (item[itemIndex + i] !== num + v) {
            break;
        }
        v = v + add
        i++
    }
    return i;
}
