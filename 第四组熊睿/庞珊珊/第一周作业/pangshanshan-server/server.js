#!/usr/bin/env node
/*
 * 启动一个http服务器
 * 并且能自动响应当前目录（执行该命令的目录）下面的静态文件
 * npm publish发布之后，可在任意目录下访问：pangshanshan-server port   (port为端口号，可以输入也可以省略)
 *
 *     不引用index.html
 *
 * */
var http = require("http");
var mime = require("mime");
var fs = require("fs");
var path = require("path");
var port = process.argv[2]?parseInt(process.argv[2]):8080;  //用户可自定义端口号
var html ='<!DOCTYPE html><html><head lang="en"><meta charset="UTF-8"><title></title></head><body><div></div></body></html>';
var server = http.createServer(function(req,res){
    if(req.url == "/"){
        var str = "<ul>";
        fs.readdir(".", function (err,files) {
            files.forEach(function (file) {
                str += "<li><a href='/"+file+"'>"+file+"</a></li>";
            });
            str += "</ul>";
            //fs.readFile("./index.html","utf8",function(err,data){
            //    data = data.replace("<div></div>",str);
            //    res.end(data);
            //});
            html = html.replace("<div></div>",str);
            res.end(html);
        });
    }else{
        //判断当前目录是否存在该文件，脚本在哪个文件下执行则当前目录就在哪里
        fs.exists(req.url.slice(1),function(exists){  //req.url.slice(1)：去掉/
            if(exists){ //判断是文件还是文件夹
                fs.stat(req.url.slice(1),function(err,stat){
                    if(stat.isFile()){
                        res.setHeader("Content-Type",mime.lookup(req.url)+";charset=utf-8");
                        fs.readFile(req.url.slice(1), function (err,data) {
                            res.end(html);
                        });
                    }else { //如果是目录
                        fs.readdir(req.url.slice(1),function(err,subfiles){
                            //以下代码同req.url == "/"
                            var str = "<ul>";
                            subfiles.forEach(function (file) {
                                str += "<li><a href='"+path.join(req.url,file)+"'>"+file+"</a></li>";
                            });
                            str += "</ul>";
                            //fs.readFile("./index.html","utf8",function(err,data){
                            //    data = data.replace("<div></div>",str);
                            //    res.end(data);
                            //});
                            html = html.replace("<div></div>",str);
                            res.end(html);
                        });
                    }
                });

            }else{
                res.end("not found!");
            }
        });
    }
});
server.listen(port, function () {
    console.log("服务器在"+port+"端口启动");
    //若在命令行执行：在该文件的目录下打开命令行node server.js 9090
});