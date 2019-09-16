const path = require('path');
const gm = require('gm');
const fs = require('fs');

const imgHanding = function (imgPath, outputPath) {
  gm(imgPath).resize(1242,2208,"!").write(outputPath,(err,res)=>{
    if(err) throw err;
  })
}

const getFileDir = function (inputPath, outputPath) {
  fs.readdir(inputPath, (err, files) => {
    if (err) return err;
    files.forEach((fileName, index) => {
      const extname = path.extname(fileName)
      const regImgExt = /.png|.jpg|.jpeg/
      if (extname.match(regImgExt)) {
        const imgPath = path.resolve(inputPath) + '/' + fileName
        const optDir = path.resolve(outputPath)+ '/' +fileName
        imgHanding(imgPath, optDir)
      }
    })

  })
}

const inputPath = './static/input/'
const outputPath = './static/output/'

getFileDir(inputPath,outputPath)