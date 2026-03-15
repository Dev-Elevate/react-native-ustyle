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

// Parse rnu.config.ts and populate CONFIG

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

const PACKAGE_NAME = 'react-native-ustyle';
const VC_EXPORT_NAME = 'VC';
const RNU_STYLES_VAR = 'rnuStyles';
const EXCLUDED_PATH_SEGMENTS = ['node_modules', '.expo', '.next'];

function isExcludedFile(filename) {
  return EXCLUDED_PATH_SEGMENTS.some((segment) => filename?.includes(segment));
}

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
}

module.exports = function (babel) {
  const { types: t } = babel;

  let virtualComponentLocalImportName = VC_EXPORT_NAME;
  let rnuImportDeclarationPath;
  let importedComponents = [];
  let styleId = 0;
  let Styles = [];
  let styleExpression = [];

  function extractAttributeValue(attribute) {
    if (attribute.value.type === 'JSXExpressionContainer') {
      if (attribute.value.expression.type === 'ObjectExpression') {
        const value = {};
        attribute.value.expression.properties.forEach((prop) => {
          const propName =
            prop.key.type === 'StringLiteral' ? prop.key.value : prop.key.name;
          if (prop.value.value !== undefined) {
            value[propName] = prop.value.value;
          }
        });
        return value;
      }
      return attribute.value.expression.value;
    }
    if (attribute.value.type === 'JSXElement') {
      return attributesToObject(attribute.value.openingElement.attributes);
    }
    return attribute.value.value;
  }

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
      }

      const resolvedAlias = aliasResolver(attribute.name.name, CONFIG);
      const value = extractAttributeValue(attribute);

      if (value === undefined) return;

      if (Array.isArray(resolvedAlias)) {
        resolvedAlias.forEach((key) => {
          obj[key] = tokenResolver(value, CONFIG);
        });
      } else {
        obj[resolvedAlias] = tokenResolver(value, CONFIG);
      }
    });
    return obj;
  }

  function isVirtualComponentJSXElement(CONFIG, localImportName, path) {
    return (
      path.node.name.type === 'JSXMemberExpression' &&
      path.node.name.object.name === localImportName &&
      Boolean(CONFIG.components[path.node.name.property.name])
    );
  }

  return {
    name: 'babel-plugin-react-native-ustyle',
    visitor: {
      ImportDeclaration(path, state) {
        if (isExcludedFile(state?.filename)) return;
        if (path.node.source.value === PACKAGE_NAME) {
          rnuImportDeclarationPath = path;
          path?.traverse({
            ImportSpecifier(path) {
              if (path.node?.imported?.name !== VC_EXPORT_NAME) {
                importedComponents.push(path.node?.local?.name);
              } else {
                virtualComponentLocalImportName = path.node?.local?.name;
                traceAndUpdateImportedComponentsForVC(
                  path.parentPath.parentPath,
                  path.node.local.name,
                  importedComponents
                );
                path.remove();
              }
            },
          });
          path.node.source.value = 'react-native';
        }
      },
      JSXOpeningElement(path, state) {
        if (isExcludedFile(state?.filename)) return;

        if (
          isVirtualComponentJSXElement(
            CONFIG,
            virtualComponentLocalImportName,
            path
          )
        ) {
          const componentTagName = path.node.name.property.name;
          path.node.name = t.jsxIdentifier(componentTagName);
          importedComponents.push(componentTagName);
        }

        if (!importedComponents.includes(path.node.name.name)) return;

        const isConfiguredComponent = Boolean(
          CONFIG.components[path.node.name.name]
        );

        addRnuStyleIdInStyleArrayOfComponent(path.node.attributes, styleId);

        if (isConfiguredComponent) {
          const componentConfig = CONFIG.components[path.node.name.name];
          styleExpression.push(
            t.objectProperty(
              t.identifier('styles' + styleId++),
              t.valueToNode({
                ...(componentConfig?.baseStyle ?? {}),
                ...attributesToObject(path.node.attributes),
              })
            )
          );

          // Add variant styles to styleExpression if present in attributes
          path.node.attributes.forEach((attributeNode) => {
            const variantStyles =
              componentConfig?.variants?.[attributeNode.name.name];
            if (variantStyles) {
              const variantValue = variantStyles[attributeNode?.value?.value];
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

          path.node.name.name = componentConfig.tag;

          const tagName = path.node.name.name;
          const alreadyImported = rnuImportDeclarationPath.node?.specifiers.find(
            (s) => s.local.name === tagName
          );
          if (!alreadyImported) {
            rnuImportDeclarationPath.node?.specifiers.push(
              t.importSpecifier(t.identifier(tagName), t.identifier(tagName))
            );
          }
        } else {
          styleExpression.push(
            t.objectProperty(
              t.identifier('styles' + styleId++),
              t.valueToNode(attributesToObject(path.node.attributes))
            )
          );
        }

        const existingDeclaration = state.file.ast.program.body.find(
          (node) =>
            node.type === 'VariableDeclaration' &&
            node.declarations[0].id.name === RNU_STYLES_VAR
        );
        if (existingDeclaration) {
          state.file.ast.program.body = state.file.ast.program.body.filter(
            (node) =>
              node.type !== 'VariableDeclaration' ||
              node.declarations[0].id.name !== RNU_STYLES_VAR
          );
        }
        const declaration =
          existingDeclaration ??
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(RNU_STYLES_VAR),
              t.objectExpression(styleExpression)
            ),
          ]);
        Styles.push(declaration);
        state.file.ast.program.body.push(declaration);
      },
      Program(path, state) {
        if (isExcludedFile(state?.filename)) return;
        checkIfStylesheetImportedAndImport(path);
      },
    },
  };
};
