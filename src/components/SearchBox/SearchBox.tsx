import * as React from "react";
import { IconButton } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import SearchIcon from "@material-ui/icons/Search";
import { withRouter } from "react-router-dom";

import styles from "./SearchBox.module.scss";

export interface SearchBoxPropsInterface extends RouteComponentProps {}

export interface SearchBoxStateInterface {
  isSearchButtonDisabled: boolean;
  previousSearchText: string | null;
  searchText: string;
}

class SearchBox extends React.Component<
  SearchBoxPropsInterface,
  SearchBoxStateInterface
> {
  constructor(props: SearchBoxPropsInterface) {
    super(props);
    this.state = {
      isSearchButtonDisabled: true,
      previousSearchText: null,
      searchText: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    const searchText: string = event.target.value;
    // since setState is asynchronous, use callback for anything that depends on knowing state after setting state
    this.setState({ searchText: searchText }, () => {
      // it's ok to do setState in callback of setState
      // Best Practice: don't use this.state in setState, get state from the updater function
      this.setState(state => {
        return {
          isSearchButtonDisabled:
            state.searchText.length === 0 ||
            state.searchText === state.previousSearchText
        };
      });
    });
  }

  handleSubmit(event: any) {
    event.preventDefault();
    if (this.state.isSearchButtonDisabled) {
      return;
    }
    this.setState({
      isSearchButtonDisabled: true,
      previousSearchText: this.state.searchText
    });
    // set search text as parameter in url and navigate to the page that will do the search
    this.props.history.push({
      pathname: "/search",
      search: "?title=" + encodeURIComponent(this.state.searchText)
    });
  }

  render() {
    return (
      <div>
        <form className={styles.searchBox} onSubmit={this.handleSubmit}>
          <input
            autoFocus
            type="search"
            value={this.state.searchText}
            onChange={this.handleChange}
          />
          <IconButton
            aria-label="search"
            color="primary"
            disabled={this.state.isSearchButtonDisabled}
            href="#"
            onClick={this.handleSubmit}
          >
            <SearchIcon />
          </IconButton>
        </form>
      </div>
    );
  }
}

export default withRouter(SearchBox);
