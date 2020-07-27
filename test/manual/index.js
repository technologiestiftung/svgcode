/* eslint-disable @typescript-eslint/no-var-requires */
const { svgcode } = require("../../dist");

const path = require("path");
const fs = require("fs");
const meow = require("meow");

const cli = meow(
  `
  Usage: node index.js relative/input/path/to/file.svg relative/output/path/file.gc

  Will output next to the srcfile with .gz extension.
`,
  {}
);

if (cli.input.length === 0) {
  cli.showHelp();
}
const opts = {
  // depth: 9,
  // unit: 'mm',
  // map: 'xyz',
  // top: -10
};

const inFile = path.resolve(process.cwd(), cli.input[0]);
let outFile = undefined;
if (cli.input[1] === undefined) {
  outFile = `${inFile.replace(".svg", ".gc")}`;
} else {
  outFile = path.resolve(process.cwd(), cli.input[1]);
}
// const base = path.basename(inFile);
// console.log(outFile);
const svg = fs.readFileSync(inFile, "utf8");
const gcode = svgcode()
  // .loadFile(inFile)
  .setSvg(svg)
  // .loadFile(path.resolve(__dirname, './in-svg/town-a0-841-1189.svg'))
  .setOptions(opts)
  .generateGcode()
  .getGcode();

console.log(gcode);
fs.writeFile(outFile, gcode.join("\n"), "utf8", (err) => {
  if (err) {
    throw err;
  }
  // console.log(data);
});
