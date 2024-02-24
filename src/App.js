import React, { useState } from "react";
import "./styles.css";
import EditorWrapper from "./EditorWrapper";

const data = {
  element: {
    properties: {
      label: "Exaptive",
      email: "noreply@exaptive.com",
      cost: 5000
    }
  },
  connection: {
    properties: {
      weight: 5.0
    }
  }
};

export default function App() {
  const [templates, setTemplates] = useState([
    {
      id: "label",
      label: "Label (string)",
      type: "string",
      value: "{{element.properties.label}} ({{connection.properties.weight}})"
    },
    {
      id: "size",
      label: "Size (number)",
      type: "number",
      value: "{{element.properties.cost}} / 5"
    }
  ]);
  return (
    <>
      <div className="section">
        <div className="container">
          <h4>Sample Data</h4>
          <pre className="code-block">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
      {templates.map(d => (
        <div className="section">
          <div className="container">
            <h4>{d.label}</h4>
            <EditorWrapper
              data={data}
              type={d.type}
              value={d.value}
              onChange={val => {
                setTemplates(
                  templates.map(p => {
                    if (p.id === d.id) return { ...p, value: val };
                    return p;
                  })
                );
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
