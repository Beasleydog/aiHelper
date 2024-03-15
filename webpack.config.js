var WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
    watch: true,
    output: {
        filename: 'bundle.js',
        path: __dirname
    },

};
// plugins: [new WebpackObfuscator({
//     rotateStringArray: true
// }, [])]