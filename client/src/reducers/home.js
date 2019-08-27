export default (state={books: []}, action) => {
  switch(action.type) {
    case 'HOME_PAGE_LOADED':
      return {
        ...state,
        books: action.data.books,
      };
    case 'SUBMIT_BOOK':
      return {
        ...state,
        books: ([action.data.book]).concat(state.books),
      };
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter((book) => book._id !== action.id),
      };
    case 'SET_EDIT':
      return {
        ...state,
        bookToEdit: action.book,
      };
    case 'EDIT_BOOK':
      return {
        ...state,
        books: state.books.map((book) => {
          if(book._id === action.data.book._id) {
            return {
              ...action.data.book,
            }
          }
          return book;
        }),
        bookToEdit: undefined,
      }
    default:
      return state;
  }
};