// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');
export default async function handler(req, res) {
  console.log(req.query)
  let {url, type} = req.query
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


function stream2buffer(stream) {

  return new Promise((resolve, reject) => {

    const _buf = [];

    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(err));

  });
}
