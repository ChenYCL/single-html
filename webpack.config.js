const HtmlWebpackPlugin = require('html-webpack-plugin'); // installed via npm
const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProcessControlPlugin = require('./ProcessControlPlugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const CopyPlugin = require('copy-webpack-plugin');

console.log('Build process is starting');
// try {
//   fs.unlinkSync('outputDir/index.html')
//   //file removed
// } catch(err) {
//   console.error(err)
// }

let modelOBJ = {};
let modelArr = fs.readdirSync('./model');
modelArr.map((filename, idx) => {
  // 模型转 base64
  var buff = fs.readFileSync(`./model/${filename}`);
  var base64data = buff.toString('base64');
  modelOBJ[filename.substr(0, filename.lastIndexOf('.'))] = base64data;
  //console.log(base64data);
});
console.log('\n模型转换完毕...\n');


let mp3OBJ = {};
let mp3Arr = fs.readdirSync('./music');
mp3Arr.map((filename, idx) => {
  // 模型转 base64
  var buff = fs.readFileSync(`./music/${filename}`);
  var base64data = buff.toString('base64');
  mp3OBJ[filename.substr(0, filename.lastIndexOf('.'))] = base64data;
  // console.log(base64data);
});
console.log('\n音频转换完毕...\n');

// image -> base64
let imgOBJ = {};
let imgArr = fs.readdirSync('./imgs');
imgArr.map((filename, idx) => {
  // 模型转 base64
  var buff = fs.readFileSync(`./imgs/${filename}`);
  var base64data = Buffer.from(buff, 'binary').toString('base64');
  imgOBJ[filename.substr(0, filename.lastIndexOf('.'))] = base64data;
  //console.log(base64data);
});
console.log('\n图片转换完毕...开始打包\n');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'outputDir'),
    filename: 'all.bundle.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 99999999999999999,
              name: 'images/[name]-[hash:8].[ext]',
            },
          },
        ],
      },
      // {
      //     test: /\.js$/i,
      //     loader: "file-loader",
      // },
      { test: /\.txt$/, use: 'raw-loader' },
      { test: /\.css$/, use: 'css-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: 'style-loader', exclude: /node_modules/ },
    ],
  },
  plugins: [
    new ProcessControlPlugin(),
    // new ParallelUglifyPlugin({
    //     cacheDir: "./node_modules/cache/",
    //     uglifyJS: {
    //         output: {
    //             comments: false,
    //         },
    //         warnings: false,
    //     },
    // }),

    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      title: "it's a template1",
      inject: false,
      templateParameters: {
        // 模型注入
        model_base64_data: (() => {
          let script = '';
          for (key in modelOBJ) {
            script += `var ${key}_model = "${modelOBJ[key]}";\n`;
          }
          return script;
        })(),
        // 图片注入
        images_base64_data: (() => {
          let script = '';
          for (key in imgOBJ) {
            script += `var ${key}_img = "${imgOBJ[key]}";\n`;
          }
          return script;
        })(),
        // 音频注入
        mp3_base64_data: (() => {
          let script = '';
          for (key in mp3OBJ) {
            script += `var ${key}_mp3 = "${mp3OBJ[key]}";\n`;
          }
          return script;
        })(),
        myscript: (() => {
          const d = fs.readFileSync(
            'outputDir/all.bundle.js',
            async (err, data) => {
              return data;
            }
          );
          return d;
        })(),
      },
      // minify: {
      //     //删除html空格
      //     collapseWhitespace: true,
      //     //尽可能使用直接Unicode字符
      //     decodeEntities: true,
      //     //指定最大行长度。压缩输出将在有效的HTML分割点按换行符分割
      //     // maxLineLength:30,
      //     //在样式元素和样式属性中缩小CSS（使用clean-css）
      //     minifyCSS: true,
      //     //缩小脚本元素和事件属性中的JavaScript（使用UglifyJS）
      //     minifyJS: true,
      //     //尽可能删除属性周围的引号
      //     removeAttributeQuotes: true,
      //     //删除内容为空的属性
      //     removeEmptyAttributes: true,
      // },
    }),

    // new CopyPlugin({
    //     patterns: [
    //         {from: './outputDir/index.html', to: './dist/'}
    //     ]
    // }),
  ],
};
