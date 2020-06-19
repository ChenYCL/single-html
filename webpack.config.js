const HtmlWebpackPlugin = require("html-webpack-plugin"); // installed via npm
const path = require("path");
const fs = require("fs");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ProcessControlPlugin = require('./ProcessControlPlugin');


console.log('Build process is starting');
fs.exists('dist', err => {
    if (err) {
    } else {
        fs.mkdir('dist', (error) => {
            if (error) {

            } else {
                console.log('ok');
            }
        });
        fs.writeFile('dist/index.html', '', 'utf8', (error) => {
            if (error) {

            } else {
                console.log('ok');
            }
        });
        fs.writeFile('dist/all.bundle.js', '', 'utf8', (error) => {
            if (error) {

            } else {
                console.log('ok');

            }
        });
    }
});


var js ='';
let modelOBJ = {};
let modelArr = fs.readdirSync("./model");
modelArr.map((filename, idx) => {
    // 模型转 base64
    var buff = fs.readFileSync(`./model/${filename}`);
    var base64data = buff.toString("base64");
    modelOBJ[filename.substr(0, filename.lastIndexOf("."))] = base64data;
    console.log(base64data);
});
console.log("\n模型转换完毕...\n");

// image -> base64
let imgOBJ = {};
let imgArr = fs.readdirSync("./imgs");
imgArr.map((filename, idx) => {
    // 模型转 base64
    var buff = fs.readFileSync(`./imgs/${filename}`);
    var base64data = Buffer.from(buff, "binary").toString("base64");
    imgOBJ[filename.substr(0, filename.lastIndexOf("."))] = base64data;
    console.log(base64data);
});
console.log("\n图片转换完毕...开始打包\n");

module.exports = {
    entry: "./index.js",
    node: {
        __dirname: true
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "all.bundle.js",
        publicPath: "/"
    },
    mode: "production",
    module: {
        rules: [
            {test: /\.txt$/, use: "raw-loader"},
            {test: /\.css$/, use: "css-loader", exclude: /node_modules/},
            {test: /\.css$/, use: "style-loader", exclude: /node_modules/},
            {
                test: /\.(png|jpg|gif,jpeg,gif,svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10,
                        },
                    },
                ],
            }
        ],
    },
    plugins: [
        new ProcessControlPlugin(),
        new HtmlWebpackPlugin({
            template: "./index.html",
            title: "it's a template1",
            inject: false,
            templateParameters: {

                model_base64_data: (() => {
                    let script = "";
                    for (key in modelOBJ) {
                        script += `var ${key}Model = "${modelOBJ[key]}";\n`;
                    }
                    return script;
                })(),
                images_base64_data: (() => {
                    let script = "";
                    for (key in imgOBJ) {
                        script += `var ${key}_img = "${imgOBJ[key]}";\n`;
                    }
                    return script;
                })(),
                myscript: (() => {
                    function repeatRead() {
                        fs.readFileSync('dist/all.bundle.js', async (err, data) => {
                            if (err) {
                                repeatRead()
                            } else {
                                return data;
                            }
                        })
                    }

                    const d = fs.readFileSync('dist/all.bundle.js', async (err, data) => {
                        if (err) {
                            repeatRead()
                        } else {
                            return data;
                        }
                    });
                    return d;
                })(),
            },
            // minify: {
            //     removeComments: true,
            //     collapseWhitespace: true,
            //     collapseInlineTagWhitespace: true
            // }
            minify: true,
        },),
    ],
};
