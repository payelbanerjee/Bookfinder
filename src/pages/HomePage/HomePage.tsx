import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  TextField,
  Button,
  Container, CssBaseline, Typography, InputLabel
} from '@material-ui/core';
import { RouteComponentProps } from "react-router";

export interface BooksPropInterface extends RouteComponentProps {}

export interface BooksStateInterface {
  title: string,
  author: string,
  publishDate: Date
}

class HomePage extends React.Component<BooksPropInterface, BooksStateInterface> {

  constructor(props: BooksPropInterface) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.state = {
      title: '',
      author: '',
      publishDate: new Date(),
    }
  }

  handleChange = (e: any) => {
    if (e.target === undefined) {
      this.setState({
        publishDate: e
      });
    } else {
      // @ts-ignore
      this.setState({[e.target.name]: e.target.value});
    }

  };

// on form submit...
  handleFormSubmit(e: any) {
    e.preventDefault();

    if (this.state.title === '' || this.state.author === '') {
      alert(" Please enter title and author")
      return;
    }
    if (localStorage.getItem('books')) {
      let booksData = JSON.parse(localStorage.getItem("books") || '');
      booksData.push(this.state);
      localStorage.setItem('books', JSON.stringify(booksData));
    } else {
      const booksData = [];
      booksData.push(this.state);
      localStorage.setItem('books', JSON.stringify(booksData));
    }
    // reset state after insert
    this.setState({
      title: '',
      author: '',
      publishDate: new Date(),
    })
  }

// React Life Cycle
  componentDidMount() {
    this.setState({
      title: '',
      author: '',
      publishDate: new Date(),
    })
  }

  render() {
    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline/>
          <div className="MuiInputBase-input MuiOutlinedInput-input">

            <Typography component="h1" variant="h5">
              Add Books
            </Typography>
            <form>
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  name="title"
                  autoFocus
                  onInput={this.handleChange}
                  value={this.state.title}
              />
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="author"
                  label="Author"
                  name="author"
                  autoFocus
                  onInput={this.handleChange}
                  value={this.state.author}
              />
              <div className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth">
                <InputLabel color="secondary">Publish Date</InputLabel>
                <DatePicker dateFormat="dd.MMM.yyyy" selected={this.state.publishDate} onChange={this.handleChange}/>
              </div>
              <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="MuiButton-label"
                  onClick={this.handleFormSubmit}
              >
                Add
              </Button>
            </form>
          </div>
        </Container>
    )
  }
}

export default HomePage;