'use strict';

const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const spawn = require('child_process').spawn;
const fileinclude = require('gulp-file-include');



gulp.task('build', function() {
  return gulp.src([ 'src/**/*.html' ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public'))
})

gulp.task('watch', function () {
    console.log('watch')
    // Endless stream mode 
    return watch('src/**', {
        ignoreInitial: false
    }).pipe(gulp.dest('build'));
});

gulp.task('deploy', [ 'build' ], function() {
    const args = [ './**', '--region', 'eu-central-1', '--bucket', 'vq-labs.com', '--gzip' ];
    const npm = spawn("s3-deploy", args, { cwd: './public' });

    npm.stdout.on('data', data => {
        console.log(`stdout: ${data}`);
    });

    npm.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });

    npm.on('close', code => {
        console.log(code !== 0 ? 'error in build' : 0);
    });
});

gulp.task('watch', () => gulp.watch('./src/**/**',  [ 'build' ]));