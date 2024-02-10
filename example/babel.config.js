const path = require('path');
const pak = require('../package.json');
const myBabel = require('../src/babel');
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      // () => {
      //   return {
      //     plugins: [myBabel],
      //   };
      // },
      'babel-preset-expo',
    ],
    plugins: [myBabel],
  };
};
