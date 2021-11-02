import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import Header from './components/Header/Header';
import Home from './components/Home/Home';
import NMenu from './components/Menu/NMenu';
import Offers from './components/Offers/Offers';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Cart from './components/Cart/Cart';
import AdminLogin from './components/AdminLogin/AdminLogin';
import AdminDash from './components/AdminDash/AdminDash';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      numbOfOrders: 0,
      clickedOrder: '',
      ordersArray: []
    }
    this.clickedOrderFunc = this.clickedOrderFunc.bind(this)
    this.increseOrders = this.increseOrders.bind(this)
    this.confirmOrder = this.confirmOrder.bind(this)
    this.deleteItems = this.deleteItems.bind(this)
    this.increaseCartOrders = this.increaseCartOrders.bind(this)
    this.decreaseCartOrders = this.decreaseCartOrders.bind(this)
    this.setToInitialState = this.setToInitialState.bind(this)
  }

  //function to change the state when click on meal div
  clickedOrderFunc = (theClickedOrder) => {
    this.setState({clickedOrder:theClickedOrder}, () => true )
  }
  //function to change the state to increase the total number of orders
  increseOrders = () => {
    let num = this.state.numbOfOrders + 1
    this.setState({numbOfOrders: num}, () => true )
  }
  
  // function to collect orderOptions when submit form confirming order
  confirmOrder = (...options) => {
    let arrayOfConfirmedOrders = [].concat(options)
    this.setState({ordersArray: this.state.ordersArray.concat(arrayOfConfirmedOrders)}, () => true )
  }

  // function to delete items from cart
  deleteItems = (index) => {
    const arrayOfItems = this.state.ordersArray
    arrayOfItems.splice(index,1)
    this.setState({
      ordersArray: arrayOfItems,
      numbOfOrders: this.state.numbOfOrders - 1
    })
  }

  //function to increase the number of each order in cart
  increaseCartOrders = (index) => {
    const arrayOfItems = this.state.ordersArray
    if(arrayOfItems[index].howMany > 0){
    arrayOfItems[index].howMany++
    this.setState({ordersArray: arrayOfItems})
    }
  }

  //function to decrease the number of each order in cart
  decreaseCartOrders = (index) => {
    const arrayOfItems = this.state.ordersArray
    if(arrayOfItems[index].howMany > 1){
    arrayOfItems[index].howMany--
    this.setState({ordersArray: arrayOfItems})
    }
  }

  //function to delete all orders and return the state to initial state
  setToInitialState = () => {
    this.setState({
      numbOfOrders: 0,
      clickedOrder: '',
      ordersArray: []
    })
  }

  render(){
    return (
      <BrowserRouter>
        <div className="App">
          <Header numbOfOrders={this.state.numbOfOrders} />
          <Switch>
            <Route exact path="/"> <Home clickedOrderFunc={this.clickedOrderFunc} clickedOrder={this.state.clickedOrder} numbOfOrders={this.state.numbOfOrders}
                                          increseOrders={this.increseOrders} confirmOrder={this.confirmOrder} /> </Route>
            <Route path="/menu"> <NMenu  clickedOrderFunc={this.clickedOrderFunc} clickedOrder={this.state.clickedOrder} numbOfOrders={this.state.numbOfOrders}
                                          increseOrders={this.increseOrders} confirmOrder={this.confirmOrder}  /> </Route>
            <Route path="/offers"> <Offers /> </Route>
            <Route path="/register"> <Register /> </Route>
            <Route path="/login"> <Login /> </Route>
            <Route path="/cart"> <Cart ordersArray={this.state.ordersArray} numbOfOrders={this.state.numbOfOrders} deleteItems={this.deleteItems} 
                                        increaseCartOrders={this.increaseCartOrders} decreaseCartOrders={this.decreaseCartOrders} setToInitialState={this.setToInitialState} /> </Route> 
            <Route path="/admin-login"> <AdminLogin />   </Route>
            <Route path="/dashboard"> <AdminDash />   </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
