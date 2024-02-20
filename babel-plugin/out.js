"use strict";

// index.js
var CONFIG = {
  p: "padding",
  m: "margin",
  t: "top",
  b: "bottom",
  l: "left",
  r: "right",
  h: "height",
  w: "width",
  bg: "backgroundColor",
  c: "color"
};
module.exports = function(babel) {
  const { types: t } = babel;
  let importName = "react-native-ustyle";
  let importedComponents = [];
  let styleId = 0;
  let Styles = [];
  let styleExpression = [];
  function resolver(name) {
    if (name in CONFIG) {
      return CONFIG[name];
    }
    return name;
  }
  function checkIfStylesheetImportedAndImport(programPath) {
    let importDeclaration = programPath.node.body.find(
      (node) => node.type === "ImportDeclaration" && node.source.value === "react-native"
    );
    if (importDeclaration) {
    }
  }
  function attributesToObject(attributes) {
    if (!Array.isArray(attributes)) {
      throw new TypeError("Expected attributes to be an array");
    }
    const obj = {};
    attributes.forEach((attribute) => {
      const key = resolver(attribute.name.name);
      let value;
      if (attribute.value.type === "JSXExpressionContainer") {
        if (attribute.value.expression.type === "ObjectExpression") {
          value = {};
          attribute.value.expression.properties.forEach((prop) => {
            const propName = prop.key.type === "StringLiteral" ? prop.key.value : prop.key.name;
            if (prop.value.value !== void 0) {
              value[propName] = prop.value.value;
            }
          });
        } else {
          value = attribute.value.expression.value;
        }
      } else if (attribute.value.type === "JSXElement") {
        value = attributesToObject(attribute.value.openingElement.attributes);
      } else {
        value = attribute.value.value;
      }
      if (value !== void 0) {
        obj[key] = value;
      }
    });
    return obj;
  }
  function addRnuStyleIdInStyleArrayOfCOmponent(jsxAttrArray, styleId2) {
    let styleAttr = jsxAttrArray.find((attr) => attr.name.name === "style");
    if (styleAttr) {
      if (styleAttr.value.expression.type !== "ArrayExpression") {
        styleAttr.value.expression = t.arrayExpression([
          styleAttr.value.expression
        ]);
      }
      let styleArray = styleAttr.value.expression.elements;
      styleArray.push(t.identifier("rnuStyles.styles" + styleId2));
    } else {
      jsxAttrArray.push(
        t.jSXAttribute(
          t.jSXIdentifier("style"),
          t.jSXExpressionContainer(
            t.arrayExpression([t.identifier("rnuStyles.styles" + styleId2)])
          )
        )
      );
    }
  }
  return {
    name: "ast-transform",
    // not required
    visitor: {
      ImportDeclaration(path, opts) {
        if (opts.filename.includes("node_modules") || opts.filename.includes(".expo") || opts.filename.includes(".next"))
          return;
        if (path.node.source.value === importName) {
          path.traverse({
            ImportSpecifier(path2) {
              importedComponents.push(path2.node.local.name);
            }
          });
          path.node.source.value = "react-native";
        }
      },
      JSXOpeningElement(path, f, o) {
        if (f.filename.includes("node_modules") || f.filename.includes(".expo") || f.filename.includes(".next"))
          return;
        if (importedComponents.includes(path.node.name.name)) {
          addRnuStyleIdInStyleArrayOfCOmponent(path.node.attributes, styleId);
          styleExpression.push(
            t.objectProperty(
              t.identifier("styles" + styleId++),
              t.valueToNode(attributesToObject(path.node.attributes))
            )
          );
          let declaration = f.file.ast.program.body.find(
            (node) => node.type === "VariableDeclaration" && node.declarations[0].id.name === "rnuStyles"
          );
          if (declaration) {
            f.file.ast.program.body = f.file.ast.program.body.filter(
              (node) => node.type !== "VariableDeclaration" || node.declarations[0].id.name !== "rnuStyles"
            );
          } else {
            declaration = t.variableDeclaration("const", [
              t.variableDeclarator(
                t.identifier("rnuStyles"),
                // Not using StyleSheet.create since it is not working in the latest metro version
                // t.callExpression(t.identifier("StyleSheet.create"), [
                t.objectExpression(styleExpression)
                // ])
              )
            ]);
          }
          Styles.push(declaration);
          f.file.ast.program.body.push(declaration);
        }
      },
      Program(path, opts) {
        if (opts.filename.includes("node_modules") || opts.filename.includes(".expo") || opts.filename.includes(".next"))
          return;
        checkIfStylesheetImportedAndImport(path);
      }
    }
  };
};
