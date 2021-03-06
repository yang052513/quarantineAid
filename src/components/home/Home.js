import React, { Component } from "react"
import firebase from "firebase"
import MyMap from "./MyMap"
import UserNav from "../UserNav"

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      darkMode: false,
      loading: false,
      lat: "",
      lng: "",
      location: {
        house_number: "",
        road: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
      },
    }
  }

  componentDidMount() {
    this.setState({ loading: true })
    const db = firebase.firestore()
    firebase.auth().onAuthStateChanged((user) => {
      db.collection("user")
        .doc(user.uid)
        .onSnapshot((doc) => {
          this.setState({
            darkMode: doc.data().DarkMode,
          })
        })
    })

    navigator.geolocation.getCurrentPosition((position) => {
      let token = "a1ee650f1079c4"
      let lat = position.coords.latitude
      let lon = position.coords.longitude
      let url = "https://us1.locationiq.com/v1/reverse.php?"
      let requestUrl = `${url}key=${token}&lat=${lat}&lon=${lon}&format=json`

      fetch(requestUrl)
        .then((res) => res.json())
        .then((location) => {
          this.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            location: {
              // road: location.address.road,
              city: location.address.city,
              state: location.address.state,
              postcode: location.address.postcode,
              country: location.address.country,
            },
          })

          console.log(location)

          //write user location to firebase
          firebase.auth().onAuthStateChanged((user) => {
            db.collection("user")
              .doc(user.uid)
              .collection("Doc")
              .doc("Location")
              .set(
                {
                  Location: {
                    // road: location.address.road,
                    city: location.address.city,
                    state: location.address.state,
                    postcode: location.address.postcode,
                    country: location.address.country,
                  },
                  Lat: position.coords.latitude,
                  Lng: position.coords.longitude,
                },
                {
                  merge: true,
                }
              )
          })
        })
    })
    this.setState({ loading: false })
  }

  render() {
    return (
      <div className="main-container">
        <UserNav title="Home Dashboard" />
        <div className="home-content-container">
          {this.state.loading === true ? null : (
            <MyMap
              lat={this.state.lat}
              lng={this.state.lng}
              city={this.state.location.city}
              prov={this.state.location.state}
              theme={this.state.darkMode}
              // road={this.state.location.road}
            />
          )}
          {/* <MyMap /> */}
        </div>
      </div>
    )
  }
}

export default Home
