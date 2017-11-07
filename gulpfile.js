'use strict';

const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace-task');
const spawn = require('child_process').spawn;
const fileinclude = require('gulp-file-include');
const liveServer = require('gulp-live-server');
const runSequence = require('run-sequence');

const build = (VQ_TENANT_API_URL, env) => {
    gulp.src([ 'src/**/*.html' ])
    .pipe(replace({
        patterns: [
            {
                match: 'VQ_TENANT_API_URL',
                replacement: VQ_TENANT_API_URL
            },
            {
                match: 'VQ_WEB_ENV',
                replacement: env
            }
        ]
    }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public'));

  gulp.src([ 'src/**/*.css' ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('public'))
};

gulp.task('run', function(cb) {
    runSequence(
        'build:local',
        'watch:local',
        'runServer',
        cb
    );
});

gulp.task('runServer', function() {
    var server = liveServer.static('./public');
    server.start();
});

// production
gulp.task('build', () => build('https://vqmarketplace.vq-labs.com/api', 'production'));

gulp.task('build:dev', () => build('http://vqmarketplace.viciqloud.com/api', 'development'));

gulp.task('build:local', () => build('http://localhost:8081/api', 'local'));

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
gulp.task('watch:dev', () => gulp.watch('./src/**/**',  [ 'build:dev' ]));
gulp.task('watch:local', () => gulp.watch('./src/**/**',  [ 'build:local' ]));