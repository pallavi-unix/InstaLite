import React from 'react';
import {
  Button, TextField,
  ImageList, ImageListItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Link, Typography
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Mention, MentionsInput } from "react-mentions";
import mentionsInputStyle from "./mentionsInputStyle";
import mentionStyle from "./mentionStyle";
import './userPhotos.css';
import Photo from './Photo'
import axios from 'axios';

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: undefined,
      photos: undefined,
      new_comment: undefined,
      add_comment: false,
      current_photo_id: undefined,
      likeState: false,
      tagValue: "",
      users: [],
      taggedIds: [],
    };
    this.tagOnChange = this.tagOnChange.bind(this);
    this.handleCancelAddComment = this.handleCancelAddComment.bind(this);
    this.handleSubmitAddComment = this.handleSubmitAddComment.bind(this);
  }

  componentDidMount() {
    const new_user_id = this.props.match.params.userId;
    this.handleUserChange(new_user_id);
    axios.get("/user/list").then((response) => {
      this.setState({
        users: response.data.map((obj) => {
          return { id: obj._id, display: obj.first_name + " " + obj.last_name };
        }),
      });
    });
  }

  componentDidUpdate() {
    const new_user_id = this.props.match.params.userId;
    const current_user_id = this.state.user_id;
    if (current_user_id !== new_user_id) {
      this.handleUserChange(new_user_id);
    }
  }

  handleUserChange(user_id) {
    const { _id } = this.props.activeUser;
    axios.get(`/photosOfUser/${user_id}/${_id}`)
      .then((response) => {
        console.log('then');
        this.setState({
          user_id: user_id,
          photos: response.data
        });
      })
      .catch((err) => {
        console.log('catch');
      });
    axios.get("/user/" + user_id)
      .then((response) => {
        const new_user = response.data;
        const main_content = "User Photos for " + new_user.first_name + " " + new_user.last_name;
        this.props.changeMainContent(main_content);
      })
      .catch((err) => {
        console.log('catch2');
      });
  }

  handleNewCommentChange = (event) => {
    this.setState({
      new_comment: event.target.value
    });
  }

  handleShowAddComment = (event) => {
    const photo_id = event.target.attributes.photo_id.value;
    this.setState({
      add_comment: true,
      current_photo_id: photo_id
    });
  }

  handleCancelAddComment = () => {
    this.setState({
      add_comment: false,
      new_comment: undefined,
      current_photo_id: undefined
    });
  }

  handleSubmitAddComment = () => {
    const currentState = JSON.stringify({
      comment: this.state.tagValue,
      taggedIds: this.state.taggedIds,
    });
    const photo_id = this.state.current_photo_id;
    const user_id = this.state.user_id;
    axios
      .post("/commentsOfPhoto/" + photo_id, currentState, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.setState({
          add_comment: false,
          new_comment: undefined,
          current_photo_id: undefined,
          tagValue: undefined,
        });
    const { _id } = this.props.activeUser;

        axios.get(`/photosOfUser/${user_id}/${_id}`).then((response) => {
          this.setState({
            photos: response.data,
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  tagOnChange(event, newValue, newPlainTextValue, mentions) {

    const mentionIds = mentions.map((mention) => mention.id);
    this.setState({
      tagValue: event.target.value,
      taggedIds: mentionIds,
    });
  }

  handleLike = (postId) => {
    const { _id } = this.props.activeUser;
    // console.log(postId,"=", _id,this.props.activeUser);
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
    this.setState({ likeState: !this.state.likeState });
  };

  render() {
    return this.state.user_id ? (
      <div>
        <div>
          <Button variant="contained" component="a" href={"#/users/" + this.state.user_id}>
            User Detail
          </Button>
        </div>
        <ImageList variant="masonry" cols={1} gap={8}>
          {this.state.photos ? this.state.photos.map((item) => {
            const visibility = item.visibility;
            const { _id } = this.props.activeUser;
            let visibilityFlag = false;
            let liked = false;
            item.likes.forEach((like) => {
              if (like.user_id === _id)
                liked = true;
            });
            let likeCount = item.likes.length;
            console.log(likeCount)
            let favouriteFlag = false;
            this.props.activeUser.favourites.forEach((fav) => {
              console.log(fav.file_name)
              if (fav.file_name === item.file_name)
                favouriteFlag = true;
            })
            console.log(this.props.activeUser.favourites)
            visibility.map(vis => {
              if (vis.user_id === this.props.activeUser._id) {
                visibilityFlag = true;
              }
            });
            if (visibilityFlag || item.user_id === this.props.activeUser._id)
              return <Photo
                liked={liked}
                likeCount={likeCount}
                favouriteFlag={favouriteFlag}
                activeUser={this.props.activeUser}
                item={item}
                handleShowAddComment={this.handleShowAddComment} />
          }) : (
            <div>
              <Typography>No Photos</Typography>
            </div>
          )}
        </ImageList>
        <Dialog open={this.state.add_comment}>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter New Comment for Photo
            </DialogContentText>
            <MentionsInput
              placeholder="Add Comment. Use '@' for mention and '&' for emojis"
              value={this.state.tagValue}
              onChange={this.tagOnChange}
              style={mentionsInputStyle}
              a11ySuggestionsListLabel={"Suggested mentions"}
            >
              <Mention style={mentionStyle} data={this.state.users} />
            </MentionsInput>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { this.handleCancelAddComment() }}>Cancel</Button>
            <Button onClick={() => { this.handleSubmitAddComment() }}>Add</Button>
          </DialogActions>
        </Dialog>
      </div>
    ) : (
      <div />
    );
  }
}
export default UserPhotos;
