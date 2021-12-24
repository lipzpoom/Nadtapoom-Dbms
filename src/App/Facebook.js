import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
import ButtonShowdata from "../showdata/ButtonShowdata";
import ButtonRegister from "../register/ButtonRegister";
import './style.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Register from "../register/Register";
import Showdata from "../showdata/Showdata";

export default class Facebook extends Component {
  state = {
    isLoggedIn: false,
    userID: "",
    name: "",
    email: "",
    picture: ""
  };
  responseFacebook = response => {
    // console.log(response);

    this.setState({
      isLoggedIn: true,
      userID: response.userID,
      name: response.name,
      email: response.email,
      picture: response.picture.data.url
    });
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('userID', response.userID);
    localStorage.setItem('name', response.name);
    localStorage.setItem('email', response.email);
    localStorage.setItem('picture', response.picture.data.url);
  };

  getLocalStorageLogin = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.setState({
        isLoggedIn: true,
        userID: localStorage.getItem('userID'),
        name: localStorage.getItem('name'),
        email: localStorage.getItem('email'),
        picture: localStorage.getItem('picture')
      });
    }
  }
  componentClicked = () => console.log("clicked");

  logoutFacebook = () => {
    this.setState({
      isLoggedIn: false,
      userID: '',
      name: '',
      email: '',
      picture: ''
    });
    localStorage.setItem('isLoggedIn', false);
    localStorage.setItem('userID', '');
    localStorage.setItem('name', '');
    localStorage.setItem('email', '');
    localStorage.setItem('picture', '');
  }

  render() {
    let fbContent;
    if (this.state.isLoggedIn === false) {
      this.getLocalStorageLogin();
    }
    if (this.state.isLoggedIn) {
      fbContent = (
        <div
          style={{
            width: "95%",
            margin: "auto",
            background: "black",
            color: 'white',
            padding: "25px",
            position: 'absolute',
            zIndex: 99,
            backgroundImage: 'linear-gradient(45deg, rgba(218, 132, 230, 0.84) 0%, rgba(179, 0, 89, 1) 83%)'
          }}
        >
          <img src={this.state.picture} alt={this.state.name} />
          <h2>Welcome {this.state.name}</h2>
 	  email: {this.state.email}
          <div className="my-3"><a className="btn btn-danger" href="/" onClick={this.logoutFacebook}>Logout</a></div>
          <BrowserRouter>
            <br /><br /><div className="btn-group btn-group-lg"><ButtonRegister /><ButtonShowdata /></div>
            <Switch>
              <Route path='/register' component={Register} />
              <Route path='/showdata' component={Showdata} />
            </Switch>
          </BrowserRouter>
        </div>
      );
    } else {
      fbContent = (
        <div
          style={{
            width: "400px",
            margin: "auto",
            padding: "25px"
          }}
        >
          <FacebookLogin
            appId="445548386970103"
            autoLoad={false}
            fields="name,email,picture"
            onClick={this.componentClicked}
            callback={this.responseFacebook}
          />
        </div>
      );
    }

    return <div>{fbContent}</div>;
  }
}
