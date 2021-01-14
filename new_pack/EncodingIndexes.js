"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tool_bytes_1 = require("../../frame/tools/tool.bytes");
const pako = require('./../pako/index');
const BinaryStream = require('./../kdbxweb/utils/binary-stream.js');
const base64 = require('./encoding-base64.js');
class EncodingIndexes {
    static init(o) {
        if (this.isInit)
            return;
        console.log('TextEncodingIndexes 解压');
        const handleArrayList = EncodingIndexes.setArray(o);
        let handleArray = handleArrayList[0];
        let handleIndex = 0;
        const gzip = tool_bytes_1.ToolBytes.Base64ToArrayBuffer(base64);
        const byteU8 = pako.ungzip(gzip);
        const byteLength = byteU8.length;
        const stream = new BinaryStream(byteU8.buffer);
        let typeInfo, temp_n1, temp_n2, temp_n3, temp_s;
        while (stream.pos < byteLength) {
            typeInfo = stream.getUint8();
            if (typeInfo === 0) {
                handleIndex++;
                handleArray = handleArrayList[handleIndex];
            }
            else if (typeInfo > 0 && typeInfo < 17) {
                temp_n2 = typeInfo < 11 ? stream.getUint8() : stream.getUint16();
                if (typeInfo === 1 || typeInfo === 11) {
                    temp_s = 'Uint8';
                }
                else if (typeInfo === 2 || typeInfo === 12) {
                    temp_s = 'Uint16';
                }
                else if (typeInfo === 3 || typeInfo === 13) {
                    temp_s = 'Uint32';
                }
                else if (typeInfo === 4 || typeInfo === 14) {
                    temp_s = 'Int8';
                }
                else if (typeInfo === 5 || typeInfo === 15) {
                    temp_s = 'Int16';
                }
                else {
                    temp_s = 'Int32';
                }
                while (--temp_n2 > -1) {
                    temp_n1 = stream['get' + temp_s]();
                    handleArray.push(temp_n1);
                }
            }
            else if (typeInfo > 99 && typeInfo < 104) {
                temp_n1 = (typeInfo === 100 || typeInfo === 102) ? stream.getUint8() : stream.getUint16();
                temp_n2 = typeInfo < 102 ? stream.getUint8() : stream.getUint16();
                while (--temp_n2 > -1) {
                    handleArray.push(temp_n1);
                }
            }
            else if (typeInfo > 109 && typeInfo < 113) {
                temp_s = typeInfo === 110 ? '8' : typeInfo === 111 ? '16' : '32';
                temp_n1 = stream['getUint' + temp_s]();
                temp_n2 = stream['getUint' + temp_s]();
                while (temp_n1 <= temp_n2) {
                    handleArray.push(temp_n1);
                    temp_n1++;
                }
            }
            else if (typeInfo > 139 && typeInfo < 168) {
                if (typeInfo > 159) {
                    temp_s = '32';
                    typeInfo -= 20;
                }
                else if (typeInfo > 149) {
                    temp_s = '16';
                    typeInfo -= 10;
                }
                else {
                    temp_s = '8';
                }
                if (typeInfo < 142 || typeInfo === 144 || typeInfo === 145) {
                    temp_n3 = stream.getUint8();
                }
                else {
                    temp_n3 = stream.getUint16();
                }
                temp_n1 = stream['getUint' + temp_s]();
                if (typeInfo === 140 || typeInfo === 142) {
                    temp_n2 = stream.getInt8();
                }
                else if (typeInfo === 141 || typeInfo === 143) {
                    temp_n2 = stream.getUint8();
                }
                else if (typeInfo === 144 || typeInfo === 146) {
                    temp_n2 = stream.getInt16();
                }
                else {
                    temp_n2 = stream.getUint16();
                }
                while (--temp_n3 > -1) {
                    handleArray.push(temp_n1);
                    temp_n1 += temp_n2;
                }
            }
            else if (typeInfo === 250) {
                handleArray.push(null);
            }
            else if (typeInfo > 250 && typeInfo < 253) {
                temp_n2 = typeInfo === 251 ? stream.getUint8() : stream.getUint16();
                while (--temp_n2 > -1) {
                    handleArray.push(null);
                }
            }
            else {
                console.log('失败, 缺:', typeInfo);
                return;
            }
        }
        EncodingIndexes.changeGB18030(o);
        EncodingIndexes.isInit = true;
    }
    static changeGB18030(o) {
        const run = o['gb18030-ranges'];
        const newArr = [];
        let i = 0, len = run.length, a;
        while (i < len) {
            a = [];
            a.push(run[i++]);
            a.push(run[i++]);
            newArr.push(a);
        }
        o['gb18030-ranges'] = newArr;
    }
    static setArray(o) {
        const a = [];
        const s = 'big5,euc-kr,gb18030,gb18030-ranges,jis0208,jis0212,ibm866,iso-8859-2,iso-8859-3,iso-8859-4,iso-8859-5,iso-8859-6,iso-8859-7,iso-8859-8,iso-8859-10,iso-8859-13,iso-8859-14,iso-8859-15,iso-8859-16,koi8-r,koi8-u,macintosh,windows-874,windows-1250,windows-1251,windows-1252,windows-1253,windows-1254,windows-1255,windows-1256,windows-1257,windows-1258,x-mac-cyrillic';
        let t = '';
        let l = s.length;
        for (let i = 0; i < l; i++) {
            if (s[i] === ',') {
                o[t] = [];
                a.push(o[t]);
                t = '';
            }
            else {
                t += s[i];
            }
        }
        o[t] = [];
        a.push(o[t]);
        return a;
    }
}
EncodingIndexes.isInit = false;
exports.EncodingIndexes = EncodingIndexes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW5jb2RpbmdJbmRleGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRW5jb2RpbmdJbmRleGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkRBQXlEO0FBRXpELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ3ZDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO0FBQ25FLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO0FBRzlDLE1BQWEsZUFBZTtJQUlqQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQVM7UUFDeEIsSUFBSSxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU87UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sZUFBZSxHQUFTLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDekQsSUFBSSxXQUFXLEdBQVEsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3pDLElBQUksV0FBVyxHQUFXLENBQUMsQ0FBQTtRQUMzQixNQUFNLElBQUksR0FBRyxzQkFBUyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2xELE1BQU0sTUFBTSxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDNUMsTUFBTSxVQUFVLEdBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQTtRQUN4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFOUMsSUFBSSxRQUFnQixFQUFFLE9BQWUsRUFBRSxPQUFlLEVBQUUsT0FBZSxFQUFFLE1BQWMsQ0FBQTtRQUN2RixPQUFPLE1BQU0sQ0FBQyxHQUFHLEdBQUcsVUFBVSxFQUFFO1lBQzVCLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUE7WUFDNUIsSUFBSSxRQUFRLEtBQUssQ0FBQyxFQUFFO2dCQUNoQixXQUFXLEVBQUUsQ0FBQTtnQkFDYixXQUFXLEdBQUcsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFBO2FBQzdDO2lCQUFNLElBQUksUUFBUSxHQUFHLENBQUMsSUFBSSxRQUFRLEdBQUcsRUFBRSxFQUFFO2dCQUN0QyxPQUFPLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2pFLElBQUksUUFBUSxLQUFLLENBQUMsSUFBSSxRQUFRLEtBQUssRUFBRSxFQUFFO29CQUNuQyxNQUFNLEdBQUcsT0FBTyxDQUFBO2lCQUNuQjtxQkFBTSxJQUFJLFFBQVEsS0FBSyxDQUFDLElBQUksUUFBUSxLQUFLLEVBQUUsRUFBRTtvQkFDMUMsTUFBTSxHQUFHLFFBQVEsQ0FBQTtpQkFDcEI7cUJBQU0sSUFBSSxRQUFRLEtBQUssQ0FBQyxJQUFJLFFBQVEsS0FBSyxFQUFFLEVBQUU7b0JBQzFDLE1BQU0sR0FBRyxRQUFRLENBQUE7aUJBQ3BCO3FCQUFNLElBQUksUUFBUSxLQUFLLENBQUMsSUFBSSxRQUFRLEtBQUssRUFBRSxFQUFFO29CQUMxQyxNQUFNLEdBQUcsTUFBTSxDQUFBO2lCQUNsQjtxQkFBTSxJQUFJLFFBQVEsS0FBSyxDQUFDLElBQUksUUFBUSxLQUFLLEVBQUUsRUFBRTtvQkFDMUMsTUFBTSxHQUFHLE9BQU8sQ0FBQTtpQkFDbkI7cUJBQU07b0JBQ0gsTUFBTSxHQUFHLE9BQU8sQ0FBQTtpQkFDbkI7Z0JBQ0QsT0FBTyxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFDbkIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQTtvQkFDbEMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtpQkFDNUI7YUFDSjtpQkFBTSxJQUFJLFFBQVEsR0FBRyxFQUFFLElBQUksUUFBUSxHQUFHLEdBQUcsRUFBRTtnQkFFeEMsT0FBTyxHQUFHLENBQUMsUUFBUSxLQUFLLEdBQUcsSUFBSSxRQUFRLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUMxRixPQUFPLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2xFLE9BQU8sRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQ25CLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7aUJBQzVCO2FBQ0o7aUJBQU0sSUFBSSxRQUFRLEdBQUcsR0FBRyxJQUFJLFFBQVEsR0FBRyxHQUFHLEVBQUU7Z0JBRXpDLE1BQU0sR0FBRyxRQUFRLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO2dCQUNoRSxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFBO2dCQUN0QyxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFBO2dCQUN0QyxPQUFPLE9BQU8sSUFBSSxPQUFPLEVBQUU7b0JBQ3ZCLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7b0JBQ3pCLE9BQU8sRUFBRSxDQUFBO2lCQUNaO2FBQ0o7aUJBQU0sSUFBSSxRQUFRLEdBQUcsR0FBRyxJQUFJLFFBQVEsR0FBRyxHQUFHLEVBQUU7Z0JBQ3pDLElBQUksUUFBUSxHQUFHLEdBQUcsRUFBRTtvQkFDaEIsTUFBTSxHQUFHLElBQUksQ0FBQTtvQkFDYixRQUFRLElBQUksRUFBRSxDQUFBO2lCQUNqQjtxQkFBTSxJQUFJLFFBQVEsR0FBRyxHQUFHLEVBQUU7b0JBQ3ZCLE1BQU0sR0FBRyxJQUFJLENBQUE7b0JBQ2IsUUFBUSxJQUFJLEVBQUUsQ0FBQTtpQkFDakI7cUJBQU07b0JBQ0gsTUFBTSxHQUFHLEdBQUcsQ0FBQTtpQkFDZjtnQkFDRCxJQUFJLFFBQVEsR0FBRyxHQUFHLElBQUksUUFBUSxLQUFLLEdBQUcsSUFBSSxRQUFRLEtBQUssR0FBRyxFQUFFO29CQUN4RCxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBO2lCQUM5QjtxQkFBTTtvQkFDSCxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO2lCQUMvQjtnQkFDRCxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFBO2dCQUN0QyxJQUFJLFFBQVEsS0FBSyxHQUFHLElBQUksUUFBUSxLQUFLLEdBQUcsRUFBRTtvQkFDdEMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtpQkFDN0I7cUJBQU0sSUFBSSxRQUFRLEtBQUssR0FBRyxJQUFJLFFBQVEsS0FBSyxHQUFHLEVBQUU7b0JBQzdDLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUE7aUJBQzlCO3FCQUFNLElBQUksUUFBUSxLQUFLLEdBQUcsSUFBSSxRQUFRLEtBQUssR0FBRyxFQUFFO29CQUM3QyxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBO2lCQUM5QjtxQkFBTTtvQkFDSCxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO2lCQUMvQjtnQkFDRCxPQUFPLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUNuQixXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO29CQUN6QixPQUFPLElBQUksT0FBTyxDQUFBO2lCQUNyQjthQUNKO2lCQUFNLElBQUksUUFBUSxLQUFLLEdBQUcsRUFBRTtnQkFDekIsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUN6QjtpQkFBTSxJQUFJLFFBQVEsR0FBRyxHQUFHLElBQUksUUFBUSxHQUFHLEdBQUcsRUFBRTtnQkFDekMsT0FBTyxHQUFHLFFBQVEsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNwRSxPQUFPLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUNuQixXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO2lCQUN6QjthQUNKO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNoQyxPQUFPO2FBQ1Y7U0FDSjtRQUNELGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDaEMsZUFBZSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7SUFFakMsQ0FBQztJQU1PLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBTTtRQUMvQixNQUFNLEdBQUcsR0FBYSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtRQUN6QyxNQUFNLE1BQU0sR0FBUSxFQUFFLENBQUE7UUFDdEIsSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUNiLEdBQUcsR0FBVyxHQUFHLENBQUMsTUFBTSxFQUN4QixDQUFXLENBQUE7UUFDZixPQUFPLENBQUMsR0FBRyxHQUFHLEVBQUU7WUFDWixDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQ04sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ2pCO1FBQ0QsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsTUFBTSxDQUFBO0lBQ2hDLENBQUM7SUFnQ08sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFNO1FBQzFCLE1BQU0sQ0FBQyxHQUFTLEVBQUUsQ0FBQTtRQUNsQixNQUFNLENBQUMsR0FBVyw0V0FBNFcsQ0FBQTtRQUM5WCxJQUFJLENBQUMsR0FBVyxFQUFFLENBQUE7UUFDbEIsSUFBSSxDQUFDLEdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtRQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtnQkFDZCxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO2dCQUNULENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ1osQ0FBQyxHQUFHLEVBQUUsQ0FBQTthQUNUO2lCQUFNO2dCQUNILENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDWjtTQUNKO1FBQ0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNULENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDWixPQUFPLENBQUMsQ0FBQTtJQUNaLENBQUM7O0FBdEtjLHNCQUFNLEdBQVksS0FBSyxDQUFDO0FBRjNDLDBDQXlLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRvb2xCeXRlcyB9IGZyb20gXCIuLi8uLi9mcmFtZS90b29scy90b29sLmJ5dGVzXCI7XHJcblxyXG5jb25zdCBwYWtvID0gcmVxdWlyZSgnLi8uLi9wYWtvL2luZGV4JylcclxuY29uc3QgQmluYXJ5U3RyZWFtID0gcmVxdWlyZSgnLi8uLi9rZGJ4d2ViL3V0aWxzL2JpbmFyeS1zdHJlYW0uanMnKVxyXG5jb25zdCBiYXNlNjQgPSByZXF1aXJlKCcuL2VuY29kaW5nLWJhc2U2NC5qcycpXHJcbi8vY29uc3QgYmFzZTY0T2xkID0gcmVxdWlyZSgnLi8uLi90ZXh0LWVuY29kaW5nL2xpYi9lbmNvZGluZy1pbmRleGVzLmpzJylbXCJlbmNvZGluZy1pbmRleGVzXCJdXHJcblxyXG5leHBvcnQgY2xhc3MgRW5jb2RpbmdJbmRleGVzIHtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpc0luaXQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXQobzogT2JqZWN0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNJbml0KSByZXR1cm47XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1RleHRFbmNvZGluZ0luZGV4ZXMg6Kej5Y6LJyk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlQXJyYXlMaXN0OiBbXVtdID0gRW5jb2RpbmdJbmRleGVzLnNldEFycmF5KG8pXHJcbiAgICAgICAgbGV0IGhhbmRsZUFycmF5OiBhbnkgPSBoYW5kbGVBcnJheUxpc3RbMF1cclxuICAgICAgICBsZXQgaGFuZGxlSW5kZXg6IG51bWJlciA9IDBcclxuICAgICAgICBjb25zdCBnemlwID0gVG9vbEJ5dGVzLkJhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0KVxyXG4gICAgICAgIGNvbnN0IGJ5dGVVODogVWludDhBcnJheSA9IHBha28udW5nemlwKGd6aXApXHJcbiAgICAgICAgY29uc3QgYnl0ZUxlbmd0aDogbnVtYmVyID0gYnl0ZVU4Lmxlbmd0aFxyXG4gICAgICAgIGNvbnN0IHN0cmVhbSA9IG5ldyBCaW5hcnlTdHJlYW0oYnl0ZVU4LmJ1ZmZlcilcclxuICAgICAgICAvLyDmk43kvZznsbvlnovnvJbnoIFcclxuICAgICAgICBsZXQgdHlwZUluZm86IG51bWJlciwgdGVtcF9uMTogbnVtYmVyLCB0ZW1wX24yOiBudW1iZXIsIHRlbXBfbjM6IG51bWJlciwgdGVtcF9zOiBzdHJpbmdcclxuICAgICAgICB3aGlsZSAoc3RyZWFtLnBvcyA8IGJ5dGVMZW5ndGgpIHtcclxuICAgICAgICAgICAgdHlwZUluZm8gPSBzdHJlYW0uZ2V0VWludDgoKVxyXG4gICAgICAgICAgICBpZiAodHlwZUluZm8gPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUluZGV4KytcclxuICAgICAgICAgICAgICAgIGhhbmRsZUFycmF5ID0gaGFuZGxlQXJyYXlMaXN0W2hhbmRsZUluZGV4XVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVJbmZvID4gMCAmJiB0eXBlSW5mbyA8IDE3KSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wX24yID0gdHlwZUluZm8gPCAxMSA/IHN0cmVhbS5nZXRVaW50OCgpIDogc3RyZWFtLmdldFVpbnQxNigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVJbmZvID09PSAxIHx8IHR5cGVJbmZvID09PSAxMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfcyA9ICdVaW50OCdcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZUluZm8gPT09IDIgfHwgdHlwZUluZm8gPT09IDEyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9zID0gJ1VpbnQxNidcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZUluZm8gPT09IDMgfHwgdHlwZUluZm8gPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9zID0gJ1VpbnQzMidcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZUluZm8gPT09IDQgfHwgdHlwZUluZm8gPT09IDE0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9zID0gJ0ludDgnXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVJbmZvID09PSA1IHx8IHR5cGVJbmZvID09PSAxNSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfcyA9ICdJbnQxNidcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7Ly99IGVsc2UgaWYgKHR5cGVJbmZvID09PSA2IHx8IHR5cGVJbmZvID09PSAxNikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfcyA9ICdJbnQzMidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHdoaWxlICgtLXRlbXBfbjIgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfbjEgPSBzdHJlYW1bJ2dldCcgKyB0ZW1wX3NdKClcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVBcnJheS5wdXNoKHRlbXBfbjEpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZUluZm8gPiA5OSAmJiB0eXBlSW5mbyA8IDEwNCkge1xyXG4gICAgICAgICAgICAgICAgLy8g6YeN5aSNIOaVsOWtlyDmrKHmlbBcclxuICAgICAgICAgICAgICAgIHRlbXBfbjEgPSAodHlwZUluZm8gPT09IDEwMCB8fCB0eXBlSW5mbyA9PT0gMTAyKSA/IHN0cmVhbS5nZXRVaW50OCgpIDogc3RyZWFtLmdldFVpbnQxNigpO1xyXG4gICAgICAgICAgICAgICAgdGVtcF9uMiA9IHR5cGVJbmZvIDwgMTAyID8gc3RyZWFtLmdldFVpbnQ4KCkgOiBzdHJlYW0uZ2V0VWludDE2KCk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoLS10ZW1wX24yID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVBcnJheS5wdXNoKHRlbXBfbjEpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZUluZm8gPiAxMDkgJiYgdHlwZUluZm8gPCAxMTMpIHtcclxuICAgICAgICAgICAgICAgIC8vIOS7jiDotbfmlbAgKzEg6YCS5aKeIOaOkuWIsCDnu5PmnZ/mlbBcclxuICAgICAgICAgICAgICAgIHRlbXBfcyA9IHR5cGVJbmZvID09PSAxMTAgPyAnOCcgOiB0eXBlSW5mbyA9PT0gMTExID8gJzE2JyA6ICczMidcclxuICAgICAgICAgICAgICAgIHRlbXBfbjEgPSBzdHJlYW1bJ2dldFVpbnQnICsgdGVtcF9zXSgpXHJcbiAgICAgICAgICAgICAgICB0ZW1wX24yID0gc3RyZWFtWydnZXRVaW50JyArIHRlbXBfc10oKVxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRlbXBfbjEgPD0gdGVtcF9uMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZUFycmF5LnB1c2godGVtcF9uMSlcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wX24xKytcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlSW5mbyA+IDEzOSAmJiB0eXBlSW5mbyA8IDE2OCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVJbmZvID4gMTU5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9zID0gJzMyJ1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVJbmZvIC09IDIwXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVJbmZvID4gMTQ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9zID0gJzE2J1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVJbmZvIC09IDEwXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfcyA9ICc4J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVJbmZvIDwgMTQyIHx8IHR5cGVJbmZvID09PSAxNDQgfHwgdHlwZUluZm8gPT09IDE0NSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfbjMgPSBzdHJlYW0uZ2V0VWludDgoKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wX24zID0gc3RyZWFtLmdldFVpbnQxNigpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0ZW1wX24xID0gc3RyZWFtWydnZXRVaW50JyArIHRlbXBfc10oKVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVJbmZvID09PSAxNDAgfHwgdHlwZUluZm8gPT09IDE0Mikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfbjIgPSBzdHJlYW0uZ2V0SW50OCgpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVJbmZvID09PSAxNDEgfHwgdHlwZUluZm8gPT09IDE0Mykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfbjIgPSBzdHJlYW0uZ2V0VWludDgoKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlSW5mbyA9PT0gMTQ0IHx8IHR5cGVJbmZvID09PSAxNDYpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wX24yID0gc3RyZWFtLmdldEludDE2KClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9uMiA9IHN0cmVhbS5nZXRVaW50MTYoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKC0tdGVtcF9uMyA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlQXJyYXkucHVzaCh0ZW1wX24xKVxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfbjEgKz0gdGVtcF9uMlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVJbmZvID09PSAyNTApIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUFycmF5LnB1c2gobnVsbClcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlSW5mbyA+IDI1MCAmJiB0eXBlSW5mbyA8IDI1Mykge1xyXG4gICAgICAgICAgICAgICAgdGVtcF9uMiA9IHR5cGVJbmZvID09PSAyNTEgPyBzdHJlYW0uZ2V0VWludDgoKSA6IHN0cmVhbS5nZXRVaW50MTYoKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICgtLXRlbXBfbjIgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZUFycmF5LnB1c2gobnVsbClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCflpLHotKUsIOe8ujonLCB0eXBlSW5mbyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgRW5jb2RpbmdJbmRleGVzLmNoYW5nZUdCMTgwMzAobylcclxuICAgICAgICBFbmNvZGluZ0luZGV4ZXMuaXNJbml0ID0gdHJ1ZVxyXG4gICAgICAgIC8vdGhpcy5jaGVjayhvLCBiYXNlNjRPbGQpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlpITnkIbph4zpnaLnmoTnibnmrormlbDnu4RcclxuICAgICAqIEBwYXJhbSBvIFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjaGFuZ2VHQjE4MDMwKG86IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHJ1bjogbnVtYmVyW10gPSBvWydnYjE4MDMwLXJhbmdlcyddXHJcbiAgICAgICAgY29uc3QgbmV3QXJyOiBhbnkgPSBbXVxyXG4gICAgICAgIGxldCBpOiBudW1iZXIgPSAwLFxyXG4gICAgICAgICAgICBsZW46IG51bWJlciA9IHJ1bi5sZW5ndGgsXHJcbiAgICAgICAgICAgIGE6IG51bWJlcltdXHJcbiAgICAgICAgd2hpbGUgKGkgPCBsZW4pIHtcclxuICAgICAgICAgICAgYSA9IFtdXHJcbiAgICAgICAgICAgIGEucHVzaChydW5baSsrXSlcclxuICAgICAgICAgICAgYS5wdXNoKHJ1bltpKytdKVxyXG4gICAgICAgICAgICBuZXdBcnIucHVzaChhKVxyXG4gICAgICAgIH1cclxuICAgICAgICBvWydnYjE4MDMwLXJhbmdlcyddID0gbmV3QXJyXHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBzdGF0aWMgY2hlY2sobzE6IGFueSwgbzI6IGFueSkge1xyXG4gICAgLy8gICAgIGZvciAoY29uc3Qga2V5IGluIG8yKSB7XHJcbiAgICAvLyAgICAgICAgIGlmIChvMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAvLyAgICAgICAgICAgICBsZXQgYTEgPSBvMVtrZXldXHJcbiAgICAvLyAgICAgICAgICAgICBsZXQgYTIgPSBvMltrZXldXHJcbiAgICAvLyAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGEyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhMVtpXSkgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgaWYgKGExW2ldWzBdICE9PSBhMltpXVswXSB8fCBhMVtpXVsxXSAhPT0gYTJbaV1bMV0pIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfoioLngrkga2V5OicgKyBrZXkgKyAn5peg5rOV5a+55bqU5bqP5Y+3IDogJyArIGkgKyAnIOWAvCA6ICcsIGExW2ldLCAnIOmcgOimgeWAvCcsIGEyW2ldKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGExKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYTIpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGlmIChhMVtpXSAhPT0gYTJbaV0pIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfoioLngrkga2V5OicgKyBrZXkgKyAn5peg5rOV5a+55bqU5bqP5Y+3IDogJyArIGkgKyAnIOWAvCA6ICcsIGExW2ldLCAnIOmcgOimgeWAvCcsIGEyW2ldKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGExKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYTIpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfnvLrlsJFLZXkgOiAnICsga2V5LCBvMSlcclxuICAgIC8vICAgICAgICAgICAgIHJldHVyblxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0t5qCh6aqM5a6M5oiQLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBzZXRBcnJheShvOiBhbnkpOiBbXVtdIHtcclxuICAgICAgICBjb25zdCBhOiBbXVtdID0gW11cclxuICAgICAgICBjb25zdCBzOiBzdHJpbmcgPSAnYmlnNSxldWMta3IsZ2IxODAzMCxnYjE4MDMwLXJhbmdlcyxqaXMwMjA4LGppczAyMTIsaWJtODY2LGlzby04ODU5LTIsaXNvLTg4NTktMyxpc28tODg1OS00LGlzby04ODU5LTUsaXNvLTg4NTktNixpc28tODg1OS03LGlzby04ODU5LTgsaXNvLTg4NTktMTAsaXNvLTg4NTktMTMsaXNvLTg4NTktMTQsaXNvLTg4NTktMTUsaXNvLTg4NTktMTYsa29pOC1yLGtvaTgtdSxtYWNpbnRvc2gsd2luZG93cy04NzQsd2luZG93cy0xMjUwLHdpbmRvd3MtMTI1MSx3aW5kb3dzLTEyNTIsd2luZG93cy0xMjUzLHdpbmRvd3MtMTI1NCx3aW5kb3dzLTEyNTUsd2luZG93cy0xMjU2LHdpbmRvd3MtMTI1Nyx3aW5kb3dzLTEyNTgseC1tYWMtY3lyaWxsaWMnXHJcbiAgICAgICAgbGV0IHQ6IHN0cmluZyA9ICcnXHJcbiAgICAgICAgbGV0IGw6IG51bWJlciA9IHMubGVuZ3RoXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHNbaV0gPT09ICcsJykge1xyXG4gICAgICAgICAgICAgICAgb1t0XSA9IFtdXHJcbiAgICAgICAgICAgICAgICBhLnB1c2gob1t0XSlcclxuICAgICAgICAgICAgICAgIHQgPSAnJ1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdCArPSBzW2ldXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgb1t0XSA9IFtdXHJcbiAgICAgICAgYS5wdXNoKG9bdF0pXHJcbiAgICAgICAgcmV0dXJuIGFcclxuICAgIH1cclxufSJdfQ==