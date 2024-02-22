"use strict";

// index.js
var fs = require("fs");
var path = require("path");
var CONFIG = {};
var { parse } = require("@babel/parser");
var { default: traverse } = require("@babel/traverse");
function ObjectExpressionASTtoJSObject(AstNode) {
  let obj = {};
  AstNode.properties.forEach((prop) => {
    const propName = prop.key.type === "StringLiteral" ? prop.key.value : prop.key.name;
    if (prop.value.value !== void 0) {
      obj[propName] = prop.value.value;
    }
  });
  return obj;
}
var filePath = path.join(process.cwd(), "rnu.config.ts");
var fileContent = fs.readFileSync(filePath, "utf8");
var configAST = parse(fileContent, {
  sourceType: "module",
  plugins: ["typescript"]
});
traverse(configAST, {
  CallExpression(path2) {
    if (path2.node.callee.name === "createConfig") {
      if (ObjectExpressionASTtoJSObject(path2.node.arguments[0].expression)) {
        CONFIG = ObjectExpressionASTtoJSObject(
          path2.node.arguments[0].expression
        );
      }
    }
  }
});
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
      if (t.isJSXSpreadAttribute(attribute)) {
        return;
      } else {
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
      }
    });
    return obj;
  }
  function addRnuStyleIdInStyleArrayOfCOmponent(jsxAttrArray, styleId2) {
    let styleAttr = jsxAttrArray.find((attr) => attr.name?.name === "style");
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
      ImportDeclaration(path2, opts) {
        if (opts.filename.includes("node_modules") || opts.filename.includes(".expo") || opts.filename.includes(".next"))
          return;
        if (path2.node.source.value === importName) {
          path2.traverse({
            ImportSpecifier(path3) {
              importedComponents.push(path3.node.local.name);
            }
          });
          path2.node.source.value = "react-native";
        }
      },
      JSXOpeningElement(path2, f, o) {
        if (f.filename.includes("node_modules") || f.filename.includes(".expo") || f.filename.includes(".next"))
          return;
        if (importedComponents.includes(path2.node.name.name)) {
          addRnuStyleIdInStyleArrayOfCOmponent(path2.node.attributes, styleId);
          styleExpression.push(
            t.objectProperty(
              t.identifier("styles" + styleId++),
              t.valueToNode(attributesToObject(path2.node.attributes))
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
      Program(path2, opts) {
        if (opts.filename.includes("node_modules") || opts.filename.includes(".expo") || opts.filename.includes(".next"))
          return;
        checkIfStylesheetImportedAndImport(path2);
      }
    }
  };
};
