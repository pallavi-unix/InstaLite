import React from 'react';
import {
  Button, TextField,
  ImageList, ImageListItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Link, Typography
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import axios from 'axios';
import './Photo.css'
import Message from '../Message';


class Photo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: undefined,
      photos: undefined,
      new_comment: undefined,
      add_comment: false,
      current_photo_id: undefined,
      likeState: props.liked,
      favouriteState: props.favouriteFlag,
      likesCount: props.likeCount,
      tagValue: "",
      users: [],
      taggedIds: [],
      
    };
    // this.tagOnChange = this.tagOnChange.bind(this);

  };
  handleNewCommentChange = (event) => {
    this.setState({
      new_comment: event.target.value
    });
  }

  componentDidMount() {
    axios.get("/user/list").then((response) => {
      this.setState({
        users: response.data.map((obj) => {
          return { id: obj._id, display: obj.first_name + " " + obj.last_name };
        }),
      });
    });
  }


  handleLike = (postId) => {
    const { _id } = this.props.activeUser;
    const { likesCount, likeState } = this.state;
    this.setState({ likesCount: !likeState ? likesCount + 1 : likesCount - 1})
    axios.post('/like', {
      post_id: postId,
      user_id: _id,
      like: !this.state.likeState,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((res) => {
      console.log(res);
    }).catch((er) => {
      console.log(er);
    });
    // this.setState({ likeState: !this.state.likeState });
  };

  handleFavourite = (item) => {
    const { file_name } = item
    const { activeUser } = this.props;
    console.log(activeUser);
    axios.post('/favourite', {
      fileName: file_name,
      favourite: !this.state.favouriteState,
      user_id: activeUser._id, 
    }).then((res) => {
      console.log(res);
    }).catch(er => {
      console.log(er);
    })
  }

  render() {
    const { item } = this.props;
    const {
      likesCount
    } = this.state;
    return (
      <div>
        <div key={item._id}>
          <TextField label="Photo Date" variant="outlined" disabled fullWidth margin="normal"
            value={item.date_time} />
          <ImageListItem key={item.file_name}>
            <img
              src={images/${item.file_name}?w=164&h=164&fit=crop&auto=format&dpr=2 2x}
              srcSet={images/${item.file_name}?w=164&h=164&fit=crop&auto=format}
              alt={item.file_name}
              loading="lazy"
            />
          </ImageListItem>
          <div className='controlIcons'>
            <div
            className='iconContainer' 
            onClick={() => {
              this.handleLike(item._id, item.user_id);
              this.setState({ likeState: !this.state.likeState })
            }}>
              <ThumbUpOffAltIcon style={{ fontSize: '20px',  color: this.state.likeState ? 'red' : 'black' }}  />
              <span style={{ margin: ' 0px 20px 0px 20px' }}>
                {likesCount}
              </span>
            </div>
            <div 
            className="iconContainer"
            onClick={() => {
              this.handleFavourite(item);
              this.setState({ favouriteState: !this.state.favouriteState })
            }}>
              <FavoriteIcon style={{ fontSize:'20px', color: this.state.favouriteState ? 'red' : 'black' }}  />
            </div>
          </div>
          <div>
            {item.comments ?
              item.comments.map((comment) => (
                <div key={comment._id}>
                  <TextField label="Comment Date" variant="outlined" disabled fullWidth
                    margin="normal" value={comment.date_time} />
                  <TextField label="User" variant="outlined" disabled fullWidth
                    margin="normal"
                    value={comment.user.first_name + " " + comment.user.last_name}
                    component="a" href={"#/users/" + comment.user._id}>
                  </TextField>
                  <Message
                    msg={comment.comment}
                    users={this.state.users}
                  />
                </div>
              ))
              : (
                <div>
                  <Typography>No Comments</Typography>
                </div>
              )}
            <Button photo_id={item._id} variant="contained" onClick={(e) => this.props.handleShowAddComment(e)}>
              Add Comment
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default Photo;
