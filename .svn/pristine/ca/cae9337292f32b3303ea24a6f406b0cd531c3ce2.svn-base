var config = require('./config');
const path = require('path');
var fs = require("fs");
var crypto = require('crypto');


var CHUNKSIZE = 1048576;

var chunkUploadFile = function(filepath){

    var namespace = "";
    var lastModifiedDate = getToday();
    var path = getPath(filepath);
    var filename = getFileName(filepath);
    var md5Str = md5(filename);
    var tmppath = path+"\\tmp" + "\\" + md5Str;
    //创建文件夹
    mkdirsSync(tmppath);
    //文件分片
    fileSplit(filepath, CHUNKSIZE, tmppath, '.part').then(async k => {
        var lastModifiedDate = getToday();
        //获取文件信息  文件大小
        var stats = fs.statSync(filepath);
        var size = stats.size;
        var fileFolder = md5(filename+lastModifiedDate+size);
        var chunks = getChunks(size);
        for(var i = 0; i < k; i++){

            var tempFilepath = tmppath + "/"+i+".part";
            var res = await syncUploadFile(tempFilepath,filename,chunks,fileFolder,i,lastModifiedDate,namespace,size);
            writeFileLog("文件："+filepath+"   上传进度:"+parseInt(((i+1)/chunks)*100)+"%");

            if(i == (k-1)){
                writeFileLog("合并请求");
                chunksMerge(filename,fileFolder,namespace,lastModifiedDate,size);
                writeFileLog("删除本地临时文件  文件目录："+tmppath);
                delDir(tmppath);
            }
        }
    }).catch(err => {
        console.log(err)
    })
}


/**
 * 写入日志文件
 * @param logInfo
 */
function writeFileLog(logInfo) {
    var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
    console.log(time + " --- :" + logInfo)
    fs.appendFileSync(config.uploadFileLogPath,time + " --- :" + logInfo+"\n");
}

/**
 * 删除文件
 * @param path
 */
function delDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}

/**
 * 创建文件
 * @param path
 * @returns {Promise}
 */
function createDir(path) {
    return new Promise(function (resolve,reject) {
        fs.exists(path, function (exists) {
            if(exists){
                //有文件
                resolve(exists);
            }else{
                //没有文件
                fs.mkdir(path,function(error){
                    if(error){
                        console.log(error);
                        return false;
                    }
                    console.log('创建目录成功');
                    resolve(exists);
                })
            }
        })
    });
}


function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

/**
 * 根据文件路径获取文件名
 * @param filepath
 * @returns {string}
 */
function getFileName(filepath) {
    return filepath.substring(filepath.lastIndexOf('/')+1, filepath.length);
}

/**
 * 根据文件路径获取文件夹
 * @param filepath
 * @returns {string}
 */
function getPath(filepath) {
    return filepath.substring(0, filepath.lastIndexOf('/') + 1);
}


/**
 * 同步分片文件上传
 * @param filepath
 * @param filename
 * @param chunks
 * @param fileFolder
 * @param i
 * @param lastModifiedDate
 * @param namespace
 * @param size
 * @returns {Promise}
 */
function syncUploadFile(filepath,filename,chunks,fileFolder,i,lastModifiedDate,namespace,size) {

    return new Promise(function (resolve,reject) {
        var stat = fs.statSync(filepath);
        chunkCheck(fileFolder,i,lastModifiedDate,namespace,stat.size,function(res) {

            var _body = JSON.parse(res.body);
            console.log(_body)
            if (_body.ifExist == "0") {
                //上传文件
                updateFile(filepath,filename,chunks,i,namespace,lastModifiedDate,size,function(res) {
                    var _body = JSON.parse(res.body);
                    console.log("文件未存在："+res.body)
                    resolve(_body);    //成功
                });
            }else{
                var _body = JSON.parse(res.body);
                console.log("文件已存在："+res.body)
                resolve(_body);
            }
        });
    });
}

/**
 * 检查分片文件是否上传
 * @param fileFolder
 * @param chunkIndex
 * @param lastModifiedDate
 * @param namespace
 * @param size
 * @param callback
 */
function chunkCheck(fileFolder,chunkIndex,lastModifiedDate,namespace,size,callback) {
    var formData = {
        "name":fileFolder,
        "status":"chunkCheck",
        "size":size,
        "chunkIndex":chunkIndex,
        "namespace":namespace,
        "lastModifiedDate":lastModifiedDate,
        "size":size
    };
    var _options = {
        method: 'POST',
        uri: config.uploadServer + '/api/fileUpload',
        qs: {
            guid: '***',
            rand: 1,
            time: 1,
            platform: 'server'
        },
        formData: formData
    }
    request(_options)
        .then(callback)
        .catch(function(err) {
            console.log(err)
        })
}

/**
 * 分片文件合成
 * @param filename
 * @param fileFolder
 * @param namespace
 * @param lastModifiedDate
 * @param size
 */
function chunksMerge(filename,fileFolder,namespace,lastModifiedDate,size) {
    var chunks = getChunks(size);
    let fileNameLen = filename.lastIndexOf(".");//取到文件名开始到最后一个点的长度
    let fileNameLength = filename.length;//取到文件名长度
    let fileFormat = filename.substring(fileNameLen + 1, fileNameLength);//截
    var ext = filename;
    var formData = {
        "name":fileFolder,
        "status":"chunksMerge",
        "chunks":chunks,
        "ext":fileFormat,
        "filename":filename,
        "size":size,
        "namespace":namespace,
        "type":"",
        "lastModifiedDate":lastModifiedDate,
        "size":size
    };
    var _options = {
        method: 'POST',
        uri: config.uploadServer + '/api/fileUpload',
        qs: {
            guid: '***',
            rand: 1,
            time: 1,
            platform: 'server'
        },
        formData: formData
    }
    request(_options)
        .then(function(res) {
            var _body = JSON.parse(res.body);
            if (!_body.errno) {
                var resinfo = JSON.parse(res.body);
                writeFileLog("合并请求结果：" + res.body);
                //保存录屏文件
                saveFile(filename);
            }
        })
        .catch(function(err) {
            console.log(err)
        })
}


function saveFile(filename) {
    var formData = {
        "realName":filename
    };
    var _options = {
        method: 'POST',
        uri: config.uploadServer + '/api/WebmFlileController/webmFile.do',
        qs: {
            guid: '***',
            rand: 1,
            time: 1,
            platform: 'server'
        },
        formData: formData
    }
    request(_options)
        .then(function(res) {
            var _body = JSON.parse(res.body);
            if (!_body.errno) {
                var resinfo = JSON.parse(res.body);
                console.log(resinfo);
                if (resinfo.state == "200") {
                    var fs = require('fs');
                    fs.unlinkSync("C:/luping/" + resinfo.fileRealName, function(err) {
                        if (err) throw err;
                    });
                }
                writeFileLog("录屏文件保存结果：" + res.body);
            }
        })
        .catch(function(err) {
            console.log(err)
        })
}
/**
 * 获取分片总数
 * @param fileSize
 * @returns {number}
 */
function getChunks(fileSize) {
    var chunks = 0;
    if (fileSize % CHUNKSIZE == 0) {
        chunks = fileSize / CHUNKSIZE;
    } else {
        chunks = (fileSize / CHUNKSIZE) + 1;
    }
    return parseInt(chunks);

}

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
function updateFile(filepath,filename,chunks,chunk,namespace,lastModifiedDate,size,callback) {
    var formData = {
        file: fs.createReadStream(filepath),
        "name":filename,
        "chunks":chunks,
        "chunk":chunk,
        "namespace":namespace,
        "type":"",
        "lastModifiedDate":lastModifiedDate,
        "size":size
    };
    var _options = {
        method: 'POST',
        uri: config.uploadServer + '/api/fileUpload',
        qs: {
            guid: '***',
            rand: 1,
            time: 1,
            platform: 'server'
        },
        formData: formData
    }
    request(_options)
        .then(callback)
        .catch(function(err) {
            console.log(err)
        })
}

/**
 * 获取md5值
 * @param str
 * @returns {PromiseLike<ArrayBuffer>}
 */
function md5(str){
    var md5 = crypto.createHash('md5');
    return md5.update(str).digest('hex');
}

Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 获取当天时间字符串
 * @returns {string}
 */
function getToday() {
    return new Date().Format("yyyyMMdd")
}

/**
 * 文件切片操作
 * @param inputFile
 * @param splitSize
 * @param outPath
 * @param ext
 * @returns {Promise}
 */
function fileSplit(inputFile, splitSize, outPath, ext) {
    let i = 0
    function copy(start, end, size) {
        return new Promise((resolve, reject) => {
            if (start >= size) {
                resolve()
            } else {
                if (end > size - 1) { end = size - 1 }
                const readStream = fs.createReadStream(inputFile, { start, end })
                let data = Buffer.from([])
                readStream.on('data', chunk => {
                    data = Buffer.concat([data, chunk])
                })
                readStream.on('end', async () => {
                    fs.writeFile(path.join(outPath, `${i}${ext}`), data, async err => {
                        if (err) { reject(err) }
                        i++
                        start = end + 1
                        end = end + splitSize
                        await copy(start, end, size)
                        resolve()
                    })
                })
                readStream.on('err', err => {
                    reject(err)
                })
            }
        })
    }
    return new Promise((resolve, reject) => {
        return fs.stat(inputFile, async (err, stat) => {
            if (err) { return reject(err) }

            const size = stat.size
            await copy(0, splitSize - 1, size)
            resolve(i)
        })
    })
}

exports.chunkUploadFile = chunkUploadFile

