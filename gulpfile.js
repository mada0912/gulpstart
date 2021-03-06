"use strict";

const gulp      = require("gulp");
const newer     = require("gulp-newer");
const imagemin  = require("gulp-imagemin");
const htmlclean = require("gulp-htmlclean");
const concat    = require("gulp-concat");
const uglify    = require("gulp-uglify");
const cleancss  = require("gulp-clean-css");
const sass      = require("gulp-sass");
const merge     = require("merge-stream");
const clean     = require("gulp-clean");
const watch     = require("gulp-watch");

const folder = {
    src: "src/",
    build: "pub/"
}

/* Konvertera bild-filer */
gulp.task("images", function(){
    var out = folder.build + "images";

    return gulp.src(folder.src + "images/**/*")
        .pipe(newer(out))
        .pipe(imagemin( { optimizationLevel: 5 }))
        .pipe(gulp.dest(out));
});

/* Minimera HTML-filer */
gulp.task("html", ['images'], function() {
    var out = folder.build;
    
    return gulp.src(folder.src + "*.html")
        .pipe(newer(out))
        .pipe(gulp.dest(out));
});

/* JavaScript */
gulp.task("js", function() {
    return gulp.src(folder.src + "js/**/*.js")
        .pipe(concat("main.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(folder.build + "js/"));
});

/* CSS */
gulp.task("css", function() {
    var sassStream, cssStream;

    sassStream = gulp.src(folder.src + "scss/**/*.scss")
        .pipe(sass());
    
    cssStream = gulp.src(folder.src + "css/**/*.css");

    return merge(sassStream, cssStream)
        .pipe(concat('style.min.css'))
        .pipe(cleancss())
        .pipe(gulp.dest(folder.build + "css/"));

    //    return gulp.src(folder.src + "css/**/*.css")
    //    .pipe(concat("style.css"))
    //    .pipe(cleancss())
    //    .pipe(gulp.dest(folder.build + "/css"));
});

/* SASS */
gulp.task('sass', function() {
    return gulp.src(folder.src + "scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest(folder.src + "css/"));
});

/* Städa upp */
gulp.task("clean", function() {
    return gulp.src("pub/", { read: false })
        .pipe(clean());
});

/* Kör allting */
gulp.task("run", ['html', 'css', 'js']);

/* Kolla efter changes */
gulp.task('watch', function() {
    
    //gulp.watch(folder.src + "images/**/*", ['images']);
    //gulp.watch(folder.src + "**/*.html", ['html']);
    //gulp.watch(folder.src + "js/**/*", ['js'])
    //gulp.watch(folder.src + "css/**/*.css", ['css']);
    //gulp.watch(folder.src + "scss/**/*.scss", ['css']);
    watch(folder.src + "images/**/*", function () {
        gulp.start('images');
    });
    watch(folder.src + "**/*.html", function () {
        gulp.start('html');
    });
    watch(folder.src + "js/**/*", function () {
        gulp.start('js');
    });
    watch([folder.src + "css/**/*.css", folder.src + "scss/**/*.scss"], function () {
        gulp.start('css');
    });
});

gulp.task('default', ['run', 'watch']);