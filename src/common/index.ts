export interface IObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ICanvgDefaultOptions {
  depth?: number;
  precision?: number;
  ramping?: boolean;
  toolDiameter?: number;
  unit?: "mm" | "inch";
  map?: string;
  top?: number;
  doFloor?: boolean;
}
export interface ISvgcodeOpts {
  doFloor?: boolean;
  doDedupe?: boolean;
}
export interface IOptions {
  canvgOpts: ICanvgDefaultOptions;
  svgcodeOpts: ISvgcodeOpts;
}
export enum GCodeCommands {
  lift = "G0 Z10",
  feedrate5000 = "F5000",
  goHome = "G0 X0 Y0",
}
export interface ISvgcode {
  gCode: string[];
  gctx: IObject;
  svgFile: string | undefined;
  // loadFile: (input: string) => ISvgcode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setDriver: (input: any) => ISvgcode;
  setOptions: (input: IObject) => ISvgcode;
  generateGcode: () => ISvgcode;
  printGcode: () => void;
  getGcode: () => string[];
  setSvg: (input: string) => ISvgcode;
}
