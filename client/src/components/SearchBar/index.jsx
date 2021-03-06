import React from 'react'
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
    icon: {
        color: '#E6E200',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: "100%"
    },
    dense: {
        marginTop: theme.spacing(2),
    },
    menu: {
        width: 200,
    }
})
);

class SearchBar extends React.Component {

    
    constructor(props) {
        super(props);

        this.state = {
            tileData: [],
            search: ''
        }

        this.props = props;

        this.handleSearch = this.handleSearch.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(title, description, authors, thumbnail){

        this.props.handleSave(title, description, authors.join(','), thumbnail)
    }


    handleSearch(event) {
        if (event.key === "Enter") {
            console.log(event.target.value);

            this.state.search = event.target.value;
            const search = this.state.search;
            return axios.post(`/api/books/search`, {
                search,

            })
                .then((res) => {
                    console.log(res);
                    this.setState({
                        tileData: res.data.results
                      })
                });
        }
    }

    render() {

        const classes = useStyles;
        const { handleSave } = this.props


        console.log(classes);

        return (
            <div>
                <div className={classes.root}>
                <TextField
                    id="standard-helperText"
                    label="Search Books"
                    placeholder="Find title, author, isbn"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                    onKeyPress={(event) => this.handleSearch(event)}

                />
                </div>
                <div className={classes.root}>
                    <GridList cellHeight={200} className={classes.gridList}>
                        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                            <ListSubheader component="div"></ListSubheader>
                        </GridListTile>
                        {this.state.tileData.map(tile => (
                            <GridListTile key={tile.identifier}>
                                <img src={tile.thumbnail} alt={tile.title} />
                                <GridListTileBar
                                    title={tile.title}
                                    subtitle={<span>by: {tile.authors.join(',')}</span>}
                                    actionIcon={
                                        <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                                            <AddCircleIcon className="icon-color" onClick={(event) => this.handleClick(tile.title, tile.description, tile.authors, tile.thumbnail) } />
                                        </IconButton>
                                    }
                                />
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
            </div>
        );
    }
}

export default SearchBar;
