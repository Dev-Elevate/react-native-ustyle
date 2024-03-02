const fs = require('fs');
const path = require('path');
let CONFIG = {};
const { parse } = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');

function ObjectExpressionASTtoJSObject(AstNode) {
  function processProperty(property) {
    const propName =
      property.key.type === 'StringLiteral'
        ? property.key.value
        : property.key.name;

    if (property.value.type === 'ObjectExpression') {
      return {
        [propName]: ObjectExpressionASTtoJSObject(property.value),
      };
    }

    if (property.value.type === 'ArrayExpression') {
      return {
        [propName]: property.value.elements.map((element) => {
          if (element.type === 'ObjectExpression') {
            return ObjectExpressionASTtoJSObject(element);
          }
          return element.value;
        }),
      };
    }

    return {
      [propName]: property.value.value,
    };
  }

  let obj = {};
  AstNode.properties.forEach((prop) => {
    Object.assign(obj, processProperty(prop));
  });
  return obj;
}

const filePath = path.join(process.cwd(), 'rnu.config.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

const configAST = parse(fileContent, {
  sourceType: 'module',
  plugins: ['typescript'],
});

traverse(configAST, {
  CallExpression(path) {
    if (path.node.callee.name === 'createConfig') {
      if (ObjectExpressionASTtoJSObject(path.node.arguments[0].expression)) {
        CONFIG = ObjectExpressionASTtoJSObject(
          path.node.arguments[0].expression
        );
      }
    }
  },
});

module.exports = function (babel) {
  const { types: t } = babel;

  let importName = 'react-native-ustyle';
  let importedComponents = [];
  let styleId = 0;
  let Styles = [];
  let styleExpression = [];
  function aliasResolver(name) {
    if (name in CONFIG.aliases) {
      return CONFIG.aliases[name];
    }
    return name;
  }
  function tokenResolver(token) {
    //parse token into array
    if (
      typeof token === 'string' &&
      (token.startsWith('$') || token.startsWith('-$'))
    ) {
      let tokenPath = token.split('$');

      let isNeg = false;
      if (tokenPath[0] === '-') {
        isNeg = true;
      }
      tokenPath = tokenPath.slice(1);
      // resolving for global tokens
      if (tokenPath.length === 1) {
        tokenPath = ['global', tokenPath[0]];
      }
      let value = CONFIG.tokens;
      tokenPath.forEach((key, ind) => {
        if (value) {
          value = value[key];
        }
      });

      if (value) {
        return isNeg ? -1 * value : value;
      }
    }
    return token;
  }
  function checkIfStylesheetImportedAndImport(programPath) {
    let importDeclaration = programPath.node.body.find(
      (node) =>
        node.type === 'ImportDeclaration' &&
        node.source.value === 'react-native'
    );
    if (importDeclaration) {
      // delete the old importspecifier
      // importDeclaration.specifiers = importDeclaration.specifiers.filter(
      //   (specifier) => specifier.imported.name !== "StyleSheet"
      // );
      // programPath.node.body.unshift(
      //   t.importDeclaration(
      //     [
      //       t.importSpecifier(
      //         t.identifier("StyleSheet"),
      //         t.identifier("StyleSheet")
      //       ),
      //     ],
      //     t.stringLiteral("react-native")
      //   )
      // );
    }
  }
  function attributesToObject(attributes) {
    if (!Array.isArray(attributes)) {
      throw new TypeError('Expected attributes to be an array');
    }

    const obj = {};
    attributes.forEach((attribute) => {
      if (t.isJSXSpreadAttribute(attribute)) {
        return;
      } else {
        const key = aliasResolver(attribute.name.name);
        let value;
        if (attribute.value.type === 'JSXExpressionContainer') {
          if (attribute.value.expression.type === 'ObjectExpression') {
            value = {};
            attribute.value.expression.properties.forEach((prop) => {
              const propName =
                prop.key.type === 'StringLiteral'
                  ? prop.key.value
                  : prop.key.name;
              if (prop.value.value !== undefined) {
                value[propName] = prop.value.value;
              }
            });
          } else {
            value = attribute.value.expression.value;
          }
        } else if (attribute.value.type === 'JSXElement') {
          value = attributesToObject(attribute.value.openingElement.attributes);
        } else {
          value = attribute.value.value;
        }

        if (value !== undefined) {
          obj[key] = tokenResolver(value);
        }
      }
    });
    return obj;
  }
  function addRnuStyleIdInStyleArrayOfCOmponent(jsxAttrArray, styleId) {
    // find the style attribute
    let styleAttr = jsxAttrArray.find((attr) => attr.name?.name === 'style');
    // insert the styleId in the style array
    // style can be an array or a single object
    if (styleAttr) {
      // if the style attribute is a single object then convert it to an array
      if (styleAttr.value.expression.type !== 'ArrayExpression') {
        styleAttr.value.expression = t.arrayExpression([
          styleAttr.value.expression,
        ]);
      }
      let styleArray = styleAttr.value.expression.elements;
      styleArray.push(t.identifier('rnuStyles.styles' + styleId));
    } else {
      // create a new style attribute
      jsxAttrArray.push(
        t.jSXAttribute(
          t.jSXIdentifier('style'),
          t.jSXExpressionContainer(
            t.arrayExpression([t.identifier('rnuStyles.styles' + styleId)])
          )
        )
      );
    }
  }
  return {
    name: 'ast-transform', // not required
    visitor: {
      ImportDeclaration(path, opts) {
        if (
          opts.filename.includes('node_modules') ||
          opts.filename.includes('.expo') ||
          opts.filename.includes('.next')
        )
          return;
        if (path.node.source.value === importName) {
          // path.node.specifiers.push(
          //   t.importSpecifier(
          //     t.identifier("StyleSheet"),
          //     t.identifier("StyleSheet")
          //   )
          // );
          path.traverse({
            ImportSpecifier(path) {
              importedComponents.push(path.node.local.name);
            },
          });
          path.node.source.value = 'react-native';
        }
      },
      JSXOpeningElement(path, f, o) {
        if (
          f.filename.includes('node_modules') ||
          f.filename.includes('.expo') ||
          f.filename.includes('.next')
        )
          return;
        if (importedComponents.includes(path.node.name.name)) {
          // Create a variable declaration for the object
          addRnuStyleIdInStyleArrayOfCOmponent(path.node.attributes, styleId);
          styleExpression.push(
            t.objectProperty(
              t.identifier('styles' + styleId++),
              t.valueToNode(attributesToObject(path.node.attributes))
            )
          );
          // check if rnuStyles is already declared
          let declaration = f.file.ast.program.body.find(
            (node) =>
              node.type === 'VariableDeclaration' &&
              node.declarations[0].id.name === 'rnuStyles'
          );
          if (declaration) {
            f.file.ast.program.body = f.file.ast.program.body.filter(
              (node) =>
                node.type !== 'VariableDeclaration' ||
                node.declarations[0].id.name !== 'rnuStyles'
            );
          } else {
            declaration = t.variableDeclaration('const', [
              t.variableDeclarator(
                t.identifier('rnuStyles'),
                // Not using StyleSheet.create since it is not working in the latest metro version
                // t.callExpression(t.identifier("StyleSheet.create"), [
                t.objectExpression(styleExpression)
                // ])
              ),
            ]);
          }
          Styles.push(declaration);
          f.file.ast.program.body.push(declaration);
        }
      },
      Program(path, opts) {
        if (
          opts.filename.includes('node_modules') ||
          opts.filename.includes('.expo') ||
          opts.filename.includes('.next')
        )
          return;
        checkIfStylesheetImportedAndImport(path);
      },
    },
  };
};
