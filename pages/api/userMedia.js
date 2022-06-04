const axios = require('axios');
export default async function handler(req, res) {
    // console.log(req.body)
    let variables
    if(req.method === 'GET'){
        variables=req.query.variables

    }else{
        variables=req.body.variables

    }

    res.setHeader('Access-Control-Allow-Origin', '*');

    let respons=await axios.get('https://twitter.com/i/api/graphql/rd5YEAV4HyrN-p2WqfZZ5Q/UserMedia', {
      params:{
          variables
      }
    })
    res.json(respons)
}
