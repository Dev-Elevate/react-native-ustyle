/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 * @oncall react_native
 */

'use strict';

const { parseSync, transformFromAstSync } = require('@babel/core');
const nullthrows = require('nullthrows');
const worker = require('metro-transform-worker');
const { transformSync } = require('@babel/core');
const babelPlugin = require('./index');
const CONFIG = {
  p: 'padding',
  m: 'margin',
  t: 'top',
  b: 'bottom',
  l: 'left',
  r: 'right',
  h: 'height',
  w: 'width',
  bg: 'backgroundColor',
  c: 'color',
};
function transform(config, projectRoot, filename, data, options) {
  process.env.BABEL_ENV = 'development';
  const transformer = worker.transform;
  let resCode = data;
  if (!filename.includes('node_modules') && !filename.includes('.expo')) {
    if (filename.endsWith('.js') || filename.endsWith('.tsx')) {
      let res = transformSync(data.toString(), {
        filename,
        plugins: [babelPlugin],
      });
      console.log(filename);
      resCode = Buffer.from(res.code, 'utf8');
    }
  }
  return transformer(config, projectRoot, filename, resCode, options);
}

module.exports = {
  transform,
};
