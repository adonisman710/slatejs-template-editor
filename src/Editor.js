import React, { useRef, useMemo } from "react";
import { Transforms, createEditor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  useSelected,
  useFocused,
  ReactEditor
} from "slate-react";

import { withHistory } from "slate-history";
import Options from "./Options";
import "./styles.css";
import { serialize, deserialize } from "./serialize";

/*
const initialValue = [
  {
    children: [
      { text: "hello" },
      {
        type: "inline-variable",
        label: "Variable1",
        children: [{ text: "" }]
      },
      { text: "hello" }
    ]
  },
  {
    type: "inline-variable",
    label: "Variable2",
    children: [{ text: "" }]
  }
];
*/

const variables = [
  {
    path: "element.properties.label",
    context: "Element",
    label: "Label"
  },
  {
    path: "element.properties.cost",
    context: "Element",
    label: "Cost"
  },
  {
    path: "element.properties.email",
    context: "Element",
    label: "Email"
  },
  {
    path: "connection.properties.weight",
    context: "Connection",
    label: "Weight"
  }
];
function getVariable(id) {
  return variables.find(d => d.path === id);
}

const Editor = props => {
  const { onChange } = props;
  const editorRef = useRef();
  const value = deserialize(props.value);

  const handleChange = value => {
    const serialized = serialize(value);
    console.log(serialized, deserialize(serialized));
    onChange(serialized);
  };

  const addWidget = ({ path }) => {
    const text = { text: "" };
    const voidNode = { type: "inline-variable", id: path, children: [text] };
    Transforms.insertNodes(editor, voidNode);
    ReactEditor.focus(editor);
    Transforms.move(editor, { distance: 1 });
  };

  const _handleOnBlur = e => {
    const target = e.relatedTarget;
    const ref = ReactEditor.toDOMNode(editor, editor);

    if (
      target &&
      ref &&
      (target.isEqualNode(ref.parentElement) ||
        editorRef.current.contains(target))
    ) {
      return;
    }
  };
  const editor = useMemo(
    () => withVariables(withHistory(withReact(createEditor()))),
    []
  );

  return (
    <div ref={editorRef} className="template-editor-container">
      <div className="template-editor">
        <Slate editor={editor} value={value} onChange={handleChange}>
          <Editable
            renderElement={props => <Element {...props} />}
            placeholder="Enter some plain text..."
            onBlur={_handleOnBlur}
          />
        </Slate>
      </div>
      <div
        className="template-editor-autocomplete"
        style={{ display: ReactEditor.isFocused(editor) ? "block" : "none" }}
      >
        <Options
          choices={variables}
          onSelect={d => {
            addWidget(d);
          }}
        />
      </div>
    </div>
  );
};

const Element = props => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "inline-variable":
      return <VariableElement {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const withVariables = editor => {
  const { isVoid, isInline } = editor;
  editor.isVoid = element =>
    element.type === "inline-variable" ? true : isVoid(element);
  editor.isInline = element =>
    element.type === "inline-variable" ? true : isInline(element);
  return editor;
};

const VariableElement = ({ attributes, children, element }) => {
  const { id } = element;
  const { label, context } = getVariable(id);
  const selected = useSelected();
  const focused = useFocused();
  return (
    <span
      {...attributes}
      className={`${focused && selected ? "focus" : ""} inline-variable`}
    >
      {children}
      <span className="content">
        <span className="tag" data-id="{id}">
          <span className="tag-context">{`${context}: `}</span>
          <span className="tag-value">{label}</span>
        </span>
      </span>
    </span>
  );
};

export default Editor;
