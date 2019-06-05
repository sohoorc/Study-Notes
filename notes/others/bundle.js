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
    } else {
      bundle(path)
    }
  })
}

function bundle(path) {
  let date = new Date(),
    year = date.getFullYear(),
    mounth = date.getMonth() + 1,
    day = date.getUTCDate(),
    hours = date.getHours(),
    min = date.getMinutes();

  mounth = mounth < 10 ? '0' + mounth : mounth;
  day = date < 10 ? '0' + day : day;
  hours = hours < 10 ? '0' + hours : hours;

  let fileName = 'xxxx-' + year+'_'+mounth+'_'+day+'_'+hours+'_'+min;
  let output = fs.createWriteStream('./bundles/' + fileName + '.zip');
  let archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  archive.pipe(output);

  archive.directory(path, fileName);
  archive.finalize();
}

module.exports = bundleCompress