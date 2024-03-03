import * as t from '@babel/types';

function checkIfStylesheetImportedAndImport(programPath) {
  let importDeclaration = programPath.node.body.find(
    (node) =>
      node.type === 'ImportDeclaration' && node.source.value === 'react-native'
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

module.exports = {
  checkIfStylesheetImportedAndImport,
  ObjectExpressionASTtoJSObject,
  addRnuStyleIdInStyleArrayOfCOmponent,
};
