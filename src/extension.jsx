import React from "react";

import loadMathJax from "./mathjax/mathjax/loadMathJax";
import insertTeX from "./mathjax/modifiers/insertTeX";
import InlineTeX from "./mathjax/components/InlineTeX";
import initCompletion from "./mathjax/mathjax/completion";
import TeXBlock from "./mathjax/components/TeXBlock";

const defaultConfig = {
  macros: {},
  completion: "auto"
};

export default function createMathjaxExtension(config = {}) {
  const { macros, completion, script, mathjaxConfig } = Object.assign(
    defaultConfig,
    config
  );

  loadMathJax(defaultConfig);

  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
    getReadOnly: undefined,
    setReadOnly: undefined,
    getEditorRef: undefined,
    completion: undefined,
    teXToUpdate: {}
  };

  const _insertTeX = (block = false) => {
    const originEditorState = store.getEditorState();
    const editorState = insertTeX(originEditorState, block);
    store.setEditorState(editorState);
  };

  const mathjaxExtension = [
    {
      type: "entity",
      name: "INLINETEX",
      control: props => ({
        key: "inline-tex",
        type: "button",
        text: "内联公式",
        onClick: () => _insertTeX()
      }),
      component: props => {
        // 通过entityKey获取entity实例，关于entity实例请参考https://github.com/facebook/draft-js/blob/master/src/model/entity/DraftEntityInstance.js
        const entity = props.contentState.getEntity(props.entityKey);
        // 通过entity.getData()获取该entity的附加数据
        const getStore = () => store;
        return <InlineTeX {...props} getStore={getStore} />;
      },
      data: {
        teX: ""
      },
      exporter: (entityObject, originalText) => {
        // 注意此处的entityObject并不是一个entity实例，而是一个包含type、mutability和data属性的对象
        return (
          <span className="inline-mathjax">
            <script type="math/tex;">{entityObject.data.teX}</script>
          </span>
        );
      }
    },
    {
      type: "control",
      control: props => ({
        key: "block-tex",
        type: "button",
        text: "块公式",
        onClick: () => _insertTeX(true)
      })
    },
    {
      type: "block",
      name: "blockTex",
      rendererFn: ({ editor }) => {
        return {
          component: TeXBlock,
          editable: false,
          props: { getStore: () => editor.store }
        };
      },
      exporter: (entityObject, originalText) => {
        // 注意此处的entityObject并不是一个entity实例，而是一个包含type、mutability和data属性的对象
        if (originalText.data.teX) {
          return (
            <div className="block-mathjax">
              <script type="math/tex; mode=display">
                {originalText.data.teX}
              </script>
            </div>
          );
        }
        return null;
      }
    },
    {
      type: "prop-interception",
      interceptor: (editorProps, editor) => {
        if (!editor.store) {
          store.getEditorState = () => editor.state.editorState;
          store.setEditorState = editorState => {
            editor.props.onChange(editorState);
          };
          store.getReadOnly = editorProps.getReadOnly;
          store.setReadOnly = editorProps.setReadOnly;
          store.getEditorRef = () => editor.editor;
          store.completion = initCompletion(
            defaultConfig.completion,
            defaultConfig.macros
          );
          editor.store = store;
        }
        if (
          editor.state !== undefined &&
          typeof store.completion === "function"
        ) {
          store.completion = store.completion(editor.state.editorState);
        }
        return editorProps;
      }
    }
  ];

  return mathjaxExtension;
}
