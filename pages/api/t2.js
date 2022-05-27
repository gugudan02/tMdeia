// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');
export default async function handler(req, res) {
    // console.log(req.body)
    let {url, type, index} = req.body
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        if (type === 'buffer') {
            res.statusCode = 200;
            res.setHeader('Content-Length', Buffer.concat(bigFile.temp[index]).length)
            res.end(Buffer.concat(bigFile.temp[index]));
        } else if (type === 'large') {
            let res2 = await axios.get(url.toString(), {
                responseType: "stream",
            })
            stream2buffer(res2.data, type).then(() => {
                res.statusCode = 200;
                let replyJson={
                    isDone: bigFile.isDone,
                    chunkNum: bigFile.temp.length,
                }
                bigFile.temp.forEach((item, index) => {
                    replyJson[`chunk${index}`] = getArrayLength(index)
                })
                res.json(replyJson)
                res.end()
            })
        } else {
            let res2 = await axios.get(url.toString(), {
                responseType: "arraybuffer"
            })
            if (type === 'pic') {
                res.setHeader('Content-Type', 'image/png');
            } else {

                res.setHeader('Content-Type', 'video/mp4');
            }
            res.setHeader('Content-Length', res2.data.length);
            res.statusCode = 200;
            res.end(res2.data);
        }
    } catch (e) {
        res.statusCode = 500;
        res.end(e.toString());
    }


}


function getArrayLength(index) {
    let initialValue = 0
    return bigFile.temp[index].reduce((a, b) => a + b.length, initialValue)
}

function stream2buffer(stream, type) {


    return new Promise((resolve, reject) => {

        const _buf = [];

        stream.on("data", (chunk) => {
            // console.log(chunk)
            _buf.push(chunk)
        });
        stream.on("end", () => {
            if (type === 'large') {
                bigFile.temp = []
                bigFile.temp = getNewArray(_buf, 150)
            }
            resolve(Buffer.concat(_buf))
        });
        stream.on("error", (err) => reject(err));

    });
}

/** 定义一个函数 **/
function getNewArray(arr, size) {  // size=5，要分割的长度
    const arrNum = Math.ceil(arr.length / size, 10); // Math.ceil()向上取整的方法，用来计算拆分后数组的长度
    let index = 0; // 定义初始索引
    let resIndex = 0; // 用来保存每次拆分的长度
    const result = [];
    while (index < arrNum) {
        result[index] = arr.slice(resIndex, size + resIndex);
        resIndex += size;
        index++;
    }
    return result;
}


let bigFile = {
    temp: [],
    isDone: false,
}
