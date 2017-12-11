const http = require('http');
const  querystring = require('querystring');

const BASE = "http://www.chuangshouji.com/";
const proxy =  {
    proxyGet(req, response) {
        console.log(req.originalUrl);
        http.get(BASE + req.originalUrl, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.log(error);
                response.json(error);
                // consume response data to free up memory
                res.resume();
                return;
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    console.log(parsedData)
                    const parsedData = JSON.parse(rawData);
                    response.json(parsedData);
                } catch (e) {
                    console.error(e.message);
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });

    },
    proxyPost(request, response) {
        console.log(request.originalUrl);
        let postData = JSON.stringify(request.body);
        console.log(postData);
        if(!postData){
            return response.json({
                test:'1'
            });
        }
        var opt = {
            method: "POST",
            host: "www.chuangshouji.com",
            port: 80,
            path: request.originalUrl,
            headers: {
                "Accept":"application/json;charset=utf-8",
                "Content-Type": 'application/json',
                "Content-Length": Buffer.byteLength(postData)
            }
        };

        var req = http.request(opt, function (serverFeedback) {
            console.log(serverFeedback.statusCode);
            if (serverFeedback.statusCode == 200) {
                var body = "";
                serverFeedback.on('data', function (data) {
                    body += data;
                }).on('end', function () {
                    response.json(JSON.parse(body))
                });
            }
            else {
                response.json({
                    error:"1"
                })
            }
        });
        req.write(postData);
        req.end();

    }
}

export default proxy;