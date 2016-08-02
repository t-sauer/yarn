"use strict";

/**
 * For linking test purposes we may use a mirror of real life packages.
 * This script goes through all packages in a mirror folder, strips anything that is not package.json because it
 * is irrelevant to tests
 */
/*eslint-disable no-undef */
require("shelljs/global");

cd("fixtures/install");
let files = ls("common-mirror");
cd("common-mirror");

for(let file of files) {
  echo("repacking", file);
  exec(`tar -xvzf ${file}`, {silent: true});
  let folder = ls("").filter(name => name.indexOf(".tgz") === -1 && name !== "trimmed-package")[0];
  mkdir("trimmed-package");
  cp(`${folder}/package.json`, "trimmed-package/package.json");
  cd("trimmed-package");
  let packageJson = JSON.parse(cat("package.json"));
  // these sections have references to code and will fail installation
  delete packageJson.scripts;
  delete packageJson.bin;
  JSON.stringify(packageJson, null, 4).to("package.json");
  exec("npm pack");
  mv(file, "..");
  cd("..");
  rm("-rf", [folder, "trimmed-package"])
}