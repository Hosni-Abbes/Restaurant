import React from 'react';
import { NavLink } from 'react-router-dom';

class Header extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isToggled:false,
      docTitle:'',
    }
  }

  componentDidMount = () => {
    if(window.location.href.substring(window.location.href.lastIndexOf('/') + 1) === '' ){
      this.setState({docTitle:'home'.charAt(0).toUpperCase() + 'home'.substring(1)})
      document.title = this.state.docTitle
    }else{
      this.setState({docTitle:window.location.href.substring(window.location.href.lastIndexOf('/') + 1).charAt(0).toUpperCase() + window.location.href.substring(window.location.href.lastIndexOf('/') + 1).substring(1)})
      document.title = this.state.docTitle
    }
  }
  
  componentDidUpdate = (prevProp, prevState) => {
    if(prevState.docTitle !== this.state.docTitle){
      if(window.location.href.substring(window.location.href.lastIndexOf('/') + 1) === '' ){
        this.setState({docTitle:'home'.charAt(0).toUpperCase() + 'home'.substring(1)})
        document.title = this.state.docTitle
      }else{
        this.setState({docTitle:window.location.href.substring(window.location.href.lastIndexOf('/') + 1).charAt(0).toUpperCase() + window.location.href.substring(window.location.href.lastIndexOf('/') + 1).substring(1)})
        document.title = this.state.docTitle
      }
    }
  }
  
  render(){
    return (
      <header className="header__container">

        <nav className="container header__nav">
          <div className=""><NavLink exact to="/" onClick={ () => {this.setState({isToggled:false, docTitle:'home'})}} >المطعم</NavLink></div>
          <div className="uil uil-bars nav_btn_toggler d-md-none fs-3" onClick={ () => {this.setState({isToggled: !this.state.isToggled})} }></div>
          <div className="d-flex f-direction w-50 nav_links_btn_holder ">
            <div className={this.state.isToggled ? "nav__links  d-md-flex" : 'd-none d-md-flex justify-content-between align-items-center flex-row-reverse w-100'}>
              <NavLink to="/menu" onClick={ () => {this.setState({isToggled:false, docTitle:'menu'})}} >القائمة</NavLink>
              <NavLink to="/offers" onClick={ () => {this.setState({isToggled:false, docTitle:'offers'})}} >العروض</NavLink>
              <NavLink to="/register" onClick={ () => {this.setState({isToggled:false, docTitle:'register'})}} >إنظمّ إلينا</NavLink>
              <NavLink to="/login" onClick={ () => {this.setState({isToggled:false, docTitle:'login'})}} >تسجيل الدخول</NavLink>
            </div>
            <NavLink to="/cart" className="the__cart me-md-3" onClick={ () => {this.setState({isToggled:false, docTitle:'cart'})}} >
              <i className="uil uil-shopping-cart fs-2"></i>
              <span className="cart_orders_num">{this.props.numbOfOrders}</span>
            </NavLink>
          </div>
        </nav>

      </header>
    );
  }
}

export default Header;