import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import NavBar from '../NavBar'
import SearchBar from '../SearchBar'


import { Form } from '../../components/Book';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);

  }

  componentDidMount() {
    const { onLoad } = this.props;

    axios('http://localhost:8000/api/books')
      .then((res) => onLoad(res.data));
  }

  handleDelete(id) {
    const { onDelete } = this.props;

    return axios.delete(`http://localhost:8000/api/books/${id}`)
      .then(() => onDelete(id));
  }

  handleEdit(book) {
    const { setEdit } = this.props;

    setEdit(book);
  }

  render() {
    const { books } = this.props;

    return (
      <div>
        <div>
          <NavBar />
        </div>
        <div className="container">
          <div className="row pt-5">
            <div className="col-12 col-lg-6 offset-lg-3">
              <h1 className="text-center">PunkyPass, an app for avid book readers</h1>
            </div>
            <SearchBar/>
            <Form />
          </div>
          <div className="row pt-5">
            <div className="col-12 col-lg-6 offset-lg-3">
              {books.map((book) => {
                return (
                  <div className="card my-3">
                    <div className="card-header">
                      {book.title}
                    </div>
                    <div className="card-body">
                      {book.body}
                      <p className="mt-5 text-muted"><b>{book.author}</b> {moment(new Date(book.createdAt)).fromNow()}</p>
                    </div>
                    <div className="card-footer">
                      <div className="row">
                        <button onClick={() => this.handleEdit(book)} className="btn btn-primary mx-3">
                          Edit
                      </button>
                        <button onClick={() => this.handleDelete(book._id)} className="btn btn-danger">
                          Delete
                      </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  books: state.home.books,
});

const mapDispatchToProps = dispatch => ({
  onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
  onDelete: id => dispatch({ type: 'DELETE_BOOK', id }),
  setEdit: book => dispatch({ type: 'SET_EDIT', book }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);