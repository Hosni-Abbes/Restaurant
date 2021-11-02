import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import AdminAddEditMeals from './AdminAddEditMeals';

class AdminDash extends React.Component {
  constructor(){
    super()
    this.state={
      orders: [],
      finished_orders:[],
      clickedOption: 'all_meals',
      currentEmail:'',
      newEmail: '',
      currentPass:'',
      newPass:'',
      respMsg:'',
      index:0,
      paginArray:[],
      paginArrayFinish:[],
      isLoading:false,
      isEditLoading:false
    }
    this.renderAllOrders = this.renderAllOrders.bind(this)
    this.renderFinishedOrders = this.renderFinishedOrders.bind(this)
    this.renderChangeEmail = this.renderChangeEmail.bind(this)
    this.renderChangePass = this.renderChangePass.bind(this)
    this.removeOrder = this.removeOrder.bind(this)
    this.finishOrder = this.finishOrder.bind(this)
    this.loading = this.loading.bind(this)
  }


  //FUNCTION TO RENDER ALL MEALS PAGE
  renderAllOrders = () => {
    this.axiosCancelSource = axios.CancelToken.source()
    const interval = setInterval(()=> {
      axios('http://localhost/bobos/get-allorders.php', {cancelToken: this.axiosCancelSource.token}  )
      .then(response => this.setState({orders: response.data}) )
      .catch(error => console.log(error))
      
      const allOrders = this.state.orders
      const index = this.state.index
      const arr = []
      this.setState({paginArray:[]})
      for(let i=index; i<index+4;i++){
        if(allOrders[i] !== undefined && allOrders !== null){
          arr.push(allOrders[i])
          this.setState({paginArray:arr})
        }
      }
    },2000)
    return ()=> clearInterval(interval)
  }
  

  //FUNCTION TO RENDER CHaNGE EMaIL PaGE
  renderChangeEmail = () => {
    return  <React.Fragment>
              <div className={this.state.isLoading ? 'd-flex justify-content-center mt-4' : 'd-none'}>
                <div className="spinner-grow text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                <div className="spinner-grow text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
                <div className="spinner-grow text-success" role="status"><span className="visually-hidden">Loading...</span></div>
                <div className="spinner-grow text-danger" role="status"><span className="visually-hidden">Loading...</span> </div>
              </div> 
              <form className={this.state.isLoading ? 'd-none' : "dash__form m-auto d-flex flex-column w-75 mt-5"} onSubmit={e => {
                e.preventDefault()
                let changeEmailForm = new FormData()
                changeEmailForm.append('current-email', this.state.currentEmail)
                changeEmailForm.append('current-pass', this.state.currentPass)
                changeEmailForm.append('new-email', this.state.newEmail)
                axios.post('http://localhost/bobos/admin-chng-email.php', changeEmailForm)
                .then(response => {
                  this.setState({respMsg:response.data})
                  if(response.data === 'Email changed successfully'){
                    localStorage.setItem('adminData', this.state.newEmail)
                    this.setState({currentEmail:'', newEmail:'', currentPass:'', newPass:''})
                  }
                })
                .catch(error => console.log(error))
              }}>
                <h2 className="text-center mb-3">Change email.</h2>
                <p className={this.state.respMsg === 'Email changed successfully' ? "text-start text-success m-0 p-0" : "text-start text-danger m-0 p-0" }>{this.state.respMsg}</p>
                <input type="email" placeholder="Current email" value={this.state.currentEmail} onChange={e => this.setState({currentEmail : e.target.value})} />
                <input type="email" placeholder="New email" value={this.state.newEmail} onChange={e => this.setState({newEmail : e.target.value})} />
                <input type="password" placeholder="Your password" value={this.state.currentPass} onChange={e => this.setState({currentPass : e.target.value})} />
                <button type="submit">Send</button>
              </form>
            </React.Fragment>
  }

  //FUNCTION TO RENDER CHaNGE PaSSWORD PAGE
  renderChangePass = () => {
    return  <React.Fragment>
              <div className={this.state.isLoading ? 'd-flex justify-content-center mt-4' : 'd-none'}>
                <div className="spinner-grow text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                <div className="spinner-grow text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
                <div className="spinner-grow text-success" role="status"><span className="visually-hidden">Loading...</span></div>
                <div className="spinner-grow text-danger" role="status"><span className="visually-hidden">Loading...</span> </div>
              </div> 
              <form className={this.state.isLoading ? 'd-none' : "dash__form m-auto d-flex flex-column w-75 mt-5"} onSubmit={e => {
                e.preventDefault()
                let changePassForm = new FormData()
                changePassForm.append('current-email', this.state.currentEmail)
                changePassForm.append('current-pass', this.state.currentPass)
                changePassForm.append('new-pass', this.state.newPass)
                axios.post('http://localhost/bobos/admin-chng-pass.php', changePassForm)
                .then(response => {
                  this.setState({respMsg:response.data})
                  if(response.data === 'Password changed successfully'){
                    this.setState({currentEmail:'', newEmail:'', currentPass:'', newPass:''})
                  }
                })
                .catch(error => console.log(error))
              }}>
                <h2 className="text-center mb-3">Change password.</h2>
                <p className={this.state.respMsg === 'Password changed successfully' ? "text-start text-success m-0 p-0" : "text-start text-danger m-0 p-0" }>{this.state.respMsg}</p>
                <input type="email" placeholder="Your email" value={this.state.currentEmail} onChange={e => this.setState({currentEmail : e.target.value})} />
                <input type="password" placeholder="Current password" value={this.state.currentPass} onChange={e => this.setState({currentPass : e.target.value})} />
                <input type="password" placeholder="New password" value={this.state.newPass} onChange={e => this.setState({newPass : e.target.value})} />
                <button type="submit">Send</button>
              </form>
            </React.Fragment>
  }
  
  //FUNCTION TO RENDER FINISHED MEALS
    renderFinishedOrders = () => {
      const interval = setInterval(()=> {
        this.axiosCancelSource = axios.CancelToken.source()
      axios('http://localhost/bobos/get-finishedorders.php', {cancelToken: this.axiosCancelSource.token} )
      .then(response => this.setState({finished_orders: response.data}) )
      .catch(error => console.log(error))
    },2000)
    return () => clearInterval(interval)
  }

  //FUNCTION TO FINISH THE ORDER WHEN CLICK ON FINISH
  finishOrder = (id) => {
    const formId = new FormData()
    formId.append('order-id', id)
    //make http request to send the id of the order to delete it from db
    axios.post('http://localhost/bobos/finishorder.php', formId)
    .then(response =>{
      if(response.data === 'order finished'){
        this.setState({isEditLoading:true})
        setTimeout(()=>this.setState({isEditLoading:false}),2000)
      }
    } )
    .catch(error => console.log(error))
  }


  //FUNCTION TO DELETE THE ORDER WHEN CLICK ON DELETE
  removeOrder = (id) => {
    const formId = new FormData()
    formId.append('order-id', id)
    //make http request to send the id of the order to delete it from db
    axios.post('http://localhost/bobos/deleteorder.php', formId)
    .then(response => {
      if(response.data === 'order deleted'){
        this.setState({isEditLoading:true})
        setTimeout(()=>this.setState({isEditLoading:false}),2000)
      }
    })
    .catch(error => console.log(error))
  }

  //FUNCTION TO MAKE PAGINATION (ONLY 4 ORDER IN EACH PAGE)
  paginationPlus = () => {
    const allOrders = this.state.orders
    const index = this.state.index
    const arr = []
    const interval = setInterval(()=>{
      if(allOrders.length > 0){
        this.setState({paginArray:[]})
        for(let i=index; i<index+4;i++){
          if(allOrders[i] !== undefined && allOrders !== null){
            arr.push(allOrders[i])
            this.setState({paginArray:arr})
          }
        }
      }
    },2000)
    return ()=>clearInterval(interval)
  }
  
  //FUNCTION SHOW LOADING ANIMATION
  loading = () => {
    this.setState({isLoading:true})
    setTimeout(()=>this.setState({isLoading:false}),2000)
  }
  
  componentDidMount=()=>{
    this.loading()
    this.renderAllOrders()
  }
  componentDidUpdate=(prevProp, prevState)=>{
    if(this.state.orders.length !== prevState.orders.length || this.state.finished_orders.length !== prevState.finished_orders.length || this.state.clickedOption !== prevState.clickedOption ){
      this.loading()
    }
  }

  render(){
    const paginArray = this.state.paginArray
    const rows = []
    const numberOfPages = Math.ceil(this.state.orders.length / 4)
    for(let i=0;i<numberOfPages;i++){
      rows.push(<li key={i} className="page-item"><span role="button" onClick={ () => this.setState({index: i*4}) }  className="page-link">{i+1}</span></li>)
    }
    return (
      //CHECK IF LOCALSTORAGE IS EMPTY THEN ADMIN IS NOT LOGGED IN == REDIRECT TO ADMIN LOGIN PAGE
      localStorage.getItem('adminData') === null ? <Redirect to="/admin-login"></Redirect> :
      <div className="dash-container d-flex text-start flex-row-reverse" >
        <div className="dash_side_menu d-flex flex-column">
          <span className="p-2 mb-2 text-white"><i className="uil uil-user"></i> <strong>{ localStorage.getItem('adminData') }</strong></span>
          <button className={this.state.clickedOption === 'all_meals' ? 'dash_active_btn' : null} onClick={() => this.setState({clickedOption: 'all_meals'}) }><i className="uil uil-list-ul"></i> All meals</button>
          <button className={this.state.clickedOption === 'finished' ? 'dash_active_btn' : null} onClick={() => { this.setState({clickedOption: 'finished'}); this.renderFinishedOrders() }}><i className="uil uil-check-circle"></i> Finished</button>
          <button className={this.state.clickedOption === 'add_meals' ? 'dash_active_btn' : null} onClick={() => this.setState({clickedOption: 'add_meals'}) }><i className="uil uil-plus"></i> Add meals</button>
          <button className={this.state.clickedOption === 'edit_meals' ? 'dash_active_btn' : null} onClick={() => this.setState({clickedOption: 'edit_meals'}) }><i className="uil uil-edit"></i> Edit</button>
          <button className={this.state.clickedOption === 'ch_email' ? 'dash_active_btn' : null} onClick={() => { this.setState({clickedOption: 'ch_email', currentEmail: '', currentPass: '', newEmail: '', newPass: '', respMsg:'' }) ; this.loading()}}><i className="uil uil-envelope-edit"></i> Change Email</button>
          <button className={this.state.clickedOption === 'ch_pass' ? 'dash_active_btn' : null} onClick={() => this.setState({clickedOption: 'ch_pass', currentEmail: '', currentPass: '', newEmail: '', newPass: '', respMsg:'' }) }><i className="uil uil-key-skeleton"></i> Change Password</button>
          <button onClick={() => {localStorage.removeItem('adminData'); localStorage.clear(); }} >Logout <i className="uil uil-signout"></i></button>
        </div>

        <div className="dash_main_content bg-white">
          { this.state.clickedOption === 'all_meals' ?
            <React.Fragment>
            {this.state.isLoading ? 
            <div className='d-flex justify-content-center z-index_11 position-absolute pt-5 start-50 translate-middle'>
              <div className="spinner-grow text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-grow text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-grow text-success" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-grow text-danger" role="status"><span className="visually-hidden">Loading...</span> </div>
            </div> 
          :
            <React.Fragment>
              <table className={paginArray.length ? 'd-flex f-direction border border-dark' : 'd-flex f-direction border-0'}>
                <tbody className='d-flex w-100 flex-column'>
                  <tr className='w-100 d-flex f-direction justify-content-between bg-dark rounded text-white'>
                    <th>معرف الطلب (id)</th>
                    <th>اسم الوجبة</th>
                    <th>الاختيارات</th>
                    <th>حار/لا</th>
                    <th>كيفية الحصول على الطلب</th>
                    <th>عدد الوجبات</th>
                    <th>الثمن الاجمالي</th>
                    <th>رقم الهاتف</th>
                    <th>متابعة الطلبات</th>
                  </tr>
                  {
                    paginArray.length? paginArray.map((order, index) => {
                        return  <tr key={order.meal_id} className='meal_sim d-flex f-direction w-100 justify-content-between'>
                                  <td>{order.meal_unique_id}</td>
                                  <td>{order.meal_name}</td>
                                  <td>{order.meal_options}</td>
                                  <td>{order.meal_is_hot !== '' ? order.meal_is_hot : 'لم يختر' }</td>
                                  <td>{order.meal_how_get}</td>
                                  <td>{order.meal_how_many}</td>
                                  <td>{order.meal_price * order.meal_how_many}</td>
                                  <td>{order.meal_phone}</td>
                                  <td><span role="button" className="text-white bg-danger rounded p-1" onClick={ () => {this.finishOrder(order.meal_id);this.loading()}}>إنهاء</span></td>
                                </tr>
                    })  : <tr className={this.state.isLoading ? 'd-none' : 'd-flex bg-white'}><td colSpan="9" className="w-100 py-3 fs-3">لم يتم تسجيل اي طلب</td></tr>
                  }
                </tbody>
              </table>
              {/* PAGINATION CONTROLS */}
              <div className={paginArray.length ? 'd-block':'d-none'}>
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-center">
                    <li className="page-item">
                      <span role="button" onClick={ () => this.setState({index: this.state.index-4}) } className="page-link" aria-label="Previous"><span aria-hidden="true">&laquo;</span></span>
                    </li>
                    { rows  }
                    <li className="page-item">
                      <span role="button"  onClick={ () => this.setState({index: this.state.index+4}) }  className="page-link" aria-label="Next"><span aria-hidden="true">&raquo;</span></span>
                    </li>
                  </ul>
                </nav>
              </div>
            </React.Fragment>
            }
            </React.Fragment>
          
          : this.state.clickedOption === 'finished' ?
          <React.Fragment>
            {this.state.isLoading ? 
            <div className='d-flex justify-content-center z-index_11 position-absolute pt-5 start-50 translate-middle'>
              <div className="spinner-grow text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-grow text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-grow text-success" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-grow text-danger" role="status"><span className="visually-hidden">Loading...</span> </div>
            </div> 
          :
            <React.Fragment>
              <table className={this.state.finished_orders.length ? 'd-flex f-direction border border-dark' : 'd-flex f-direction border-0'}>
                <tbody className='d-flex w-100 flex-column'>
                  <tr className='w-100 d-flex f-direction justify-content-between bg-dark rounded text-white'>
                    <th>معرف الطلب (id)</th>
                    <th>اسم الوجبة</th>
                    <th>الاختيارات</th>
                    <th>حار/لا</th>
                    <th>كيفية الحصول على الطلب</th>
                    <th>عدد الوجبات</th>
                    <th>الثمن الاجمالي</th>
                    <th>رقم الهاتف</th>
                    <th>متابعة الطلبات</th>
                  </tr>

                  {
                  this.state.finished_orders.length ? this.state.finished_orders.map((order, index) => {
                    return  <tr key={order.meal_id} className='meal_sim d-flex f-direction w-100 justify-content-between'>
                              <td>{order.meal_unique_id}</td>
                              <td>{order.meal_name}</td>
                              <td>{order.meal_options}</td>
                              <td>{order.meal_is_hot !== '' ? order.meal_is_hot : 'لم يختر' }</td>
                              <td>{order.meal_how_get}</td>
                              <td>{order.meal_how_many}</td>
                              <td>{order.meal_price * order.meal_how_many}</td>
                              <td>{order.meal_phone}</td>
                              <td><span role="button" className="text-white bg-danger rounded p-1" onClick={ () => {this.removeOrder(order.meal_id);this.loading(); }}>حذف</span></td>
                            </tr>
                  
                  })  : <tr className={this.state.isLoading ? 'd-none' : 'd-flex bg-white'}><td colSpan="9" className="w-100 py-3 fs-3">لم يتم تسجيل اي طلب</td></tr>
                  }
                </tbody>
              </table>
              {/* PAGINATION CONTROLS */}
              <div className={this.state.finished_orders.length? 'd-block':'d-none'}>
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-center">
                    <li className="page-item">
                      <span role="button" onClick={ () =>{ this.setState({index: this.state.index-4}) }} className="page-link" aria-label="Previous"><span aria-hidden="true">&laquo;</span></span>
                    </li>
                    {  }
                    <li className="page-item">
                      <span role="button"  onClick={ () =>{ this.setState({index: this.state.index+4}) }}  className="page-link" aria-label="Next"><span aria-hidden="true">&raquo;</span></span>
                    </li>
                  </ul>
                </nav>
              </div>
            </React.Fragment>
            }
          </React.Fragment>

          : this.state.clickedOption === 'add_meals' || this.state.clickedOption === 'edit_meals' ? <AdminAddEditMeals clickedOption={this.state.clickedOption} isLoading={this.state.isLoading} loading={this.loading}/>
          : this.state.clickedOption === 'ch_email' ? this.renderChangeEmail()
          : this.state.clickedOption === 'ch_pass' ? this.renderChangePass() : null }
        </div>
      </div>
    );
  }
}

export default AdminDash;
