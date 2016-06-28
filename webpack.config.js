const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const validate = require('webpack-validator');

const parts = require('./libs/parts');

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
    style: path.join(__dirname, 'app', 'main.scss')
};

const common = merge(
    {
        entry: {
            app: PATHS.app,
            style: PATHS.style
        },
        output: {
            path: PATHS.build,
            filename: '[name].js'
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Webpack demo'
            })
        ]
    },
    parts.lint(PATHS.app),
    parts.loadJSX(PATHS.app)
);

var config;

switch(process.env.npm_lifecycle_event) {
case 'build':
    config = merge(
        common,
        {
            devtool: 'source-map',
            output: {
                path: PATHS.build,
                filename: '[name].[chunkhash].js',
                chunkFilename: '[chunkhash].js'
            }
        },
        parts.clean(PATHS.build),
        parts.setFreeVariable(
            'process.env.NODE_ENV',
            'production'
        ),
        parts.extractBundle({
            name: 'vendor',
            entries: ['react', 'react-dom']
        }),
        parts.minify(),
        parts.extractSass(PATHS.style),
        parts.purifyCSS([PATHS.app])
    );
    break;
default:
    config = merge(
        common,
        {
            devtool: 'eval-source-map'
        },
        parts.setupSass(PATHS.style),
        parts.devServer({
            host: process.env.HOST,
            port: process.env.PORT
        })
    );
}

module.exports = validate(config, {quiet: true});
