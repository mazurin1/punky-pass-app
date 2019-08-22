import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';

import SearchBar from '../../SearchBar'

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      author: '',
      editing: true
    }

    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.bookToEdit) {
      this.setState({
        title: nextProps.bookToEdit.title,
        body: nextProps.bookToEdit.body,
        author: nextProps.bookToEdit.author,
      });
    }
  }

  handleSave(title, body, author) {
    const { onSubmit, bookToEdit, onEdit } = this.props;
    return axios.post('http://localhost:8000/api/books', {
        title,
        body,
        author,
      })
        .then((res) => onSubmit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '' }));
  }

  handleSubmit(){
    const { onSubmit, bookToEdit, onEdit } = this.props;
    const { title, body, author } = this.state;

    if(!bookToEdit) {
      return axios.post('http://localhost:8000/api/books', {
        title,
        body,
        author,
      })
        .then((res) => onSubmit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '' }));
    } else {
      
      return axios.patch(`http://localhost:8000/api/books/${bookToEdit._id}`, {
        title,
        body,
        author,
      })
        .then((res) => onEdit(res.data))
        .then(() => this.setState({ title: '', body: '', author: ''}));
    }
  }

  handleChangeField(key, event) {
    this.setState({
      [key]: event.target.value,
    });
  }

  render() {
    const { bookToEdit, isEditing } = this.props;
    const { title, body, author } = this.state;

    return (
      <div>
        <SearchBar handleSave={this.handleSave.bind(this)} />
        {
         isEditing && title != '' && body != '' && author !='' ? 
         <div className="sticky col-12 col-lg-6 offset-lg-3">
        <div class="">Title</div>
        <input
          onChange={(ev) => this.handleChangeField('title', ev)}
          value={title}
          className="form-control my-3"
          placeholder="Book Title"
        />
        <div class="">Description</div>
        <textarea
          onChange={(ev) => this.handleChangeField('body', ev)}
          className="form-control my-3"
          placeholder="Book Body"
          value={body}>
        </textarea>
        <div class="">Author</div>
        <input
          onChange={(ev) => this.handleChangeField('author', ev)}
          value={author}
          className="form-control my-3"
          placeholder="Book Author"
        />
        <button onClick={this.handleSubmit} className="btn btn-primary float-right">{bookToEdit ? 'Update' : 'Submit'}</button>
      </div>
      : null
        }
      
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onSubmit: data => dispatch({ type: 'SUBMIT_BOOK', data }),
  onEdit: data => dispatch({ type: 'EDIT_BOOK', data }),
});

const mapStateToProps = state => ({
  bookToEdit: state.home.bookToEdit,
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);