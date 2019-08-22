import React from 'react'
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'


const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '100%'
    },
    dense: {
      marginTop: theme.spacing(2),
    },
    menu: {
      width: 200,
    },
  }));
    


export default function SearchBar() {
    const classes = useStyles();   
   function handleSearch(event) {
        if (event.key === "Enter") {
            console.log(event.target.value);

        var search=event.target.value;

            return axios.post(`http://localhost:8000/api/books/search`,{
                search,
            
              })
            .then();
            }
      } 
    return (
    <TextField
        id="outlined-search"
        label="Search books"
        type="search"
        className={classes.textField}
        margin="normal"
        variant="outlined"
        onKeyPress={(event) => handleSearch(event)}
        
      />
    );
}


