/**
 * build后自动打包
 */

var fs = require('fs');
var archiver = require('archiver');

function bundleCompress(path) {
  fs.exists('bundles', function (exist) {
    if (!exist) {
      fs.mkdir('bundles', function () {
        bundle(path)
      })
    }else{
      bundle(path)
    }
  })
}

function bundle(path){
  let date =  new Date(),
    hours = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();

  let fileName = 'XXXX系统-'+date.toLocaleDateString().replace(/\-/g,'')+hours+min+sec;
  let output = fs.createWriteStream('./bundles/' + fileName + '.zip');
  let archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  // pipe archive data to the file
  archive.pipe(output);

  archive.directory(path, fileName);
  // archive.directory(path, 'new-subdir');
  archive.finalize();
}

module.exports = bundleCompress