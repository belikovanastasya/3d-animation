var gulp         = require('gulp'),
    sass         = require('gulp-sass'), 
    browserSync  = require('browser-sync'), 
    concat       = require('gulp-concat'), 
    uglify       = require('gulp-uglifyjs'), 
    cssnano      = require('gulp-cssnano'), 
    rename       = require('gulp-rename'), 
    del          = require('del'), 
    imagemin     = require('gulp-imagemin'), 
    pngquant     = require('imagemin-pngquant'), 
    cache        = require('gulp-cache'), 
    autoprefixer = require('gulp-autoprefixer');



gulp.task('sass', function(){ 
    return gulp.src('app/sass/*.+(sass|scss)') 
        .pipe(sass()) 
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
        .pipe(gulp.dest('app/css/')) 
        .pipe(browserSync.reload({stream: true})); 
});

gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { 
            baseDir: 'app' 
        },
        notify: false 
    });
});
gulp.task('scripts', function() {
    return gulp.src([
    	'bower_components/jquery/dist/jquery.min.js',
        'bower_components/vue/vue.min.js',
    	'bower_components/jquery-mousewheel/jquery.mousewheel.min.js',
    	'bower_components/jquery-validation/dist/jquery.validate.min.js',
    	'bower_components/jQuery-viewport-checker/dist/jquery.viewportchecker.min.js',
    	'bower_components/jquery-maskedinput/dist/jquery.maskedinput.js',
    	'bower_components/magnific-popup/dist/jquery.magnific-popup.min.js',
    	'bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
    	'bower_components/scrollmagic/minified/ScrollMagic.min.js',
    	'bower_components/slick-carousel/slick/slick.min.js',
        'bower_components/Pace/pace.js',
        'bower_components/tilt-js-master/dest/tilt.jquery.min.js'
    	])
        .pipe(concat('libs.min.js')) 
        .pipe(uglify()) 
        .pipe(gulp.dest('app/js')); 
});
gulp.task('css', function() {
   return gulp.src([
   	'bower_components/normalize-css/normalize.css',
   	'bower_components/magnific-popup/dist/magnific-popup.css',
   	'bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css',
   	'bower_components/slick-carousel/slick/slick-theme.css',
   	'bower_components/slick-carousel/slick/slick.css',
   	'bower_components/bootstrap-grid-only/css/grid12.css',
    'bower_components/Pace/pace-theme-flash.tmpl.css'
    ])
        .pipe(concat('libs.min.css')) 
        .pipe(cssnano()) 
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('watch', ['browser-sync', 'sass', 'css', 'scripts'], function() {
    gulp.watch('app/sass/**/*.+(scss|sass)', ['sass'], browserSync.reload); 
    gulp.watch('app/**/*.css', browserSync.reload); 
    gulp.watch('app/*.html', browserSync.reload); 
    gulp.watch('app/js/**/*.js', browserSync.reload);   
});
gulp.task('clean', function() {
    return del.sync('dist'); 
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') 
        .pipe(cache(imagemin({  
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); 
});

gulp.task('css-min', function() {
    return gulp.src('app/css/main.css')
            .pipe(cssnano())
            .pipe(rename({suffix:'.min'}))
            .pipe(gulp.dest('app/css'));
});
gulp.task('js-min', function() {
    return gulp.src('app/js/main.js')
            .pipe(uglify())
            .pipe(rename({suffix:'.min'}))
            .pipe(gulp.dest('app/js'));
});
gulp.task('min', ['css-min', 'js-min']);

gulp.task('build', ['clean', 'min', 'img', 'sass', 'scripts'], function() {

    var buildCss = gulp.src('app/css/**/*')
    .pipe(gulp.dest('dist/css'))

     var buildFonts = gulp.src('app/fonts/**/*') 
        .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') 
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') 
    .pipe(gulp.dest('dist'));

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);
