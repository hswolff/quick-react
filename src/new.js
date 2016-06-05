const fse = require('fs-extra');
const path = require('path');
const scaffoldPath = path.join(__dirname, 'scaffold');

module.exports = function newApp(fullPath) {
  try {
    fse.copySync(scaffoldPath, fullPath);
    console.log('New quick react app created.')
    console.log('Now run:');
    console.log('npm install && quick-react start client.js');
  } catch (err) {
    console.error(err)
  }
}