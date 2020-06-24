const fs = require("fs");
const path = require("path");

let CustomPlugin = function(options) {
    options = options || {};
    this.options = options;
};

CustomPlugin.prototype.apply = function(compiler) {
    // 如果希望在生成的资源输出到output指定目录之前执行某个功能
    compiler.hooks.emit.tap("ProcessControl", () => {});

    // 编译完成之后
    compiler.hooks.done.tap("ProcessControl", () => {
        // 执行一次图片封装解析
        var sourceFile = path.join(__dirname, "outputDir/index.html");
        var destPath = path.join(__dirname, "dist", "index.html");
        var readStream = fs.createReadStream(sourceFile);
        var writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);
        console.log("move done");
        try {
            fs.unlinkSync("outputDir/index.html");
            //file removed
        } catch (err) {
            console.error(err);
        }
    });
};

module.exports = CustomPlugin;