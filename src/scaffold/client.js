import React, {
  Component,
} from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

const destinationEl = document.getElementById('app');

function render() {
  let App = require('./app/app').default;
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    destinationEl
  );
}

render();

if (module.hot) {
  module.hot.accept('./app/app', () => {
    setTimeout(render);
  });
}
