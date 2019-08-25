import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import NavBar from '../NavBar'


import { Form } from '../../components/Book';
import { set } from 'mongoose';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.state = {
      editing: false
    }
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
    this.setState({
      editing: true
    })
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
            <div className="col-12 col-lg-12">
            <h1 className="text-center ungrid">This is your digital library. What books have you read?</h1>

            </div>
          </div>
          <div className="row pt-5">
            <div className="col-6 col-lg-6 ">
              {books.map((book) => {
                return (
                  <div className="card my-3">
                    <div className="card-header">
                      Title: {book.title}
                      <div className="text-muted"><b>Author: {book.author}</b></div>
      
                    </div>
                    <div className="card-body">
                      <p className="font-color">Description:</p> <p className="font-style">{book.body}</p>
                      
                      <p className="mt-3 font-color"><b>Notes: {book.notes}</b>
                      </p>
                      <p className="mt-5"> Added: {moment(new Date(book.createdAt)).fromNow()}
                
                      </p>
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
            <div class="col-6 col-lg-6 ">
             <Form isEditing={this.state.editing} />
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