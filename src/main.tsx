import { toggleFadeInAnimation } from 'polotno/canvas/use-fadein';
import createStore from 'polotno/model/store';
import {
  setTextOverflow as unstable_setTextOverflow,
  setTextSplitAllowed as unstable_setTextSplitAllowed,
  setTextVerticalResizeEnabled as unstable_setTextVerticalResizeEnabled,
  useHtmlTextRender as unstable_useHtmlTextRender,
} from 'polotno/utils/flags';
import { addGlobalFont } from 'polotno/utils/fonts';
import {
  onLoadError,
  setAssetLoadTimeout,
  setFontLoadTimeout,
} from 'polotno/utils/loader';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);

const store = createStore({
  key: new URLSearchParams(location.search).get('key') ?? '',
  showCredit: false,
});

toggleFadeInAnimation(false);
unstable_setTextOverflow('resize');
unstable_useHtmlTextRender(true);
unstable_setTextVerticalResizeEnabled(true);

Object.assign(window, {
  store,
  config: {
    addGlobalFont,
    unstable_useHtmlTextRender,
    unstable_setTextVerticalResizeEnabled,
    unstable_setTextOverflow,
    onLoadError,
    setAssetLoadTimeout,
    setFontLoadTimeout,
    unstable_setTextSplitAllowed,
  },
});

root.render(createElement(App, { store }));
