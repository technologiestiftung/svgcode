"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgcode = void 0;
const canvg_1 = __importDefault(require("canvg"));
// import fs, { PathLike } from 'fs';
const gcanvas_1 = __importDefault(require("gcanvas"));
const common_1 = require("./common");
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
let doRmZends = true;
exports.svgcode = (doFloor = true, doDedupe = true, feedRate = 3125, canvgOpts) => {
    const output2Array = (target) => {
        return {
            write(cmd) {
                target.push(cmd);
            },
        };
    };
    const gcanvDefaultOptions = {
        depth: 10,
        map: 'xyz',
        precision: 1,
        ramping: false,
        toolDiameter: 0,
        top: -10,
        unit: 'mm',
    };
    const opts = Object.assign(gcanvDefaultOptions, canvgOpts);
    const obj = {
        gCode: [],
        gctx: {},
        svgFile: undefined,
        // loadFile(input: PathLike) {
        //   this.svgFile = fs.readFileSync(input, 'utf8');
        //   return this;
        // },
        setSvg(svg) {
            this.svgFile = svg;
            return this;
        },
        setDriver(input) {
            this.gctx = new gcanvas_1.default(new gcanvas_1.default.GcodeDriver(input));
            return this;
        },
        setOptions(input) {
            Object.keys(input).forEach(opt => {
                this.gctx[opt] = input[opt];
            });
            return this;
        },
        generateGcode() {
            canvg_1.default(this.gctx.canvas, this.svgFile);
            return this;
        },
        printGcode() {
            process.stdout.write(this.gCode.join('\n'));
        },
        getGcode() {
            this.gCode.splice(3, 0, common_1.GCodeCommands.lift); // insert a lift at start after the first three elements
            this.gCode.splice(4, 0, `F${feedRate.toString()}`); // insert a lift at start after the first three elements
            this.gCode.push(common_1.GCodeCommands.lift); // left the pen at the end
            this.gCode.push(common_1.GCodeCommands.goHome); // Go Home again
            // now we patch some pen down so we don't hit the switch
            this.gCode.forEach((ele, i) => {
                this.gCode[i] = ele.replace('Z0', 'Z3');
            });
            // this.gCode.forEach((ele, i, arr) => {
            //   arr[i] = ele.replace('G1 Z3', 'G0 Z10');
            // });
            if (doFloor !== undefined && doFloor === true) {
                this.gCode.forEach((ele, i, arr) => {
                    arr[i] = ele.replace(/([X,Y,Z,x,y,z]\d{1,6})([.]\d{1,6})/g, '$1');
                });
            }
            if (doRmZends === true) {
                const reg = doFloor === true ? /([Y,y]\d{1,4})\ [Z]\d$/g : /([Y,y]\d{1,6}[.]\d{0,10})\ [Z]\d$/g;
                this.gCode.forEach((ele, i, arr) => {
                    arr[i] = ele.replace(reg, '$1');
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
                if (this.gCode[i].startsWith('G0 X') === true) {
                    // console.log('Got a G0 without lift');
                    if (i > 0) {
                        this.gCode.splice(i, 0, 'G0 Z10');
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
