/**
 * 快递鸟商户ID以及APIkey
 */
const API_ID = "1267209";
const API_KEY = "9d2de761-00b2-4ccc-b9fc-5982cabf1055";
/**
 * 引入模块
 */
const request = require('request');
const cheerio = require("cheerio");
const crypto = require("crypto");
const url = require("url");
const express = require("express");
const codeArr = require("./code.js")['codeArr'];

let reqExpress = (name, number,callback) =>
{
    if(!number){
        return {
            error:true,
            msg:"快递单号不能为空"
        }
    }
    let fex = codeArr.find(a => a['name'] === name||a['code'] === name);
    if(!fex) {
       return {
            error:true,
            msg:"请选择快递公司"
        }
    }
    let code=fex['code'];
    let data = {
        "OrderCode": "",
        "ShipperCode": code,
        "LogisticCode": number
    }
    let dataStr = JSON.stringify(data);
    let signBuffer = crypto.createHash('md5').update(dataStr + API_KEY).digest('hex').toString('base64');
    let signStr = new Buffer(signBuffer).toString('base64');
    request.post({
            url: "http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx",
            form: {
                EBusinessID: API_ID,
                RequestType: '1002',
                RequestData: dataStr,
                DataSign: signStr,
                DataType: '2'
            }
        }, callback
    )
}
let specNumber = (number,callback) =>
{
    if(!number){
        return {
            error:true,
            msg:"快递单号不能为空"
        }
    }
    let data = {
        "LogisticCode": number
    }
    let dataStr = JSON.stringify(data);
    let signBuffer = crypto.createHash('md5').update(dataStr + API_KEY).digest('hex').toString('base64');
    let signStr = new Buffer(signBuffer).toString('base64');
    request.post({
            url: "http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx",
            form: {
                EBusinessID: API_ID,
                RequestType: '2002',
                RequestData: dataStr,
                DataSign: signStr,
                DataType: '2'
            }
        }, callback
    )
}

var app = express();

/**
 * 传入快递公司名或编码，以及快递单号，获取快递详情
 */
app.get('/express', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    let name =req.query.name;
    let number =req.query.number;
    reqExpress(name,number,function (e, r, b) {
        if (!e) {
            console.log(b)
            res.end(b)
        }
        else {
            console.log(`error:${e}`)
        }
    });
});
/**
 * 传入快递单号，根据大数据判断快递公司名称
 */
app.get('/specNum', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    let number =req.query.number;
    specNumber(number,function (e, r, b) {
        if (!e) {
            console.log(b)
            res.end(b)
        }
        else {
            console.log(`error:${e}`)
        }
    });
});
//以上表示凡是url能够匹配/hello/*的GET请求，服务器都将向客户端发送字符串“Hello World"

//app.get('/', function(req, res){
// res.render('index', {
//    title: 'Express'
//  });
//});
//上面的代码意思是，get请求根目录则调用views文件夹中的index模板，并且传入参数title为“Express”，这个title就可以在模板文件中直接使用。


//现在可以绑定和监听端口了，调用app.listen()方法，接收同样的参数，比如：
app.listen(3030);
console.log('Listening on port 3030');
//reqExpress("顺丰快递","123213213");