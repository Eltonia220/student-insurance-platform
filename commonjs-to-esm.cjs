module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Skip files that aren't JavaScript or have no content (e.g., .d.ts files)
  if (fileInfo.path.endsWith('.d.ts') || !fileInfo.source.trim()) {
    console.log(`Skipping file: ${fileInfo.path}`);
    return null; // Do not modify .d.ts or empty files
  }

  console.log(`Processing file: ${fileInfo.path}`);

  // Convert requires to imports
  root.find(j.CallExpression, {
    callee: { type: 'Identifier', name: 'require' },
  }).replaceWith((p) => {
    const arg = p.node.arguments[0];
    if (arg.type !== 'Literal') return p.node;

    return j.importDeclaration(
      [j.importDefaultSpecifier(j.identifier(p.parent.node.id.name))],
      j.literal(arg.value)
    );
  });

  // Convert module.exports to export default
  root.find(j.AssignmentExpression, {
    left: {
      object: { name: 'module' },
      property: { name: 'exports' },
    },
  }).replaceWith((p) => {
    return j.exportDefaultDeclaration(p.node.right);
  });

  return root.toSource();
};