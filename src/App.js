import React from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Rank from "./components/Rank/Rank";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import Particles from "react-particles-js";
import Clarifai from "clarifai";

const particlesOptions = {
  particles: {
    number: {
      value: 120,
      density: {
        enable: true,
        value_area: 700,
      },
    },
  },
};

const app = new Clarifai.App({
  apiKey: "9746f7bfb7ee4c26b89559ced8f7e9c8",
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };
  }

  // loads user profile on site
  loadUser = (data) => {
    this.setState({
      user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
      }
    })
  }

  // Handle Text change in form
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
    event.preventDefault();
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width, // Multiply total width by the left col percentage
      topRow: clarifaiFace.top_row * height, // Multiply height by top row percentage
      rightCol: width - clarifaiFace.right_col * width, // Subtract total width of picture from the multiplication of total width and right col percentage
      bottomRow: height - clarifaiFace.bottom_row * height, // Substract total height of picture from the multiplication of total height and bottom row percentage
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  // Handle Submit button
  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        // URL
        this.state.input,
      )
      .then((response) => {
        if(response){
          fetch('http://localhost:3000/image',  
          {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
        })
        .then(response => response.json())
        .then(user => {
          console.log(user);
          // console.log(count);
          this.setState(prevstate => ({
            user: {
              ...prevstate.user,
              entries: user.entries
            }
          }))
        })
        this.displayFaceBox(this.calculateFaceLocation(response));
      }
    })
      .catch((err) => console.log(err));
    // there was an error
  };

  onRouteChange = (route) => {
    if(route === "signout"){
      this.setState({isSignedIn: false})
    } else if (route === "home"){
      this.setState({isSignedIn: true})
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        {route === "home" ? (
          <div>
            <Logo />
            <Rank  name={this.state.user.name}  entries={this.state.user.entries}/>
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onPictureSubmit}
            />
            <FaceRecognition
              imageUrl={imageUrl}
              box={box}
            />
          </div>
        ) : ( 
          route === 'signin' ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} /> : 
          <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          
        )}
      </div>
    );
  }
}

export default App;

// app.models
// .predict(
// Clarifai.COLOR_MODEL,
//     // URL
//     "https://samples.clarifai.com/metro-north.jpg"
// )
// .then(function(response) {
//     // do something with responseconsole.log(response);
//     },
//     function(err) {// there was an error}
// );
