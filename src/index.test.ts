import { svgcode } from "./index";
import path from "path";
import fs from "fs";

describe("default test group", () => {
  test("should match snappshot", () => {
    const inFile = path.resolve(__dirname, "../test/A4-rect-1010_200200.svg");
    const svg = fs.readFileSync(inFile, "utf8");

    const opts = {
      // depth: 9,
      // unit: 'mm',
      // map: 'xyz',
      // top: -10
    };

    const gcode = svgcode(true, true, 3000)
      // .loadFile(inFile)
      .setSvg(svg)
      // .loadFile(path.resolve(__dirname, './in-svg/town-a0-841-1189.svg'))
      .setOptions(opts)
      .generateGcode()
      .getGcode();
    expect(gcode).toMatchInlineSnapshot(`
      Array [
        "G90",
        "G21",
        "G0 Z10",
        "F3000",
        "G0 Z10",
        "G0 X10 Y10",
        "G0 Z10",
        "G1 Z3",
        "G1 X209 Y10",
        "G1 X209 Y209",
        "G1 X10 Y209",
        "G1 X10 Y10",
        "G0 Z10",
        "G0 Z10",
        "G0 X0 Y0",
      ]
    `);
  });
});
