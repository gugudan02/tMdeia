// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');
export default async function handler(req, res) {
  // console.log(req.query)
  let {url, type,index} = req.query

  if(type==='buffer'){
    res.setHeader('Content-Length', Buffer.concat(bigFile.temp[index]).length)
    res.end(Buffer.concat(bigFile.temp[index]));
  }else if(type==='large'){
    let res2 = await axios.get(url.toString(), {
      responseType: "stream"
    })
    stream2buffer(res2.data,type).then(() => {
      res.json({
        isDone:bigFile.isDone,
        chunkNum:bigFile.temp.length,
      });
    })
  }
  else{
    let res2 = await axios.get(url.toString(), {
      responseType: "stream"
    })
    // const writer = fs.createWriteStream('test2.png');
    // res2.data.pipe(writer);
    stream2buffer(res2.data).then(buffer => {
      if (type === 'pic') {
        res.setHeader('Content-Type', 'image/png');
      } else {

        res.setHeader('Content-Type', 'video/mp4');
      }
      res.setHeader('Content-Length', buffer.length);
      res.end(buffer);
    })
  }



}


function stream2buffer(stream,type) {


  return new Promise((resolve, reject) => {

    const _buf = [];

    stream.on("data", (chunk) => {
      // console.log(chunk)
      _buf.push(chunk)
    });
    stream.on("end", () => {
      if(type==='large'){
        bigFile.temp=[]
        bigFile.temp=getNewArray(_buf,150)
      }
      resolve(Buffer.concat(_buf))
    });
    stream.on("error", (err) => reject(err));

  });
}

/** 定义一个函数 **/
function getNewArray(arr, size){  // size=5，要分割的长度
  const arrNum = Math.ceil(arr.length/size, 10); // Math.ceil()向上取整的方法，用来计算拆分后数组的长度
  let index = 0; // 定义初始索引
  let resIndex = 0; // 用来保存每次拆分的长度
  const result = [];
  while(index< arrNum){
    result[index]= arr.slice(resIndex,size+resIndex);
    resIndex += size;
    index++;
  }
  return result;
}



let bigFile={
  temp:[],
  isDone:false,
}
