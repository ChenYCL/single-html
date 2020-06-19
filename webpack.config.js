const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const path = require('path')
const fs = require('fs')


// 获取模型路径
let modelOBJ = {}
let modelArr = fs.readdirSync('./model')
modelArr.map((filename, idx) => {
    // 模型转 base64
    var buff = fs.readFileSync(`./model/${filename}`)
    var base64data = buff.toString('base64')
    modelOBJ[filename.substr(0, filename.lastIndexOf('.'))] = base64data;
    console.log(base64data)
})
console.log('\n模型转换完毕...\n');
console.log(modelArr, '-----')

// 图片转base64
let imgOBJ = {}
let imgArr = fs.readdirSync('./imgs')
imgArr.map((filename, idx) => {
    // 模型转 base64
    var buff = fs.readFileSync(`./imgs/${filename}`)
    var base64data = Buffer.from(buff, 'binary').toString('base64')
    imgOBJ[filename.substr(0, filename.lastIndexOf('.'))] = base64data;
    console.log(base64data)
})
console.log('\n图片转换完毕...开始打包\n');


module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'all.bundle.js',
    },
    mode: 'production',
    module: {
        rules: [
            {test: /\.txt$/, use: 'raw-loader'},
            {test: /\.css$/, use: 'css-loader'},
            {test: /\.css$/, use: 'style-loader'},
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
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            title: 'MineX 教学',
            templateParameters: {
                myscript: (() => {
                    const d = fs.readFileSync('./dist/all.bundle.js', async (err, data) => {
                        // console.log(data)
                        return data;
                    })
                    return d;
                })(),
                model_base64_data: (() => {
                    let script = ''
                    for (key in modelOBJ) {
                        script += `var ${key}Model = "${modelOBJ[key]}";\n`
                    }
                    return script;
                })(),
                images_base64_data: (() => {
                    let script = ''
                    for (key in imgOBJ) {
                        script += `var ${key}_img = "${imgOBJ[key]}";\n`
                    }
                    return script;
                })(),
            },
            inject: false,
            // minify: {
            //     removeComments: true,
            //     collapseWhitespace: true,
            //     collapseInlineTagWhitespace: true
            // }
            minify: true
        }),

    ]
};