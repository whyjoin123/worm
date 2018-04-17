

var https = require('https');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var url ="https://www.haoche.cn/pic/newcar/3170.html";
function fetchPage(x) {     //封装了一层函数
    startRequest(x);
};
function startRequest(x) {
    https.get(x,function(res){
        var html = '';//用来装html内容
        var titles= [];
        res.setEncoding('utf-8'); //防止中文乱码
        //监听data事件，每次取一块数据
        res.on('data', function (chunk) {
            html += chunk;
        });
        res.on('end', function () {
            console.log(html);
            var $ = cheerio.load(html); //采用cheerio模块解析html
            //每一个车型名字
            var news_title = $('.car-item li a ').text().trim();
            console.log(news_title)
            savedImg($,news_title);    //存储每篇文章的图片及图片标题

        });

    }).on('error', function (err) {
        console.log(err);
    })};

//该函数的作用：在本地存储所爬取到的图片资源
function savedImg($,news_title) {
    $('.car-item li a img').each(function (index, item) {
        var img_title = $(this).next().text().trim();  //获取图片的标题
        if(img_title.length>35||img_title==""){
            img_title="Null";}
        var img_filename = img_title + '.jpg';

        var img_src ="http:"+$(this).attr('data-original'); //获取图片的url

//采用request模块，向服务器发起一次请求，获取图片资源
        request.head(img_src,function(err,res,body){
            if(err){
                console.log("失败！谁来救救z3——clean");
            }
        });
        console.log(img_src);
        request(img_src).pipe(fs.createWriteStream('./carimg/' + img_filename));     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
    })
}
fetchPage(url);      //主程序开始运行