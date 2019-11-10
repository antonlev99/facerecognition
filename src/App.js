import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 80
      }
    },
    move: {
      enable:true,
      random: true,
      speed: 4    
    },
  }
}

const initialState = {
      input:'',
      imageUrl: '',
      box: {},
      route: 'SignIn',
      isSignedIn: false,  
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
}

  loaduser = (data) => {
    this.setState({user:{
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: (clarifaiFace.left_col * width) + 3,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width) + 3,
      bottomRow: height - (clarifaiFace.bottom_row * height) + 5
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

 onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('http://localhost:3100/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
          })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3100/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
              .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'SignOut'){
      this.setState(initialState);
    } else if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        <Particles className='particles'
          params={particlesOptions}
        />
          {route === 'home' 
          ? <div>
          <Logo/>
          <Rank name = {this.state.user.name} entries = {this.state.user.entries}/>
          <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
          <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
          :(
          route==='SignIn'
          ?<SignIn loaduser = {this.loaduser} onRouteChange={this.onRouteChange}/>
          :<Register loaduser = {this.loaduser} onRouteChange={this.onRouteChange}/>
          )
      }
      </div>
    );
  }
}

export default App;
