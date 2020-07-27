/* eslint-disable @typescript-eslint/no-explicit-any */
import canvg from "canvg";
// import fs, { PathLike } from 'fs';
import Gcanvas from "gcanvas";
import { Stream } from "stream";
import {
  GCodeCommands,
  ICanvgDefaultOptions,
  IObject,
  ISvgcode,
} from "./common";

// totally ripped from
// https://github.com/piLeoni/svgcode

// interface IGcanvas extends HTMLCanvasElement {
//   [key: string]: any;
//   depth?: number;
//   precision?: number;
//   ramping?: boolean;
//   toolDiameter?: number;
// }
// tslint:disable-next-line: prefer-const
const doRmZends = true;

export const svgcode: (
  doFloor: boolean,
  doDedupe: boolean,
  feedRate: number,
  canvgOpts?: ICanvgDefaultOptions
) => ISvgcode = (doFloor, doDedupe, feedRate, canvgOpts) => {
  const output2Array: (target: string[]) => any = (target) => {
    return {
      write(cmd: any) {
        target.push(cmd);
      },
    };
  };
  const gcanvDefaultOptions: ICanvgDefaultOptions = {
    depth: 10,
    map: "xyz",
    precision: 1,
    ramping: false,
    toolDiameter: 0,
    top: -10,
    unit: "mm",
  };

  const opts = Object.assign(gcanvDefaultOptions, canvgOpts);

  const obj: ISvgcode = {
    gCode: [],
    gctx: {},
    svgFile: undefined,
    // loadFile(input: PathLike) {
    //   this.svgFile = fs.readFileSync(input, 'utf8');
    //   return this;
    // },
    setSvg(svg: string) {
      this.svgFile = svg;
      return this;
    },
    setDriver(input: Stream) {
      this.gctx = new Gcanvas(new Gcanvas.GcodeDriver(input));
      return this;
    },
    setOptions(input: IObject) {
      Object.keys(input).forEach((opt) => {
        this.gctx[opt] = input[opt];
      });
      return this;
    },
    generateGcode() {
      canvg(this.gctx.canvas, this.svgFile);
      return this;
    },
    printGcode() {
      process.stdout.write(this.gCode.join("\n"));
    },
    getGcode() {
      this.gCode.splice(3, 0, GCodeCommands.lift); // insert a lift at start after the first three elements
      this.gCode.splice(4, 0, `F${feedRate.toString()}`); // insert a lift at start after the first three elements
      this.gCode.push(GCodeCommands.lift); // left the pen at the end
      this.gCode.push(GCodeCommands.goHome); // Go Home again
      // now we patch some pen down so we don't hit the switch
      this.gCode.forEach((ele, i) => {
        this.gCode[i] = ele.replace("Z0", "Z3");
      });
      // this.gCode.forEach((ele, i, arr) => {
      //   arr[i] = ele.replace('G1 Z3', 'G0 Z10');
      // });
      if (doFloor !== undefined && doFloor === true) {
        this.gCode.forEach((ele, i, arr) => {
          arr[i] = ele.replace(/([X,Y,Z,x,y,z]\d{1,6})([.]\d{1,6})/g, "$1");
        });
      }
      if (doRmZends === true) {
        const reg =
          doFloor === true
            ? /([Y,y]\d{1,4}) [Z]\d$/g
            : /([Y,y]\d{1,6}[.]\d{0,10}) [Z]\d$/g;
        this.gCode.forEach((ele, i, arr) => {
          arr[i] = ele.replace(reg, "$1");
        });
      }

      for (let i = 0; i < this.gCode.length; i++) {
        if (this.gCode[i].match(/\(.*?\)/) !== null) {
          this.gCode.splice(i, 1);
          i--;
        }
      }
      if (doDedupe === true) {
        for (let i = 0; i < this.gCode.length; i++) {
          if (i < this.gCode.length - 1) {
            if (this.gCode[i] === this.gCode[i + 1]) {
              this.gCode.splice(i, 1);
              i--;
            }
          }
        }
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.gCode.length; i++) {
        if (this.gCode[i].startsWith("G0 X") === true) {
          // console.log('Got a G0 without lift');
          if (i > 0) {
            this.gCode.splice(i, 0, "G0 Z10");
            i++;
          }
        }
      }
      return this.gCode;
    },
  };
  obj.setDriver(output2Array(obj.gCode));
  obj.setOptions(opts);
  return obj;
};
