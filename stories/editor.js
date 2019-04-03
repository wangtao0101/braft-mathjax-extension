import React from "react";
import ReactDOM from "react-dom";
import BraftEditor from "braft-editor";

import "braft-editor/dist/index.css";
import Preview from "./preview.jsx";
import createMathjaxExtension from "../src";

BraftEditor.use(createMathjaxExtension());

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    const editorState = BraftEditor.createEditorState(
      JSON.parse(
        '{"blocks":[{"key":"darpv","text":" \\t\\t ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":1,"length":2,"key":0}],"data":{}}],"entityMap":{"0":{"type":"INLINETEX","mutability":"IMMUTABLE","data":{"teX":"aasdfasdf","displaystyle":false}}}}'
      )
    );

    this.state = {
      readOnly: false,
      editorState
    };
  }

  handleChange = editorState => {
    this.setState({ editorState });
  };

  logRAW = () => {
    console.log(this.state.editorState.toRAW());
    console.log(this.state.editorState.toHTML());
  };

  getHtml = () => {
    return this.state.editorState.toHTML();
  };

  setReadOnly = readOnly => {
    this.setState({
      readOnly
    });
  };

  getReadOnly = () => {
    this.state.readOnly;
  };

  render() {
    const { readOnly, editorState } = this.state;

    const controls = [];

    return (
      <div>
        <div className="demo" id="demo">
          <BraftEditor
            ref={element => {
              this.editor = element;
            }}
            controls={controls}
            extendControls={[
              {
                key: "log-raw",
                type: "button",
                text: "Log RAW",
                onClick: this.logRAW
              },
              {
                key: "custom-modal",
                type: "modal",
                text: "预览",
                modal: {
                  id: "my-moda-1",
                  title: "预览",
                  children: (
                    <div style={{ width: 600, padding: "10px" }}>
                      <Preview getHtml={this.getHtml} />
                    </div>
                  )
                }
              }
            ]}
            triggerChangeOnMount={false}
            value={editorState}
            onChange={this.handleChange}
            readOnly={readOnly}
            getReadOnly={this.getReadOnly}
            setReadOnly={this.setReadOnly}
          />
        </div>
      </div>
    );
  }
}
