import React, { Component } from "react";
import R from "ramda";
import Mui from "muicss/react";
import "muicss/dist/css/mui.css";
import getSymbol from "currency-symbol-map";


const mapI = R.addIndex(R.map);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
      currency: "USD",
      bill: 0,
      percentage: 20,
      tip: 0,
      party: 1
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
        const currencies = R.keys(json);
        this.setState({ currencies });
      });
  }

  updateCurrency = evt => {
    this.setState({
      currency: evt.target.value
    });
  }

  updateBill = evt => {
    this.setState({
      bill: parseFloat(evt.target.value, 10) || 0
    });
  }

  updatePercentage = evt => {
    this.setState({
      percentage: parseInt(evt.target.value, 10) || 0
    });
  }

  updateParty = evt => {
    this.setState({
      party: parseInt(evt.target.value, 10) || 1
    });
  }

  render() {
    const {bill, percentage, party, currencies, currency} = this.state;
    const tip = (bill * (percentage / 100) / party);
    const total = (bill + tip) / party;

    return (
      <Mui.Container fluid>
        <Mui.Row>
          <Mui.Col md="12">
            <Mui.Panel>
              <Mui.Form>
                <legend>Tip Calculator</legend>
                <Mui.Select
                  label="Currency"
                  onChange={this.updateCurrency}
                  value={currency}
                >
                  {mapI(
                    (c, i) => (
                      <option key={i}> 
                        {c}
                      </option>
                    ),
                    currencies
                  )}
                </Mui.Select>
                <Mui.Input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  label={"Bill Total (" + (getSymbol(currency) || "?") + ")"}
                  onChange={this.updateBill}
                  defaultValue={0.00}
                  floatingLabel 
                />
                <Mui.Input 
                  type="number" 
                  label="Tip Percentage" 
                  min="0"
                  defaultValue={20} 
                  onChange={this.updatePercentage}
                  floatingLabel 
                />
                <Mui.Input 
                  type="Number" 
                  label="Members in Party" 
                  min="1"
                  defaultValue={1} 
                  onChange={this.updateParty}
                  floatingLabel 
                />
                <div className="mui--text-left">
                  <label>Amount to tip: </label>
                  <label>{getSymbol(currency) + tip.toFixed(2)}</label>
                  {party > 1 && <span> per person</span>}
                </div>
                <div className="mui--text-left">
                  <label>Total bill: </label>
                  <label>
                    {(getSymbol(currency) || "?") + total.toFixed(2)}
                  </label>
                  {party > 1 && <span> per person</span>}
                </div>
              </Mui.Form>
            </Mui.Panel>
          </Mui.Col>
        </Mui.Row>
      </Mui.Container>
    );
  }
}

export default App;
