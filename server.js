var express = require('express');
var app = express();
var fs= require('fs'); 
var requestJS = require('request');
var qs = require('querystring');
var config = {
	captcha1: 'http://douban.fm/j/new_captcha',
	captcha2: 'http://douban.fm/misc/captcha?size=m&id='
};
var options = {
    url: 'http://douban.fm/j/new_captcha',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36',
        'Host': 'douban.fm'
    }
};
var captcha = '';
app.get('/douban', function (req, res) {
    options.url = config.captcha1;
    requestJS(options, function (error, response, body) {
        captcha = body;
        options.url = (config.captcha2 + body.toString()).replace(/\"/g,'');
        console.log(options.url);
        requestJS(options).pipe(res);
    })
})

app.post('/doubanlogin', function (req, res) {
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var post = qs.parse(body);
        var form = post;
        form.captcha_id = captcha.replace(/\"/g,'');
        options.url = 'http://douban.fm/j/login';
        options.form = form;
        console.log(form);
        requestJS.post(options, function (error, response, body) {
            body = JSON.parse(body);
            options.headers.fmNlogin = body.fmNlogin;
        })
    });
})

app.use(express.static(__dirname + '/public/'));


app.listen('18080');