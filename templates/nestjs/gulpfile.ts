import * as gulp from 'gulp';
import * as fs from 'fs';

gulp.task('dist:clear', async () => {
  if (!fs.existsSync('./dist')) {
    return fs.mkdirSync('./dist');
  }
  return fs.rmSync('./dist', { recursive: true });
});
gulp.task('cp:json', async () => {
  return gulp.src('./src/*.json').pipe(gulp.dest('./dist/src'));
});
gulp.task('make:config', async () => {
  if (fs.existsSync('./config.yaml')) {
    fs.unlinkSync('./config.yaml');
  }
  switch (process.env.NODE_ENV) {
    case 'production':
      return fs.writeFileSync(
        './config.yaml',
        fs.readFileSync('./deploy/config.prod.yaml'),
      );
    case 'test':
      return fs.writeFileSync(
        './config.yaml',
        fs.readFileSync('./deploy/config.test.yaml'),
      );
    default:
      return fs.writeFileSync(
        './config.yaml',
        fs.readFileSync('./deploy/config.test.yaml'),
      );
  }
});

gulp.task('default', gulp.series(['dist:clear', 'make:config', 'cp:json']));
