import React from 'react';
import {
  Typography, Grid, Card, CardContent, Link, Button
} from '@mui/material';
import './userDetail.css';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        user: undefined
    };
  }
  componentDidMount() {
      const new_user_id = this.props.match.params.userId;
      this.handleUserChange(new_user_id);
  }

  componentDidUpdate() {
      const new_user_id = this.props.match.params.userId;
      const current_user_id = this.state.user?._id;
      if (current_user_id  !== new_user_id){
          this.handleUserChange(new_user_id);
      }
  }

  handleUserChange(user_id){
      axios.get("/user/" + user_id)
          .then((response) =>
          {
              const new_user = response.data;
              this.setState({
                  user: new_user
              });
              const main_content = "User Details for " + new_user.first_name + " " + new_user.last_name;
              this.props.changeMainContent(main_content);
          });
  }

  render() {
    const {
      activeUser,
    } = this.props;
    const {
      first_name,
      last_name,
    } = activeUser;
    return this.state.user ? (
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">{`${this.state.user.first_name} ${this.state.user.last_name}`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Location: {this.state.user.location}</Typography>
              <Typography variant="body1">Description: {this.state.user.description}</Typography>
              <Typography variant="body1">Occupation: {this.state.user.occupation}</Typography>
              {`${this.state.user.first_name} ${this.state.user.last_name}` === `${first_name} ${last_name}` && <RouterLink to='/favourite'>
              <Typography variant="body1">Favourites</Typography>
              </RouterLink>}
            </Grid>
            <Grid item xs={12}>
              <Button component={RouterLink} to={`/photos/${this.state.user._id}`}>
                View Photos
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    ) : (
        <div/>
    );
  }
}

export default UserDetail;
