// helper
function findScribdComponent(j, astRoot) {
  return astRoot.find(j.ClassDeclaration);
}

function removeOld(...nodes) {
  nodes.forEach(node => node.remove());
}

function rightValue(n) {
  return n.get('value').node;
}

function getStaticPropTypesDeclaration(j) {
  return scribdComponent =>
    scribdComponent.find(j.ClassProperty, {
      static: true,
      key: { name: 'propTypes' },
    });
}

function findComponentName(scribdComponent) {
  return scribdComponent.get('id').node.name;
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

  const scribdComponent = findScribdComponent(j, astRoot);
  const componentName = findComponentName(scribdComponent);

  const componentNameDotPropTypes = assembleComponentMemberExp(j)(
    componentName
  );
  const propTypesObject = rightValue(
    getStaticPropTypesDeclaration(j)(scribdComponent)
  );

  const finalPropTypeDeclaration = assemblePropTypesAssignment(j)(
    componentNameDotPropTypes,
    propTypesObject
  );

  scribdComponent.insertAfter(finalPropTypeDeclaration);
  removeOld(getStaticPropTypesDeclaration(j)(scribdComponent));

  return astRoot.toSource();
}

module.exports = propTypesTransform;
