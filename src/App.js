import React, { Component } from "react";
import R from "ramda";
import { Appbar, Button, Container } from "muicss/react";
import "muicss/dist/css/mui.css";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: []
    };
  }

  componentDidMount() {
    fetch("https://openexchangerates.org/api/currencies.json")
      .then(response => {
        if(response.ok) {
          return response.json();
        }
      })
      .then(json => {
        const currencies = R.mapObjIndexed(
          (country, currency) => ({
            text: `${currency} (${country})`,
            value: currency
          }),
          json
        );
        this.setState({ currencies });
      });


  }

  render() {
    return (
        <div>
          <Appbar></Appbar>
          <Container>
            <Button color="primary">button</Button>
          </Container>
        </div>
    );
  }
}

export default App;
