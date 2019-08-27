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
      thumbnail: '',
      notes: '',
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
        notes: nextProps.bookToEdit.notes,

      });
    }
  }

  handleSave(title, body, author,thumbnail) {
    const { onSubmit, bookToEdit, onEdit } = this.props;
    return axios.post('http://localhost:8000/api/books', {
        title,
        body,
        author,
        thumbnail,
      })
        .then((res) => onSubmit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '', thumbnail:'' }));
  }

  handleSubmit(){
    const { onSubmit, bookToEdit, onEdit } = this.props;
    const { title, body, author, notes } = this.state;

    if(!bookToEdit) {
      return axios.post('http://localhost:8000/api/books', {
        title,
        body,
        author,
        notes,
      })
        .then((res) => onSubmit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '', notes: '' }));
    } else {
      
      return axios.patch(`http://localhost:8000/api/books/${bookToEdit._id}`, {
        title,
        body,
        author,
        notes,
      })
        .then((res) => onEdit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '', notes: ''}));
    }
  }

  handleChangeField(key, event) {
    this.setState({
      [key]: event.target.value,
    });
  }

  render() {
    const { bookToEdit, isEditing } = this.props;
    const { title, body, author, thumbnail, notes } = this.state;

    return (
      <div>
        <SearchBar handleSave={this.handleSave.bind(this)} />
        {
         isEditing && title != '' && body != '' && author !='' ? 
         <div className="sticky col-12 col-lg-6 offset-lg-3">
           <img src={thumbnail}></img>
        <div class="">Title</div>
        <input
          fieldset disabled={true}
          onChange={(ev) => this.handleChangeField('title', ev)}
          value={title}
          className="form-control my-3"
          placeholder="Book Title"
        />
        <div class="">Description</div>
        <textarea
          fieldset disabled={true}
          onChange={(ev) => this.handleChangeField('body', ev)}
          className="form-control my-3"
          placeholder="Book Body"
          value={body}>
        </textarea>
        <div class="">Author</div>
        <input
          fieldset disabled={true}
          onChange={(ev) => this.handleChangeField('author', ev)}
          value={author}
          className="form-control my-3"
          placeholder="Book Author"
        />
        <div class="">Notes</div>
        <input
          onChange={(ev) => this.handleChangeField('notes', ev)}
          value={notes}
          className="form-control my-3"
          placeholder="Book Notes"
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