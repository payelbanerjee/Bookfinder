import * as React from "react";

import logo from "../../assets/images/book-finder.png";
import styles from "./BookFinderHeader.module.scss";
import SearchBox from "../SearchBox/SearchBox";

class BookFinderHeader extends React.Component {
  render() {
    return (
      <div className={styles.header}>
        <img src={logo} className={styles.logo} alt="logo" />
        <div className={styles.headerTitle}>BookFinder APP</div>
        <div className={styles.searchBoxContainer}>
          <SearchBox />
        </div>
      </div>
    );
  }
}

export default BookFinderHeader;
