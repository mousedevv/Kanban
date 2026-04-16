"use strict";

import { globSync } from "glob";
import { rmSync } from "fs";

for (const file of globSync("dist/**/*.map")) {
    rmSync(file, { force: true });
}