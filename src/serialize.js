import escapeHtml from "escape-html";
import { Node, Text } from "slate";

const handlebarsRe = /{{[{]?(.*?)[}]?}}/;

function _serializeNode(node) {
  if (Text.isText(node)) {
    return escapeHtml(node.text);
  }
  const children = node.children.map((n) => _serializeNode(n)).join("");

  switch (node.type) {
    case "inline-variable":
      return `{{${escapeHtml(node.id)}}}`;
    default:
      return children;
  }
}

function _deserializeLine(str) {
  const children = [];
  str.split(handlebarsRe).forEach((d, i) => {
    const isVariable = i % 2 === 1;
    if (isVariable) {
      children.push({
        type: "inline-variable",
        id: d,
        children: [{ text: "" }]
      });
    } else {
      children.push({ text: d });
    }
  });
  return { children };
}

// slate -> handlebarss
export const serialize = (nodes) => {
  return nodes.map((n) => _serializeNode(n)).join("\n");
};

// handlebars -> slate
// no formatting
export const deserialize = (str) => {
  const lines = str.split(/\r?\n/);
  return lines.map(_deserializeLine);
};

export const getVariables = (str) =>
  str.split(handlebarsRe).filter((d, i) => i % 2 === 1);

// export default { serialize, deserialize };
