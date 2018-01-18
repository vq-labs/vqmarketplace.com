'use strict';

const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace-task');
const spawn = require('child_process').spawn;
const fileinclude = require('gulp-file-include');
const liveServer = require('gulp-live-server');
const runSequence = require('run-sequence');

const build = (VQ_TENANT_API_URL, env) => {
    gulp.src([ 'src/**/index.html' ])
    .pipe(replace({
        patterns: [
            {
                match: 'VQ_TENANT_API_URL',
                replacement: VQ_TENANT_API_URL
            },
            {
                match: 'VQ_WEB_ENV',
                replacement: env
            },
            {
                match: 'VQ_WEB_URL',
                replacement: env === 'production' || env === 'development' ? 'https://vqmarketplace.com' : 'http://localhost:3000'
            }
        ]
    }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public'));

    gulp.src([ 'src/**/*.js' ])
    .pipe(replace({
        patterns: [
            {
                match: 'VQ_TENANT_API_URL',
                replacement: VQ_TENANT_API_URL
            },
            {
                match: 'VQ_WEB_ENV',
                replacement: env
            },
            {
                match: 'VQ_WEB_URL',
                replacement: env === 'production' || env === 'development' ? 'https://vqmarketplace.com' : 'http://localhost:3000'
            }
        ]
    }))
    .pipe(gulp.dest('public'));

    gulp.src([ 'src/**/*.css' ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('public'))

    gulp.src([ 'assets/**/*' ])
    .pipe(gulp.dest('public'))
};

gulp.task('run:prod', function(cb) {
    runSequence(
        'build:prod',
        'runServer',
        cb
    );
});
gulp.task('run:dev', function(cb) {
    runSequence(
        'build:dev',
        'watch:dev',
        'runServer',
        cb
    );
});
gulp.task('run:local', function(cb) {
    runSequence(
        'build:local',
        'watch:local',
        'runServer',
        cb
    );
});

gulp.task('build:prod', () => build('https://vqmarketplace.vqmarketplace.com/api', 'production'));
gulp.task('build:dev', () => build('https://vqmarketplace.vqmarketplace.com/api', 'development'));
gulp.task('build:local', () => build('http://localhost:8081/api', 'local'));

gulp.task('watch:prod', () => gulp.watch('./src/**/**',  [ 'build:prod' ]));
gulp.task('watch:dev', () => gulp.watch('./src/**/**',  [ 'build:dev' ]));
gulp.task('watch:local', () => gulp.watch('./src/**/**',  [ 'build:local' ]));

gulp.task('runServer', function() {
    var server = liveServer.static('./public');
    server.start();
});

gulp.task('deploy', function() {
    const args = [ './**', '--region', 'eu-central-1', '--bucket', 'vqmarketplace.com', '--gzip' ];
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