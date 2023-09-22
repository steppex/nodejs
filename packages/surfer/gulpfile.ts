import * as gulp from "gulp";
import { existsSync, mkdirSync, rmSync } from "fs";
import { execSync } from "child_process";

gulp.task("lib:clear", async () =>
    !existsSync("./lib")
        ? mkdirSync("./lib")
        : rmSync("./lib", { recursive: true }),
);
gulp.task("lib:build", async () =>
    execSync("tsc -p tsconfig.build.json", { cwd: __dirname }),
);
gulp.task("build", gulp.series("lib:clear", "lib:build"));

gulp.task("dist:clear", async () =>
    !existsSync("./dist")
        ? mkdirSync("./dist")
        : rmSync("./dist", { recursive: true }),
);
gulp.task("dist:files", async () =>
    gulp.src(["package.json", "README.md"]).pipe(gulp.dest("./dist/")),
);
gulp.task("dist:lib", async () =>
    gulp.src("./lib/*").pipe(gulp.dest("./dist/lib/")),
);
gulp.task("dist:src", async () =>
    gulp.src("./src/*").pipe(gulp.dest("./dist/src/")),
);
gulp.task("dist:test", async () =>
    gulp.src("./test/*").pipe(gulp.dest("./dist/test/")),
);
gulp.task(
    "dist",
    gulp.series(
        "dist:clear",
        "dist:files",
        "dist:lib",
        "dist:src",
        "dist:test",
    ),
);

gulp.task("default", gulp.series("build", "dist"));
