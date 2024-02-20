const path = require('path');
const pak = require('../package.json');
const myBabel = require('../babel-plugin');
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // 'react-native-ustyle': path.resolve(
            //   __dirname,
            //   '../lib/commonjs/index'
            // ),
          },
        },
      ],
      '@babel/plugin-transform-modules-commonjs',
      myBabel,
    ],
  };
};
