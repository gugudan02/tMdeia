import axios from "axios";


import fs from 'fs'
async function getLargeVideo(){
    let {data} = await axios.get('https://tmedia.vercel.app/api/t2?type=large&url=https://video.twimg.com/ext_tw_video/1529280920217616384/pu/vid/1280x720/WP2aU07oQp6_Zs4z.mp4?tag=12',{
        timeout:18000,
    })
    console.log(data)
    let {chunkNum} = data
    let bufferObj={}
    let promiseArr=[]
    for(let i=0;i<chunkNum;i++){
        promiseArr.push(chunkDownload(i,bufferObj))
    }
    await Promise.all(promiseArr)
    // console.log(bufferObj)
    fs.writeFile('./t.mp4', Buffer.concat(Object.values(bufferObj)), function(err) {
        if(err) {console.log(err)}
    });


}
async function chunkDownload(index,bufferObj){
    try {
        let {data} = await axios.get('https://tmedia.vercel.app/api/t2?type=buffer&index='+index,{
            timeout:18000,
            responseType:'arraybuffer',
        })
        bufferObj[index]=data
    }catch (e) {
        console.log(e)
    }

}

getLargeVideo()
