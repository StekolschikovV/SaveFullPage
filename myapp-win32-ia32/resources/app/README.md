SaveFullPage (node.js + electron.atom.io)(alpha v.)
========
App for parsing websites and automatic uploading to FTP.
### Application functions:
 * Parsing of any site with all content (pictures, videos, scripts, styles)
 *  Download to ftp
 *  Ability to disable uploading videos
 *  Ability to configure FTP (port, password, login, dir)
 *  Automatic creation of the configuration file after any change. (Configurations are loaded when the application start)
### Running the application
To run, you need to execute a command
```
npm start
```
### Building an application into an executable file
To build the application you need to release the command
```
electron-packager . myapp --ignore="node_modules/(electron-packager|electron-p rebuilt)" --platform=win32 --arch=ia32 --version=0.36.3 --overwrite --asar=false
```
Or extract the files from the archive (SaveFullPage.zip)
### The application used packages:
 * [electron](https://www.npmjs.com/package/electron)
 * [website-scraper](https://www.npmjs.com/package/website-scraper)
 * [fs](https://www.npmjs.com/package/fs)
 * [jQuery](https://www.npmjs.com/package/jQuery)
 * [jsftp](https://www.npmjs.com/package/jsftp)
 * [ftp-deploy](https://www.npmjs.com/package/ftp-deploy])
 * [rimraf](https://www.npmjs.com/package/rimraf)
 * [child_process](https://www.npmjs.com/package/child_process)
 * [image-downloader](https://www.npmjs.com/package/image-downloader)
 * [node-cmd](https://www.npmjs.com/package/node-cmd)
 * [fs-extra](https://www.npmjs.com/package/fs-extra)
 * [jsonfile](https://www.npmjs.com/package/jsonfile)
 * [path](https://www.npmjs.com/package/path)
