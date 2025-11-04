import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Divider,
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import './TopBar.css';
import axios from 'axios';


class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      app_info: undefined,
      photo_upload_show: false,
      photo_upload_error: false,
      photo_upload_success: false,
      openVisibilityDialog: false,
      checked: [],
      checkStatus: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleNewPhoto = this.handleNewPhoto.bind(this);
  }
  componentDidMount() {
    this.handleAppInfoChange();
  }
  handleLogout = (user) => {
    axios.post("/admin/logout")
      .then((response) => {
        this.props.changeUser(undefined);
      })
      .catch(error => {
        this.props.changeUser(undefined);
        console.log(error);
      });
  }

  handleNewPhoto = (e) => {
    e.preventDefault();
    // this.setState({ openVisibilityDialog: false });
    console.log(this.state.checked)
    console.log(this.props.userList)
    if (this.uploadInput.files.length > 0 && this.state.checked.length >= 0) {
      const visibilityArray = this.state.checkStatus ? this.state.checked.map(check => check._id) : this.props.userList;
      console.log(visibilityArray);
      const domForm = new FormData();
      domForm.append('uploadedphoto', this.uploadInput.files[0]);
      domForm.append('visibilityArray', visibilityArray);
      axios.post("/photos/new", domForm)
        .then((response) => {
          this.setState({
            photo_upload_show: true,
            photo_upload_error: false,
            photo_upload_success: true
          });
        })
        .catch(error => {
          this.setState({
            photo_upload_show: true,
            photo_upload_error: true,
            photo_upload_success: false,
          });
          console.log(error);
        });
    }
  }


  handleClose = () => {
    this.setState({
      photo_upload_show: false,
      photo_upload_error: false,
      photo_upload_success: false
    });
  }

  handleAppInfoChange() {
    const app_info = this.state.app_info;
    if (app_info === undefined) {
      axios.get("/test/info")
        .then((response) => {
          this.setState({
            app_info: response.data
          });
        });
    }
  }

  handleClose = () => {
    this.setState({
      openVisibilityDialog: false,
    })
  }
  handleToggle = (user) => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(user);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(user);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({ checked: newChecked })

    console.log(this.state.checked)
  }
  handleAgree = () => {
    console.log(this.state.checked)
  }
  render() {
    const { checked } = this.state;

    return this.state.app_info ? (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 0 }} color="inherit">
            {
              this.props.user ?
                (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: 'fit-content',
                      '& svg': {
                        m: 1.5,
                      },
                      '& hr': {
                        mx: 0.5,
                      },
                    }}
                  >
                    <span>{"Hi " + this.props.user.first_name}</span>
                    <Divider orientation="vertical" flexItem />
                    <Button variant="contained" onClick={this.handleLogout}>Logout</Button>
                    <Divider orientation="vertical" flexItem />
                    <Button
                      component="label"
                      variant="contained"
                      onClick={() => this.setState({ openVisibilityDialog: true })}
                    >
                      Add Photo

                    </Button>
                  </Box>
                )
                :
                ("Please Login")
            }
          </Typography>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} color="inherit" align="center">{this.props.main_content}</Typography>
          <Typography variant="h5" component="div" sx={{ flexGrow: 0 }} color="inherit">Team: StackMinds, Version: {this.state.app_info.version}</Typography>
        </Toolbar>
        <Dialog onClose={() => this.setState({ openVisibilityDialog: false })} open={this.state.openVisibilityDialog} >
          <label class="label" style={{width: '40%'}}>
            <input type="file"
              accept='image/*'
              ref={(domFileRef) => { this.uploadInput = domFileRef }}
              onChange={(e) => this.handleNewPhoto(e)}
            />
            <span>Select a file</span>
          </label>
          <List>
            <ListItem>
              <ListItemButton role={undefined} onClick={() => this.setState({ checkStatus: !this.state.checkStatus })} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={this.state.checkStatus}
                    onChange={() => this.setState({ checkStatus: !this.state.checkStatus })}
                  />
                </ListItemIcon>
                <ListItemText primary={`Specify permissions?`} />
              </ListItemButton>
            </ListItem>
          </List>

          <DialogTitle>
            Choose the friends who get viewing permissions:
          </DialogTitle>
          <DialogContent>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {this.props.userList.map((user) => {
                const labelId = `checkbox-list-label-${user}`;
                const { first_name, last_name } = user;
                return (
                  <ListItem
                    key={user._id}
                    disablePadding
                  >
                    <ListItemButton role={undefined} onClick={() => {
                      if(this.state.checkStatus)
                      {
                        this.handleToggle(user)
                      }}} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={this.state.checkStatus ? checked.indexOf(user) !== -1 : false}
                          tabIndex={-1}
                          disableRipple
                          disabled={!this.state.checkStatus}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={`${first_name} ${last_name}`} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>


          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose()}>Close</Button>
          </DialogActions>
        </Dialog>
      </AppBar>
    ) : (
      <div />
    );
  }
}

export default TopBar;
