const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Dotenv = require('dotenv-webpack');

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all'
		}
	};

	if (isProduction) {
		config.minimizer = [new CssMinimizerPlugin(), new TerserWebpackPlugin()];
	}

	return config;
};

const filename = (ext) =>
	isDevelopment ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = (extra) => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: {}
		},
		'css-loader'
	];

	if (extra) {
		loaders.push(extra);
	}

	return loaders;
};

const babelOptions = (preset) => {
	const opts = {
		presets: ['@babel/preset-env'],
		plugins: ['@babel/plugin-proposal-class-properties']
	};

	if (preset) {
		opts.presets.push(preset);
	}

	return opts;
};

const jsLoaders = () => {
	const loaders = [
		{
			loader: 'babel-loader',
			options: babelOptions()
		}
	];

	if (isDevelopment) {
		loaders.push('eslint-loader');
	}

	return loaders;
};

const plugins = () => {
	const base = [
		new HTMLWebpackPlugin({
			template: './index.html',
			minify: {
				collapseWhitespace: isProduction
			}
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: filename('css')
		}),
		new Dotenv({
			path: './.env'
		})
	];

	if (isProduction) {
		base.push(new BundleAnalyzerPlugin());
	}

	return base;
};

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: {
		main: ['@babel/polyfill', './index.js']
	},
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: ['.js', '.json', '.png'],
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	optimization: optimization(),
	devServer: {
		port: 3000,
		hot: isDevelopment
	},
	devtool: isDevelopment ? 'eval-source-map' : false,
	plugins: plugins(),
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: cssLoaders()
			},
			{
				test: /\.s[ac]ss$/i,
				use: cssLoaders('sass-loader')
			},
			{
				test: /\.(png|jpg|svg|gif)$/i,
				use: ['file-loader']
			},
			{
				test: /\.(ttf|woff|woff2|eot)$/i,
				use: ['file-loader']
			},
			{
				test: /\.js$/i,
				exclude: /node_modules/,
				use: jsLoaders()
			},
			{
				test: /\.ts$/i,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: babelOptions('@babel/preset-typescript')
				}
			}
		]
	}
};
