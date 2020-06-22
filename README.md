# what's this

it's teamplate export a single html with webpack,nodejs, make images to base64 to show,
and with .mview model.

# rules

- imgs
  dir collect image

- model
  dir collect .mview etc

# use

```$javascript
npm install
npm run build

// export  dist/index.html
// make wallper 3d picture,change webpack.config.js 'index.html' to '*template.html'

```

global variable on window

[filename]\_model - model object,if imgs dir have scene.mview

eg. scene_model

[filename]\_img - image object,if imgs dir have show.png

eg. show_img

# Preview

![image.png](https://i.loli.net/2020/06/20/u8rftObwxcnqMg3.png)
