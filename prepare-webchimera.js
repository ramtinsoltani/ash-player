const path = require('path');
const fs = require('fs');
const decompress = require('decompress');
const packageJson = {
  "name": "webchimera.js",
  "description": "libvlc binding for node.js/io.js/NW.js/Electron",
  "main": "index.js",
  "version": "0.3.1",
  "license": "LGPL-2.1",
  "author": "Sergey Radionov <rsatom@gmail.com>",
  "keywords": [
    "vlc",
    "libvlc",
    "video",
    "player",
    "wcjs"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/RSATom/WebChimera.js"
  }
};

if ( ! ['win32', 'darwin'].includes(process.platform) )
  return console.error('Platform not supported!');

if ( fs.existsSync(path.join(__dirname, 'webchimera.js')) )
  return console.log('webchimera.js is already setup.');

decompress(`WebChimera.js_prebuilt_${process.platform === 'win32' ? 'win.zip' : 'osx.tar.gz'}`, '.')
.then(() => {

  fs.writeFileSync(path.join(__dirname, 'webchimera.js', 'package.json'), JSON.stringify(packageJson, null, 2));

  console.log(`webchimera.js is prepared for platform ${process.platform}`);

})
.catch(error => console.error(error));
