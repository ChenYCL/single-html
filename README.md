# what's this

it's teamplate export a single html with webpack,nodejs, make images to base64 to show,
and with .mview model.

可以将图片和模型导出为完整html，配合wallperEngine 可做壁纸，使用ModelView_WallpaperEngine_templatee.html模版导出

## [model demo](https://github.com/ChenYCL/single-html/tree/wallpaper)

# rules

- imgs
  dir collect image
  
  放置图片的文件夹，将会自动打包

- model
  dir collect .mview etc
  
  放置模型的文件夹，将会自动打包

# use

```$javascript
npm install
npm run fix-memory-limit
npm run build // normal
npm run wallper // for wallper engine

// export  dist/index.html 
// 导出位置 dist/index.htl
// make wallper 3d picture,change webpack.config.js 'index.html' to '*template.html'
// 如果需要壁纸配置请使用ModelView_WallpaperEngine_template.html,wepback.config.js 中修改 83 行 template: "ModelView_WallpaperEngine_template.html",

```

global variable on window

[filename]\_model - model object,if imgs dir have scene.mview

模型变量 文件名_model

eg. scene_model

[filename]\_img - image object,if imgs dir have show.png

图片变量 文件名_img

eg. show_img

# Preview

![image.png](https://i.loli.net/2020/06/20/u8rftObwxcnqMg3.png)

## wallpaper_engine 

![image.png](https://github.com/ChenYCL/single-html/blob/master/example/image_2020-06-22_21-38-48.png)
