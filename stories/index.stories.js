import React from 'react';
import Editor from './editor';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';


storiesOf('Editor', module)
  .add('mathjax', () => <Editor />)
