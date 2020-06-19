const fs = require('fs');

let CustomPlugin = function (options) {
    options = options || {};
    this.options = options;
}


CustomPlugin.prototype.apply = function (compiler) {


    // 如果希望在生成的资源输出到output指定目录之前执行某个功能
    compiler.hooks.emit.tap('ProcessControl',()=>{

    });

    // 编译完成之后
    compiler.hooks.done.tap('ProcessControl',()=>{
        console.log('--------------done--------------');
    })
};


module.exports = CustomPlugin;


