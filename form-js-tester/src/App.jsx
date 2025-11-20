import { useState, useEffect, useRef } from "react";

function App() {
  const [schema, setSchema] = useState(null);
  const [formData, setFormData] = useState(null);
  const [rawOutput, setRawOutput] = useState("");
  const [initialInput, setInitialInput] = useState("");   // <-- pasted initial data

  const containerRef = useRef(null);
  const formInstance = useRef(null);

  // Load UMD viewer script once
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@bpmn-io/form-js/dist/form-viewer.umd.js";
    script.async = true;

    script.onload = () => console.log("FormViewer loaded");

    document.body.appendChild(script);

    return () => document.body.removeChild(script);
  }, []);

  // Render form on schema or input data changes
  useEffect(() => {
    if (!schema || !window.FormViewer || !containerRef.current) return;

    const { Form } = window.FormViewer;

    if (formInstance.current) {
      formInstance.current.destroy();
    }

    const form = new Form({
      container: containerRef.current,
    });

    form.importSchema(schema, formData || {}).catch(console.error);

    form.on("submit", (event) => {
      setFormData(event.data);
      setRawOutput(JSON.stringify(event.data, null, 2));
    });

    formInstance.current = form;
    return () => form.destroy();
  }, [schema, formData]);

  // Load schema file
  async function handleSchemaFilePick(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const obj = JSON.parse(await file.text());
      setSchema(obj);
      setFormData({});
      setRawOutput("");
    } catch {
      alert("Invalid JSON schema");
    }
  }

  // Load pasted initial JSON
  function applyInitialData() {
    try {
      const obj = JSON.parse(initialInput);
      setFormData(obj);
      setRawOutput(JSON.stringify(obj, null, 2));
    } catch {
      alert("Invalid JSON in initial data");
    }
  }

  // Apply edited output back into the form
  function applyEditedOutput() {
    try {
      const parsed = JSON.parse(rawOutput);
      setFormData(parsed);
    } catch {
      alert("Invalid JSON in editor");
    }
  }

  function copyJSON() {
    navigator.clipboard.writeText(rawOutput);
    alert("Copied!");
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Form-JS React Tester</h2>

      {/* Load schema */}
      <h3>Form Schema</h3>
      <input type="file" accept=".json,.form" onChange={handleSchemaFilePick} />

      {/* Paste initial data */}
      <h3 style={{ marginTop: 25 }}>Initial Data (Paste JSON)</h3>
      <textarea
        placeholder="Paste initial JSON here..."
        value={initialInput}
        onChange={(e) => setInitialInput(e.target.value)}
        style={{
          width: "100%",
          height: "150px",
          padding: 10,
          fontFamily: "monospace",
          background: "#f7f7f7",
        }}
      ></textarea>

      <button onClick={applyInitialData} style={{ marginTop: 10 }}>
        Load Initial Data Into Form
      </button>

      {/* Form viewer */}
      <div
        ref={containerRef}
        style={{
          marginTop: 30,
          padding: 20,
          border: "1px solid #ccc",
          borderRadius: 4,
          background: "#fafafa",
        }}
      />

      {/* Editable output */}
      {schema && (
        <div style={{ marginTop: 30 }}>
          <h3>Form Output (Editable JSON)</h3>
          <textarea
            value={rawOutput}
            onChange={(e) => setRawOutput(e.target.value)}
            style={{
              width: "100%",
              height: "250px",
              padding: 10,
              fontFamily: "monospace",
              background: "#f0f0f0",
            }}
          />

          <button onClick={applyEditedOutput} style={{ marginRight: 10 }}>
            Apply Edited JSON
          </button>

          <button onClick={copyJSON}>Copy JSON</button>
        </div>
      )}
    </div>
  );
}

export default App;
