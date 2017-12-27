// helper
function findcomponent(j, astRoot) {
  return astRoot.find(j.ClassDeclaration);
}

function removeOld(...nodes) {
  nodes.forEach(node => node.remove());
}

function rightValue(n) {
  return n.get('value').node;
}

function getStaticPropTypesDeclaration(j) {
  return component =>
    component.find(j.ClassProperty, {
      static: true,
      key: { name: 'propTypes' },
    });
}

function findComponentName(component) {
  return component.get('id').node.name;
}

function assemblePropTypesAssignment(j) {
  return (left, right) =>
    j.expressionStatement(j.assignmentExpression('=', left, right));
}

function assembleComponentMemberExp(j) {
  return componentName =>
    j.memberExpression(j.identifier(componentName), j.identifier('propTypes'));
}

// main
function propTypesTransform(file, api) {
  const j = api.jscodeshift;
  const astRoot = j(file.source);

  const component = findcomponent(j, astRoot);
  const componentName = findComponentName(component);

  const componentNameDotPropTypes = assembleComponentMemberExp(j)(
    componentName
  );
  const propTypesObject = rightValue(
    getStaticPropTypesDeclaration(j)(component)
  );

  const finalPropTypeDeclaration = assemblePropTypesAssignment(j)(
    componentNameDotPropTypes,
    propTypesObject
  );

  component.insertAfter(finalPropTypeDeclaration);
  removeOld(getStaticPropTypesDeclaration(j)(component));

  return astRoot.toSource();
}

module.exports = propTypesTransform;
