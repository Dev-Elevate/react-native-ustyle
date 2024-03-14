const fs = require('fs');
const path = require('path');
let CONFIG = {};
const { parse } = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const {
  aliasResolver,
  tokenResolver,
  ObjectExpressionASTtoJSObject,
  addRnuStyleIdInStyleArrayOfComponent,
  checkIfStylesheetImportedAndImport,
} = require('./utils');

// ----------------- Reading rnu.config.ts file and extracting the CONFIG object -----------------

const filePath = path.join(process.cwd(), 'rnu.config.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

const configAST = parse(fileContent, {
  sourceType: 'module',
  plugins: ['typescript'],
});

if (configAST) {
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
}

// -------------------------------------------------------------------------------------------------

function traceAndUpdateImportedComponentsForVC(
  programPath,
  localName,
  importedComponents
) {
  programPath.traverse({
    VariableDeclarator(path) {
      if (
        localName === path.node.init.name &&
        path.node.id.type === 'ObjectPattern'
      ) {
        path.node.id.properties.forEach((property) => {
          if (property.type === 'ObjectProperty') {
            importedComponents.push(property.key.name);
          }
        });
        path.remove();
      }
    },
  });
  console.log('importedComponents', importedComponents);
  // console.log(
  //   'traceAndUpdateImportedComponentsForVC',
  //   programPath.parentPath.parentPath,
  //   localName,
  //   importedComponents
  // );

  // CONFIG.components[localName].components.forEach((component) => {
  //   if (importedComponents.includes(component)) {
  //     return;
  //   } else {
  //     importedComponents.push(component);
  //     traceAndUpdateImportedComponentsForVC(component, importedComponents);
  //   }
  // });
}

module.exports = function (babel) {
  const { types: t } = babel;

  let importName = 'react-native-ustyle';
  let VIRTUAL_COMPONENT_EXPORT_NAME = 'VC';
  let virtualComponentLocalImportName = 'VC';
  let importedComponents = [];
  let styleId = 0;
  let Styles = [];
  let styleExpression = [];

  function attributesToObject(attributes) {
    if (!Array.isArray(attributes)) {
      throw new TypeError('Expected attributes to be an array');
    }

    const obj = {};
    attributes.forEach((attribute) => {
      if (
        t.isJSXSpreadAttribute(attribute) ||
        !CONFIG?.aliases[attribute?.name?.name]
      ) {
        return;
      } else {
        // Support for multi aliases
        if (Array.isArray(aliasResolver(attribute.name.name, CONFIG))) {
          aliasResolver(attribute.name.name, CONFIG).forEach((key) => {
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
              value = attributesToObject(
                attribute.value.openingElement.attributes
              );
            } else {
              value = attribute.value.value;
            }

            if (value !== undefined) {
              obj[key] = tokenResolver(value, CONFIG);
            }
          });
        } else {
          const key = aliasResolver(attribute.name.name, CONFIG);
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
            value = attributesToObject(
              attribute.value.openingElement.attributes
            );
          } else {
            value = attribute.value.value;
          }

          if (value !== undefined) {
            obj[key] = tokenResolver(value, CONFIG);
          }
        }
      }
    });
    return obj;
  }
  function isVirtualComponentJSXElement(CONFIG, localImportName, path) {
    if (
      path.node.name.type === 'JSXMemberExpression' &&
      path.node.name.object.name === localImportName &&
      CONFIG.components[path.node.name.property.name]
    ) {
      return true;
    }
    return false;
  }

  return {
    name: 'ast-transform', // not required
    visitor: {
      ImportDeclaration(path, opts) {
        if (
          opts?.filename?.includes('node_modules') ||
          opts?.filename?.includes('.expo') ||
          opts?.filename?.includes('.next')
        )
          return;
        if (path.node.source.value === importName) {
          // path.node.specifiers.push(
          //   t.importSpecifier(
          //     t.identifier("StyleSheet"),
          //     t.identifier("StyleSheet")
          //   )
          // );
          path?.traverse({
            ImportSpecifier(path) {
              if (path.node?.imported?.name !== VIRTUAL_COMPONENT_EXPORT_NAME) {
                importedComponents.push(path.node?.local?.name);
              } else {
                virtualComponentLocalImportName = path.node?.local?.name;
                traceAndUpdateImportedComponentsForVC(
                  path.parentPath.parentPath,
                  path.node.local.name,
                  importedComponents
                );
                // path.remove();
              }
            },
          });
          path.node.source.value = 'react-native';
        }
      },
      JSXOpeningElement(path, f, o) {
        let isVC = false;
        if (
          f?.filename?.includes('node_modules') ||
          f?.filename?.includes('.expo') ||
          f?.filename?.includes('.next')
        )
          return;
        if (
          isVirtualComponentJSXElement(
            CONFIG,
            virtualComponentLocalImportName,
            path
          )
        ) {
          let JSXTag = path.node.name.property.name;
          path.node.name = t.jsxIdentifier(JSXTag);
          importedComponents.push(JSXTag);
        }
        if (importedComponents.includes(path.node.name.name)) {
          if (CONFIG.components[path.node.name.name]) {
            isVC = true;
          }
          // Create a variable declaration for the object
          addRnuStyleIdInStyleArrayOfComponent(path.node.attributes, styleId);
          if (isVC) {
            console.log(
              isVC,
              path.node.name.name,
              CONFIG.components[path.node.name.name]
            );
            styleExpression.push(
              t.objectProperty(
                t.identifier('styles' + styleId++),
                t.valueToNode({
                  ...attributesToObject(path.node.attributes),
                  ...(CONFIG.components[path.node.name.name]?.baseStyle ?? {}),
                })
              )
            );
            // check if variants are present in attributes and add them to the styleExpression
            path.node.attributes.forEach((attributeNode) => {
              if (
                CONFIG.components[path.node.name.name]?.variants?.[
                  attributeNode.name.name
                ]
              ) {
                const variantName = attributeNode.name.name;
                const variantValue =
                  CONFIG.components[path.node.name.name]?.variants?.[
                    variantName
                  ][attributeNode?.value?.value];
                addRnuStyleIdInStyleArrayOfComponent(
                  path.node.attributes,
                  styleId
                );
                styleExpression.push(
                  t.objectProperty(
                    t.identifier('styles' + styleId++),
                    t.valueToNode(variantValue)
                  )
                );
              }
            });
            path.node.name.name = CONFIG.components[path.node.name.name].tag;
          } else {
            styleExpression.push(
              t.objectProperty(
                t.identifier('styles' + styleId++),
                t.valueToNode(attributesToObject(path.node.attributes))
              )
            );
          }
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
          opts?.filename?.includes('node_modules') ||
          opts?.filename?.includes('.expo') ||
          opts?.filename?.includes('.next')
        )
          return;
        checkIfStylesheetImportedAndImport(path);
      },
    },
  };
};
