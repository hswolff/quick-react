import React, {
  Component,
} from 'react';

import styles from './app.css';

export default class App extends Component {
  render() {
    return (
      <div>
        <h1 className={styles.text}>Hello World</h1>
      </div>
    );
  }
}
