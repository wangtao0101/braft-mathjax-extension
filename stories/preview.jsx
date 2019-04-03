import React from "react";
import "braft-editor/dist/output.css";
import { processTeX } from '../src';

export default class Preview extends React.Component {
  componentDidMount() {
    MathJax.Hub.Queue(() => {
      for (const el of document.getElementsByClassName("inline-mathjax")) {
        processTeX(MathJax, el.childNodes[0], () => {});
      }
      for (const el of document.getElementsByClassName("block-mathjax")) {
        processTeX(MathJax, el.childNodes[0], () => {});
      }
    });
  }

  render() {
    return (
      <div className="braft-output-content">
        <div dangerouslySetInnerHTML={{ __html: this.props.getHtml() }} />
      </div>
    );
  }
}
