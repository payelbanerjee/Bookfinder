import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import styles from "./App.module.scss";

class App extends React.Component {
  render() {
    return (
      <div className={styles.App}>
        <Router basename={process.env.PUBLIC_URL}>
        </Router>
      </div>
    );
  }
}

export default App;
