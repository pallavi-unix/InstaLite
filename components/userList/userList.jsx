import React from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
}
from '@mui/material';
import './userList.css';
import axios from 'axios';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                user_id: undefined
            };
    }

    componentDidMount() {
        // this.handleUserListChange();
    }

    componentDidUpdate() {
        const new_user_id = this.props.match?.params.userId;
        const current_user_id = this.state.user_id;
        if (current_user_id  !== new_user_id){
            this.handleUserChange(new_user_id);
        }
    }

    handleUserChange(user_id){
        this.setState({
            user_id: user_id
        });
    }

    render() {
      return this.props.userList ?(
          <div>
          <List component="nav">
              {
                  this.props.userList.map(user => (
                  <ListItemButton selected={this.state.user_id === user._id}
                                  key={user._id}
                                  divider={true}
                                  component="a" href={"#/users/" + user._id}>
                      <ListItemText primary={user.first_name + " " + user.last_name} />
                  </ListItemButton>
              ))
              }
          </List>
          </div>
      ) : (
          <div/>
      );
    }
  }

export default UserList;
