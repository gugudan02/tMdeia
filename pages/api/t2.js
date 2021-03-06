// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');
export default async function handler(req, res) {
    // console.log(req.body)
    let url,type,index
    if(req.method === 'GET'){
        url=req.query.url
        type=req.query.type
        index=req.query.index
    }else{
        url=req.body.url
        type=req.body.type
        index=req.body.index
    }

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        if (type === 'buffer') {
            res.statusCode = 200;
            res.setHeader('Content-Length', Buffer.concat(bigFile.temp[index]).length)
            res.end(Buffer.concat(bigFile.temp[index]));
        } else if (type === 'large') {
            bigFile.temp=[]
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
        let _size = 0;
        let temp = []
        stream.on("data", (chunk) => {
            // console.log(chunk)
            if(type === 'large'){
                if(_size<=3*1024*1024){
                temp.push(chunk)
                _size += chunk.length
                }else{
                    bigFile.temp.push(temp)
                    temp = [chunk]
                    _size = chunk.length
                }
            }
            _buf.push(chunk)
        });
        stream.on("end", () => {
            if (type === 'large') {
                bigFile.temp.push(temp)
            }
            _size = null
            temp = null
            resolve(Buffer.concat(_buf))
        });
        stream.on("error", (err) => reject(err));

    });
}

let bigFile = {
    temp: []
}
