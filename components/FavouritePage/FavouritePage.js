import React,{Component} from 'react';
import {
  Paper,
} from '@mui/material'
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import './FavouritePage.css';
class FavouritePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoArray: [],
    };
  };

  componentDidMount () {
    this.handleFavouriteImages();
  }

  handleFavouriteImages = () => {
    const { activeUser } = this.props;
    axios.post('/favourite', {
      favourite: 'ALL',
      user_id: activeUser._id, 
    }).then((res) => {
      this.setState({
        photoArray: res.data,
      })
    }).catch(er => {
      console.log(er);
    })
  }

  handleDeleteFavourite = (fileName, index) => {
    document.getElementById(`pic${index}`).style.display = 'none';
    const { activeUser } = this.props;
    axios.post('/favourite', {
      favourite: false,
      fileName,
      user_id: activeUser._id, 
    }).then((res) => {
      this.setState({
        photoArray: res.data,
      })
    }).catch(er => {
      console.log(er);
    });

  }

  render () {
    return (<div>
      <div className='parentFavouritePage' elevation={3}>
        {
          this.state.photoArray.length > 0 && this.state.photoArray.map((photo, index) => {
            return (<div className='favPicContainer' id={`pic${index}`}>
              <CloseIcon style={{ cursor: 'pointer' }} className='crossIcon' onClick={() => this.handleDeleteFavourite(photo.file_name, index)} />
              <img
              
              className='favPicTag'
              src={`images/${photo.file_name}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              srcSet={`images/${photo.file_name}?w=164&h=164&fit=crop&auto=format`}
              alt={photo.file_name}
              loading="lazy"
            /></div>)
          })
        }
      </div>
      </div>)
  }
}

export default FavouritePage;
