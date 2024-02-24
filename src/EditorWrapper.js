import React, { useState, useEffect } from "react";
import { runNumberExpresion, runStringExpresion } from "./utils";
import Editor from "./Editor";

const EditorWrapper = props => {
  const { type = "string", data = {}, value = "", onChange = () => {} } = props;
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const _onChange = val => {
    runExpression(val);
    onChange(val);
  };
  const runExpression = val => {
    try {
      const func = type === "number" ? runNumberExpresion : runStringExpresion;
      setOutput(func(val, data));
      setError(false);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    runExpression(value);
  }, []);

  return (
    <>
      <Editor onChange={_onChange} value={value} />
      <pre className="code-block">
        <div className="code-section">
          <div className="code-title">Template: </div>
          <span>{value}</span>
        </div>
        {error ? (
          <div className="error-section">
            <div className="code-title">Error: </div>
            <div>{error}</div>
          </div>
        ) : (
          <div className="code-section">
            <div className="code-title">Output: </div>
            <div>{output}</div>
          </div>
        )}
      </pre>
    </>
  );
};

export default EditorWrapper;
