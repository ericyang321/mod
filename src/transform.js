function findProptypePath(j, astRoot) {
  return astRoot.find(j.ClassProperty, {
    static: true,
    key: { name: 'propTypes' }
  });
}

function craftProptypesObject(j) {
  return (componentName, propTypePropertiesList) => (
    propTypePropertiesList.map(prop => (
      j.assignmentExpression(
        '=',
        j.memberExpression(j.identifier(componentName), prop.key),
        prop.value
      )
    ))
  );
}

function findProptypePropertiesList(propTypesPath) {
  return propTypesPath.get('value').node.properties.map(keyValuesOnly);
}

function keyValuesOnly(propTypeProperty) {
  return {
    key: propTypeProperty.key,
    value: propTypeProperty.value
  };
}

function findEs6ClassPath(j, astRoot) {
  return astRoot.find(j.ClassDeclaration, {
    superClass: { object: { object: { name: 'Scribd' } } }
  });
}

function findComponentNameNode(es6ClassNode) {
  return es6ClassNode.get('id').node.name;
}

// main
function transform(file, api) {
  const j = api.jscodeshift;
  const astRoot = j(file.source);
  const propTypeProperties = findProptypePropertiesList(
    findProptypePath(j, astRoot)
  );

  if (propTypeProperties == undefined) {
    throw new Error(`Could not find propType declaration from ${file.path}`);
  }

  const componentName = findComponentNameNode(findEs6ClassPath(j, astRoot));
  const es6Class = findEs6ClassPath(j, astRoot);

  console.log(propTypeProperties);

  es6Class.insertAfter(craftProptypesObject(j)(componentName, propTypeProperties));

  return astRoot.toSource();
}

module.exports = transform;
