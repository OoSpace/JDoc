/*
 * @Author: oospace
 * @Date:   2015-05-16 10:25:09
 * @Last Modified by:   oospace
 * @Last Modified time: 2017-05-16 16:27:54
 */
var gulp = require('gulp');//  引入 gulp
var runSequence = require('run-sequence');//让gulp任务，可以相互独立，解除任务间的依赖，增强task复用
var browserSync = require('browser-sync').create();// browser-sync 实时刷新
var sourcemaps = require('gulp-sourcemaps');// 源码压缩之后不易报错定位  sourcemaps用于错误查找
var minifycss = require('gulp-minify-css');// 压缩css
var rpath = require("path");
var autoprefixer = require('gulp-autoprefixer');// 处理浏览器私有前缀
var babel = require('gulp-babel');// 编译ES6语法
var uglify = require('gulp-uglify');// 压缩js
var fs = require('fs');
var del = require('del');
var promise = require('promise');
var imagemin = require('gulp-imagemin');// 压缩图片
var contentIncluder = require('gulp-content-includer');//通过includer导入方式导入不同的模块
var cache = require('gulp-cache');//清除缓存
var rev = require('gulp-rev-append');//添加MD5
var postcss = require('gulp-postcss');//处理css
var cssnext = require('cssnext');//使用CSS未来的语法
var precss = require('precss');//编写Sass的函数


var developPath = "../src/";
var buildPath = "../dist/";

//获取文件夹下所有的文件名字并返回一个数组
var readFileNameList=function (path) {
    var result=[];
    function finder(path) {
        var files=fs.readdirSync(path);
        files.forEach(function (val,index){
            var fPath=rpath.join(path,val);
            var stats=fs.statSync(fPath);
            if(stats.isDirectory()) finder(fPath);
            if(stats.isFile()) result.push(fPath.toString().split("\\").join("/"));
        });

    }
    finder(path);
    console.log(result);
    return result;
}
//等待异步完成以后再调用
/*var runAsync=function(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        runSequence("clean",'css', "html", "js", "images");
    });
    return p;
}*/


// 编译压缩css 输出到目标目录
gulp.task('css', function () {
    var processors = [
        autoprefixer,
        cssnext,
        precss
    ];
    gulp.src([developPath + '**/*.css', buildPath + '**/*.css'])
        .pipe(postcss(processors))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true
        }))
        .pipe(minifycss())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath))
        //.pipe(browserSync.stream());
})

// 编译压缩js 输出到目标目录
gulp.task('js', function () {
    gulp.src([developPath + '**/*.js', buildPath + '**/*.js'])
        /*.pipe(babel({
            presets: ['es2015']
        }))*/
        .pipe(uglify({
            mangle: true, //fasle不混淆变量名 true为混淆
            preserveComments: 'some' //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
        }))
        .pipe(gulp.dest(buildPath))
        //.pipe(browserSync.stream());
});

// 图片压缩  输出到目标目录
gulp.task('images', function () {
    gulp.src([developPath + '**/*.*', buildPath + '**/*.*'])
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            interlaced: true,
            progressive: true
        })))
        .pipe(gulp.dest(buildPath))
        //.pipe(browserSync.stream());
});

// 拷贝 html
gulp.task('html', function () {
    gulp.src([developPath + '**/*.html', buildPath + '**/*.html'])
    /* .pipe(contentIncluder({
     includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
     }))*/
        .pipe(rev())
        .pipe(gulp.dest(buildPath))
        //.pipe(browserSync.stream());
});
gulp.task('clean', function () {
    var filePathList=readFileNameList(buildPath);
    for(var i=0;i<filePathList.length;i++){
        fs.unlink(filePathList[i]);
    }
})

// 静态服务器 + 监听 scss/html/js/images 文件
gulp.task('server', function () {
    browserSync.init({
        server: buildPath,
    });

    gulp.watch(developPath + "**/*").on('change', function () {
        runSequence('css', "html", "js", "images",function(){
            setTimeout(function () {
                browserSync.reload(buildPath)
            },1000)
        });
    });
});


//执行默认任务
gulp.task('default', function () {
    runSequence("clean",'css', "html", "js", "images","server");
 });