import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    entry: './src/main.jsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve('dist'),
        clean: true,
        publicPath: '/',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        sourceMaps: true, // ✅ ensure this is true
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
    ],
    devServer: {
        static: './dist',
        historyApiFallback: true,
        port: 3000,
        open: true,
        hot: true,
    },
    mode: 'development',
    devtool: 'eval-source-map', // or 'source-map' for better line mapping
};
