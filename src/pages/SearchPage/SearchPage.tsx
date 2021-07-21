import * as React from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import {CircularProgress, IconButton} from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import queryString from "query-string";
import {RouteComponentProps} from "react-router";
import {withRouter} from "react-router-dom";

import sharedStyles from "../../assets/styles/SharedStyles.module.scss";
import styles from "./SearchPage.module.scss";

export interface SearchPagePropsInterface extends RouteComponentProps {
}

export interface SearchPageStateInterface {
  currentPage: string;
  isEmpty: boolean;
  isError: boolean;
  isLoading: boolean;
  isMorePages: boolean;
  books: any[];
}

class SearchPage extends React.Component<SearchPagePropsInterface,
    SearchPageStateInterface> {
  // BEST PRACTICE: declare all private properties at the top
  pageBaseUrl = "/search";
  requestedPage = "";
  title = "";
  unlisten: any;

  constructor(props: SearchPagePropsInterface) {
    super(props);
    this.state = {
      currentPage: "",
      isEmpty: false,
      isError: false,
      isLoading: true,
      isMorePages: false,
      books: []
    };
    // bind event handlers so we can refer to the this object
    this.handleFirstPage = this.handleFirstPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePreviousPage = this.handlePreviousPage.bind(this);
  }

  componentDidMount() {
    this.readUrlQueryString(this.props.location.search);
    this.getBooks();
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen(location => {
      this.readUrlQueryString(location.search);
      this.getBooks();
    });
  }

  readUrlQueryString(search: string) {
    const values = queryString.parse(search);
    if (typeof values.title === "string") {
      this.title = values.title;
    }
    if (typeof values.page === "string") {
      this.requestedPage = values.page;
    }
  }

  componentWillUnmount() {
    this.unlisten();
  }

  getBooks() {
    this.setState({
      isEmpty: false,
      isError: false,
      isLoading: true
    });
    const thisRef = this;

    /*const baseUrl = "http://localhost:3001/"; // TODO: replace with the API URL
    const requestParams = {
      title: this.title || "",
      page: this.requestedPage || "1"
    };
    const url = baseUrl + "?" + this.getQueryString(requestParams);
    fetch(url)
      .then(function(response) {
        if (response.status !== 200) {
          thisRef.setState({
            isError: true,
            isLoading: false
          });
          return;
        }
        response.json().then(data => {
          if (
            typeof data === "object" &&
            data.hasOwnProperty("items") &&
            Array.isArray(data.items) &&
            data.items.length > 0
          ) {
            thisRef.setState({
              currentPage: requestParams.page,
              isLoading: false,
              isMorePages: data.has_more,
              books: data.items
            });
          } else {
            thisRef.setState({
              isEmpty: true,
              isLoading: false
            });
          }
        });
      })
      .catch(function() {
        thisRef.setState({
          isError: true,
          isLoading: false
        });
      });*/
    if (localStorage.getItem('books')) {
      let booksData = JSON.parse(localStorage.getItem("books") || '');
      if (typeof booksData === "object" &&
          Array.isArray(booksData) &&
          booksData.length > 0
      ) {
        if (this.title !== "*") {
          booksData = booksData.reduce((r, o: string) => {
            if (Object.values(o).some(v => v.toUpperCase() === this.title.toUpperCase())) {
              r.push(o);
              return r;
            }
            return r;
          }, []);
        }
        if (booksData.length > 0) {
          thisRef.setState({
            currentPage: "1",
            isLoading: false,
            isMorePages: false,
            books: booksData
          });
        } else {
          this.setEmptyState(thisRef);
        }
      } else {
        this.setEmptyState(thisRef);
      }
    } else {
      this.setEmptyState(thisRef);
    }
  }

  private setEmptyState(thisRef: any) {
    thisRef.setState({
      isEmpty: true,
      isLoading: false
    });
  }

  getQueryString(params: any) {
    return Object.keys(params)
    .map(
        key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
    )
    .join("&");
  }

  decodeHtmlEntities(text: string) {
    if (text === undefined || text === "") {
      return "";
    }
    const doc = new DOMParser().parseFromString(text, "text/html");
    let newText: string = "";
    if (typeof doc.documentElement.textContent === "string") {
      newText = doc.documentElement.textContent;
    }
    newText = newText.replace("&quot;", '"');
    return newText;
  }

  handleFirstPage() {
    this.requestedPage = "1";
    this.navigateToPage();
  }

  handleNextPage() {
    this.requestedPage = (parseInt(this.state.currentPage, 10) + 1).toString();
    this.navigateToPage();
  }

  handlePreviousPage() {
    this.requestedPage = (parseInt(this.state.currentPage, 10) - 1).toString();
    this.navigateToPage();
  }

  navigateToPage() {
    const queryParams = {
      title: this.title,
      page: this.requestedPage
    };
    this.props.history.push(
        this.pageBaseUrl + "?" + this.getQueryString(queryParams)
    );
  }

  render() {
    let pageView = null;
    if (this.state.isLoading) {
      pageView = (
          <div className={sharedStyles.pageMessageContainer}>
            <CircularProgress/>
          </div>
      );
    }
    if (this.state.isError) {
      pageView = (
          <div className={sharedStyles.pageMessageContainer}>
            <div className={sharedStyles.pageMessageError}>
              Error Occurred Getting Books
            </div>
          </div>
      );
    }
    if (this.state.isEmpty) {
      pageView = (
          <div className={sharedStyles.pageMessageContainer}>
            <div className={sharedStyles.pageMessageWarning}>
              No Books Found
            </div>
          </div>
      );
    }
    if (!(this.state.isEmpty || this.state.isError || this.state.isLoading)) {
      pageView = (
          <div>
            <ul>
              {this.state.books.map(item => (
                  <li key={item.books_id}>
                    Title: {this.decodeHtmlEntities(item.title)} <br/>
                    Author: {this.decodeHtmlEntities(item.author)} <br/>
                    Publish Date: {new Date(item.publishDate).toLocaleDateString('de-DE')} <br/>
                  </li>
              ))}
            </ul>
            <div className={styles.pageFooter}>
              <div className={styles.pageNavigationPanel}>
                <span>Page {this.state.currentPage}</span>
                <IconButton
                    disabled={this.state.currentPage === "1"}
                    onClick={this.handleFirstPage}
                    href="#"
                    title="Go to First Page"
                >
                  <FirstPageIcon/>
                </IconButton>
                <IconButton
                    disabled={this.state.currentPage === "1"}
                    onClick={this.handlePreviousPage}
                    href="#"
                    title="Go to Previous Page"
                >
                  <ChevronLeftIcon/>
                </IconButton>
                <IconButton
                    disabled={!this.state.isMorePages}
                    onClick={this.handleNextPage}
                    href="#"
                    title="Go to Next Page"
                >
                  <ChevronRightIcon/>
                </IconButton>
              </div>
            </div>
          </div>
      );
    }

    return (
        <div className={sharedStyles.page}>
          <div className={sharedStyles.pageTitle}>List of Books for Search value : "{this.title}". <br/> Use * to show all books.
          </div>
          
          <div className={sharedStyles.mainCard}>
            <p>
              <a href="/">Home Page</a>
            </p>
            {pageView}
          </div>
        </div>
    );
  }
}

export default withRouter(SearchPage);
