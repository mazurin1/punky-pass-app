const mongoose = require('mongoose');

const { Schema } = mongoose;

const BooksSchema = new Schema({
  title: String,
  body: String,
  author: String,
  thumbnail: String,
  notes: String,
}, { timestamps: true });

BooksSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    title: this.title,
    body: this.body,
    author: this.author,
    thumbnail: this.thumbnail,
    notes: this.notes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

mongoose.model('Books', BooksSchema);