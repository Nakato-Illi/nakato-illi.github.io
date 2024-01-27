const path = require('path');
// import path from 'path';


const bla = () => {
    console.log('---------------------------', __dirname);
    return 'dist';
}

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, bla()),
        filename: 'my-webpack.bundle.js'
    },
    resolve: {
        alias: {
            'node_modules': path.join(__dirname, 'node_modules'),
        }
    }
};


// module.exports = {
//     entry: './src/main.js', // Adjust the path accordingly
//     output: {
//         filename: 'bundle.js',
//         path: path.resolve(__dirname, bla())
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 exclude: /node_modules/,
//                 use: {
//                     loader: 'babel-loader',
//                     options: {
//                         presets: ['@babel/preset-env']
//                     }
//                 }
//             }
//         ]
//     }
// };
