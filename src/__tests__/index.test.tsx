// test to check all the utlitity functions from babel plugin
import { CONFIG } from '../../example/rnu.config';
import {
  ObjectExpressionASTtoJSObject,
  // checkIfStylesheetImportedAndImport,
  // addRnuStyleIdInStyleArrayOfComponent,
  aliasResolver,
  tokenResolver,
  // @ts-ignore
} from '../../babel-plugin/utils';
const { parse } = require('@babel/parser');
// const { default: traverse } = require('@babel/traverse');

// const code = `
// import React from 'react';
// import { Text, View } from 'react-native-ustyle';

// export default function App() {
//   return (
//     <View bg={'$primary'} p={'$space$4'} mx={'$space$5'} mr="-$space$4">
//       <Text c="$secondary">Open up App.js to start working on your app!</Text>
//     </View>
//   );
// }
// `;

const testConfig = `
export const CONFIG = {
  aliases: {
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
    mx: 'marginHorizontal',
    bc: 'borderColor',
    bw: 'borderWidth',
    mr: 'marginRight',
  },
  tokens: {
    global: {
      primary: '#0000FF',
      secondary: '#FFFF00',
    },
    space: {
      'px': 1,
      '1': 4,
      '2': 8,
      '3': 12,
      '4': 16,
      '5': 20,
      '6': 24,
      '7': 28,
    },
  },
};
`;

// const codeAST = parse(code, {
//   sourceType: 'module',
//   plugins: ['typescript'],
// });

describe('ObjectExpressionASTtoJSObject', () => {
  it('It should create an object from the ast node', () => {
    const configCodeAST = parse(testConfig, {
      sourceType: 'module',
      plugins: ['typescript'],
    });
    let transformedObject: any = {};

    transformedObject = ObjectExpressionASTtoJSObject(
      configCodeAST.program.body[0].declaration.declarations[0].init
    );

    // const transformedCode = transformCode(code);
    expect(transformedObject).toMatchObject({
      aliases: {
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
        mx: 'marginHorizontal',
        bc: 'borderColor',
        bw: 'borderWidth',
        mr: 'marginRight',
      },
      tokens: {
        global: {
          primary: '#0000FF',
          secondary: '#FFFF00',
        },
        space: {
          'px': 1,
          '1': 4,
          '2': 8,
          '3': 12,
          '4': 16,
          '5': 20,
          '6': 24,
          '7': 28,
        },
      },
    });
  });
});

describe('aliasResolver', () => {
  it('It should resolve aliases from CONFIG', () => {
    let padding = aliasResolver('p', CONFIG);
    let backgroundColor = aliasResolver('bg', CONFIG);
    let color = aliasResolver('c', CONFIG);
    let Result = {
      padding,
      backgroundColor,
      color,
    };
    expect(Result).toMatchObject({
      padding: 'padding',
      backgroundColor: 'backgroundColor',
      color: 'color',
    });
  });
});

describe('tokenResolver', () => {
  it('It should resolve tokens from CONFIG', () => {
    let padding = tokenResolver('$space$1', CONFIG);
    let backgroundColor = tokenResolver('$primary', CONFIG);
    let color = tokenResolver('$secondary', CONFIG);
    let Result = {
      padding,
      backgroundColor,
      color,
    };
    expect(Result).toMatchObject({
      padding: 4,
      backgroundColor: '#0000FF',
      color: '#FFFF00',
    });
  });
});
