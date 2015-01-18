var gulp = require('gulp');
var to5 = require('gulp-6to5');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var name = "consemu";

gulp.task('compile', function () {
    var to5_stream = to5({ format: { indent: {style: "    "} } }).on("error", function () {
        console.log("error");
        to5_stream.end();
    });
    
    return gulp.src('src/**/*.js')
        .pipe(to5_stream)
        .pipe(gulp.dest('lib'));
});

gulp.task('bundle', ['compile'], function () {
    return browserify({ standalone: name })
        .require("./lib/" + name + ".js", { entry: true })
        .bundle()
        .pipe(source(name + ".js"))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['bundle']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['bundle']);
});
