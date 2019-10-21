import { src, dest, watch, parallel, series } from 'gulp';
import del from 'del';
import livereload from 'gulp-livereload';
import loadPlugins from 'gulp-load-plugins';
import minifycss from 'gulp-minify-css';
import path from 'path';
import yargs from 'yargs';

// Load the gulp plugins into the `plugins` variable
const plugins = loadPlugins();

// Build Directories
const dirs = {
  src: 'src',
  dest: 'build'
};

// File Sources
const sources = {
  styles: `${dirs.src}/**/*.scss`,
  views: `${dirs.src}/**/*.pug`,
  scripts: `${dirs.src}/**/*.js`,
  buildScripts: `${dirs.dest}/**/*.js`
};


// Recognise `--production` argument
const argv = yargs.argv;
const production = !!argv.production;

// Main Tasks

// Styles 
export const buildStyles = () => src(sources.styles)
  .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
  .pipe(plugins.if(production, minifycss()))
  .pipe(dest(dirs.dest))
  .pipe(livereload());

// Scripts
export const buildScripts = () => src(sources.scripts)
  .pipe(plugins.babel())
  .pipe(dest(dirs.dest));

// Clean
export const clean = () => del(['build']);

// Nodemon
export const nodemon = () => {
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: 'buildScripts'
  })
};

// Watch Task
export const devWatch = () => {
  series('nodemon');
  watch(sources.scripts, buildScripts);
};

// Development Task
export const dev = series(parallel(buildScripts), devWatch);

// Build Task
export const build = series(clean, parallel(buildStyles, buildViews, buildScripts));

// Default task
export default dev;
