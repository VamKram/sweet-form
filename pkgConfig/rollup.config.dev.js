process.env.NODE_ENV = 'development';

const path = require('path');
const serve = require('rollup-plugin-serve');
// 监听文件改变，并刷新浏览器
const livereload = require('rollup-plugin-livereload');
const configList = require('./rollup.config');

const resolveFile = function(filePath) {
    return path.join(__dirname, '..', filePath)
}
const PORT = 3000;

const devSite = `http://127.0.0.1:${PORT}`;
const devPath = path.join('example', 'index.html');
const devUrl = `${devSite}/${devPath}`;

setTimeout(()=>{
    console.log(`[dev]: ${devUrl}`)
}, 1000);

configList.map((config, index) => {

    config.output.sourcemap = true;

    if( index === 0 ) {
        config.plugins = [
            ...config.plugins,
            ...[
                serve({
                    port: PORT,
                    contentBase: [resolveFile('')],
                    historyApiFallback: true, // Set to true to return index.html instead of 404
                }),
                livereload()
            ]
        ]
    }

    return config;
})

module.exports = configList;