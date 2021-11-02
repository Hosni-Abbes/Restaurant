import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class AdminLogin extends React.Component {
  constructor(){
    super()
    this.state={
      adminEmail: '',
      adminPass: '', 
      respMsg: ''
    }
    this.adminVerify = this.adminVerify.bind(this)
  }

  //FUNCTION CONNECT WITH DB TO VERIFY ADMIN DATA
  adminVerify = (e) =>{
    e.preventDefault()
    //SET THE FUNCTION TO CANCEL AXIOS FETCH WHEN COMPONENT WILL UNMOUNT
    // this.axiosCancelSource = axios.CancelToken.source()
    //CREATE FORMDATA TO SEND ADMIN DATA TO SERVER SIDE
    const adminDataForm = new FormData()
    adminDataForm.append('email', this.state.adminEmail)
    adminDataForm.append('password', this.state.adminPass)
    //USE AXIOS TO MAKE HTTP REQUEST
    axios.post('http://localhost/bobos/admin-login.php', adminDataForm)
    .then(response => {
      this.setState({respMsg: response.data})
      //IF EMAIL AND PASSWORD ARE CORRECT THEN REDIRECT ADMIN TO ADMIN DASHBOARD
      if(this.state.respMsg === 'Login success'){
        //set localstorage to prevent entering to this page when admin is logged in and redirect him to dashboard
        localStorage.setItem('adminData', this.state.adminEmail)
        //return the defaault state of admin data and msg
        this.setState({
          adminEmail: '',
          adminPass: '', 
          respMsg: ''
        })
      }
    })
    .catch(error => console.log(error))
  }

  render(){
    return (
      //USE LOCALSTORAGE TO CHECK IF ADMIN IS LOGGED IN OR NOT, IF YES REDIRECT HIM TO DASHBOARD
      localStorage.getItem('adminData') !== null ? <Redirect to="/dashboard"></Redirect> :
      <div>
        <h2 className="text-center mt-5 mb-3">Admin Login</h2>
        <form className="admin_login_form d-flex flex-column" onSubmit={this.adminVerify}>
          <p className="text-start text-danger m-0 p-0">{this.state.respMsg}</p>
          <input type="email" placeholder="Type Email" onChange={e => this.setState({adminEmail: e.target.value})} />
          <input type="password" placeholder="Type Password" onChange={e => this.setState({adminPass: e.target.value})} />
          <button type="submit">Login</button>
        </form>
      </div>
      
    );
  }
}

export default AdminLogin;