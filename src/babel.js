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
module.exports = function (babel) {
  const { types: t } = babel;
  let importName = 'react-native-ustyle';
  let importedComponents = [];
  let styleId = 0;
  let Styles = [];
  let styleExpression = [];
  function resolver(name) {
    console.log(name, 'resolver');
    if (name in CONFIG) {
      console.log(name, CONFIG[name]);
      return CONFIG[name];
    }
    return name;
  }
  function checkIfStylesheetImportedAndImport(programPath) {
    let importDeclaration = programPath.node.body.find(
      (node) =>
        node.type === 'ImportDeclaration' &&
        node.source.value === 'react-native'
    );
    if (!importDeclaration) {
      programPath.node.body.unshift(
        t.importDeclaration(
          [
            t.importSpecifier(
              t.identifier('StyleSheet'),
              t.identifier('StyleSheet')
            ),
          ],
          t.stringLiteral('react-native')
        )
      );
    }
  }
  function attributesToObject(attributes) {
    if (!Array.isArray(attributes)) {
      throw new TypeError('Expected attributes to be an array');
    }

    const obj = {};
    attributes.forEach((attribute) => {
      const key = resolver(attribute.name.name);
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
        obj[key] = value;
      }
    });
    return obj;
  }
  function addRnuStyleIdInStyleArrayOfCOmponent(jsxAttrArray, styleId) {
    // find the style attribute
    let styleAttr = jsxAttrArray.find((attr) => attr.name.name === 'style');
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
      ImportDeclaration(path) {
        if (path.node.source.value === importName) {
          path.traverse({
            ImportSpecifier(path) {
              importedComponents.push(path.node.local.name);
            },
          });
          path.node.source.value = 'react-native';
        }
      },
      JSXOpeningElement(path, f, o) {
        if (f.file.opts.filename.includes('node_modules')) return;
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
          console.log(declaration);
          if (declaration) {
            // delete the old declaration
            f.file.ast.program.body = f.file.ast.program.body.filter(
              (node) =>
                node.type !== 'VariableDeclaration' ||
                node.declarations[0].id.name !== 'rnuStyles'
            );
          } else {
            declaration = t.variableDeclaration('const', [
              t.variableDeclarator(
                t.identifier('rnuStyles'),
                t.callExpression(t.identifier('StyleSheet.create'), [
                  t.objectExpression(styleExpression),
                ])
              ),
            ]);
          }
          Styles.push(declaration);
          console.log(attributesToObject(path.node.attributes));
          f.file.ast.program.body.push(declaration);
        }
      },
      Program(path, opts) {
        if (opts.filename.includes('node_modules')) return;
        //path.node.body.push(Styles[0]);
        checkIfStylesheetImportedAndImport(path);
      },
    },
  };
};
