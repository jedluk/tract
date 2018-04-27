const gulp = require("gulp");
const sass = require("gulp-sass");

gulp.task("sass", () => {
  return gulp
    .src("src/scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("src/styles/style.css"));
});

gulp.task("watch", () => {
  gulp.watch("src/styles/*.scss", ["sass"]);
});

gulp.task("copy_fonts", () => {
  return gulp
    .src("node_modules/font-awesome/fonts/*")
    .pipe(gulp.dest("public/fonts"));
});

gulp.task("copy_fa", () => {
  return gulp
    .src("node_modules/font-awesome/css/font-awesome.min.css")
    .pipe(gulp.dest("public/dist"));
});

gulp.task("production", ["copy_fa", "copy_fonts"]);
