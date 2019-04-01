import loadMathJax from "./mathjax/mathjax/loadMathJax";
import { myKeyBindingFn, findInlineTeXEntities } from "./mathjax/utils";
import insertTeX from "./mathjax/modifiers/insertTeX";
import InlineTeX from "./mathjax/components/InlineTeX";
import initCompletion from "./mathjax/mathjax/completion";
import TeXBlock from "./mathjax/components/TeXBlock";

const defaultConfig = {
  macros: {},
  completion: "auto"
};

loadMathJax(defaultConfig);

const store = {
  getEditorState: undefined,
  setEditorState: undefined,
  getReadOnly: undefined,
  setReadOnly: undefined,
  getEditorRef: undefined,
  completion: initCompletion(defaultConfig.completion, defaultConfig.macros),
  teXToUpdate: {}
};

let initFisrtCompletion = false;

const mathjaxExtension = [
  {
    type: "decorator",
    // includeEditors, excludeEditors,
    decorator: {
      strategy: findInlineTeXEntities,
      component: InlineTeX,
      props: {
        getStore: () => store
      }
    }
  },
  {
    type: "block",
    name: "blockTex",
    rendererFn: block => {
      return {
        component: TeXBlock,
        editable: false,
        props: { getStore: () => store }
      };
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

const _insertTeX = (block = false) => {
  const originEditorState = store.getEditorState();
  const editorState = insertTeX(originEditorState, block);
  // editorState.convertOptions = originEditorState.convertOptions
  store.setEditorState(editorState);
};

const handleKeyCommand = (
  command /* ,{ getEditorState, setEditorState } */
) => {
  if (command === "insert-inlinetex") {
    _insertTeX();
    return "handled";
  }
  if (command === "insert-texblock") {
    _insertTeX(true);
    return "handled";
  }
  return "not-handled";
};

export {
  myKeyBindingFn,
  mathjaxExtension,
  handleKeyCommand,
}
