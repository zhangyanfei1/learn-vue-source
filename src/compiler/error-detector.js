// detect problematic expressions in a template
export function detectErrors (ast, warn) {
  if (ast) {
    checkNode(ast, warn)
  }
}

function checkNode (node, warn) {

}