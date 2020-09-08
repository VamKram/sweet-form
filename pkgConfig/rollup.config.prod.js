process.env.NODE_ENV = 'production';
const commonjs = require('rollup-plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const configList = require('./rollup.config');

configList.map((config, index) => {

    config.external = ['react', 'react-dom'];
    config.globals = {
         'react': 'React',
         'react-dom': 'ReactDOM'
    };
    config.output.sourcemap = false;

    if( index === 0 ) {
        config.plugins[1] = (
          commonjs({
              include: 'node_modules/**',
              namedExports: {
                  'node_modules/react-is/index.js': ['isFragment', 'isMemo']
              },
          })
        )
        config.plugins = [
            ...config.plugins,
            ...[
                terser()
            ]
        ]
    }

    return config;
})


module.exports = configList;