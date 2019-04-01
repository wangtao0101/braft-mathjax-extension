import React from "react";
import ReactDOM from "react-dom";
import BraftEditor from 'braft-editor'

import 'braft-editor/dist/index.css'

import { mathjaxExtension, myKeyBindingFn, handleKeyCommand } from '../src';

BraftEditor.use(mathjaxExtension)

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    const editorState = BraftEditor.createEditorState(
      JSON.parse(
        '{"blocks":[{"key":"darpv","text":" \\t\\t ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":1,"length":2,"key":0}],"data":{}}],"entityMap":{"0":{"type":"INLINETEX","mutability":"IMMUTABLE","data":{"teX":"aasdfasdf","displaystyle":false}}}}'
      )
    );
    const keyBindingFn = myKeyBindingFn(() => {
      return this.state.editorState;
    });

    this.state = {
      readOnly: false,
      editorState,
      keyBindingFn
    };
  }

  handleChange = editorState => {
    this.setState({ editorState });
  };

  logRAW = () => {
    console.log(this.state.editorState.toRAW());
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

    const controls = [
      'bold',
      'italic',
      'underline',
      'strike-through',
      'text-color',
    ]

    return (
      <div>
        <div className="demo" id="demo">
          <BraftEditor
            ref={element => {
              this.editor = element;
            }}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={this.state.keyBindingFn}
            controls={controls}
            extendControls={[
              {
                key: "log-raw",
                type: "button",
                text: "Log RAW",
                onClick: this.logRAW
              },
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
