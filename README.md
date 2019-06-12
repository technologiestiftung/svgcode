# SVG to GCODE (@tsb/svgcode)

This module is part of the [CityLAB plotter](https://github.com/technologiestiftung/citylab-plotter) project. Totally based on [https://github.com/piLeoni/svgcode](https://github.com/piLeoni/svgcode).

## Usage

```bash
npm install @tsb/scgcode
```

```js

const {svgcode} = require('@tsb/svgcode');

const path = require('path');
const fs = require('fs');

// default options
const opts = {
    depth: 9,
    map: 'xyz',
    precision: 0.1,
    ramping: false,
    toolDiameter: 1,
    top: -10,
    unit: 'mm',
};

const inFile = path.resolve(process.cwd(), './path/to/file.svg');
const svg = fs.readFileSync(inFile, 'utf8');
const outFile = `${inFile.replace('.svg', '.gc')}`;
const gcode = svgcode()
  .setSvg(svg)
  .setOptions(opts)
  .generateGcode()
  .getGcode();

console.log(gcode);
fs.writeFile(outFile, gcode.join('\n'), 'utf8', (err) => {
  if (err) {
    throw err;
  }
});

```

MIT License

Copyright (c) 2019 Technologiestiftung Berlin & Fabian Morón Zirfas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
