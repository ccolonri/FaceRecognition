import React from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Rank from "./components/Rank/Rank";
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
    };
  }
  // Handle Text change in form
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
    event.preventDefault();
    // console.log(event.target.value);
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width, // Multiply total width by the left col percentage
      topRow: clarifaiFace.top_row * height, // Multiply height by top row percentage
      rightCol: width - (clarifaiFace.right_col * width), // Subtract total width of picture from the multiplication of total width and right col percentage
      bottomRow: height - (clarifaiFace.bottom_row * height), // Substract total height of picture from the multiplication of total height and bottom row percentage
    };
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  // Handle Submit button
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    console.log("click");
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        // URL
        this.state.input,
      )
      .then((response) => {
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
    // there was an error
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
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
