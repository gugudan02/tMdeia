const axios = require('axios');
// const tunnel = require("tunnel");
// const agent = tunnel.httpsOverHttp({
//     proxy: {
//         host: '127.0.0.1',
//         port: 27336,
//     }
// });
export default async function handler(req, res) {
    // console.log(req.body)
    let variables
    if (req.method === 'GET') {
        variables = req.query.variables

    } else {
        variables = req.body.variables

    }

    res.setHeader('Access-Control-Allow-Origin', '*');

    variables=encodeURIComponent(variables)
    // console.log(variables)
    let respons = await axios.get('https://twitter.com/i/api/graphql/rd5YEAV4HyrN-p2WqfZZ5Q/UserMedia', {
        params: {
            variables
        },
        // httpsAgent: agent,

        headers: {
            // 'Connection': 'keep-alive',
            'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
            'Accept': '*/*',
            'Content-type': 'application/json',
            'Cookie': '_ga=GA1.2.1011694155.1630153111; G_ENABLED_IDPS=google; dnt=1; kdt=tn8Ks2NvwvvfCWbaLI89Ul5GuoL6JA77A7sKnRPP; _gid=GA1.2.126827924.1630679938; _sl=1; lang=zh-cn; _mb_tk=d73519a00d5711ec8919873aad885f9d; ads_prefs="HBISAAA="; auth_multi="972297192806297600:ca88efa772369475f694c51d2d88515664769cc8"; auth_token=4ba502d027f8341316aaf06280150104bcf09f57; personalization_id="v1_sa7++FZ5LXSNGAkKMRvuYw=="; guest_id=v1:163074314929704055; twid=u=1140540417605115905; ct0=022578e85bf014c777b0e8e36ba92ddfa913fc25a6458029b5a983b2e1dbf1303bac3698931ed955610cd90cb22e29f8e863f8406b06718fc582c0497b2aea7c5f1d2c965e6752298aa5cf70707d17af',
            'X-csrf-token': '022578e85bf014c777b0e8e36ba92ddfa913fc25a6458029b5a983b2e1dbf1303bac3698931ed955610cd90cb22e29f8e863f8406b06718fc582c0497b2aea7c5f1d2c965e6752298aa5cf70707d17af'
        },
    })
    res.json(respons)
}
