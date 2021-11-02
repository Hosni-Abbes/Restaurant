import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

class Cart extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      confirmOrdering: false,
      showOverlay: false,
      waiting3sec: 'init',
      validNumber: 0
    }
    this.confirmPhoneAndOrder = this.confirmPhoneAndOrder.bind(this)
  }

    //function Confirm Phone number and confirm order
    confirmPhoneAndOrder = () => {
      if(this.state.validNumber === this.props.ordersArray[0].phoneNumb ){
        this.setState({waiting3sec: 'load'}); 
        setTimeout(()=> this.setState({waiting3sec: 'afterPhoneConfrm'}), 3000)
        setTimeout(()=>{ 
          this.setState({waiting3sec: 'init',showOverlay: false})
        }, 6000);
      }
      this.setState({validNumber: 0})
      
      //Make http request to add the orders to dataBase
      const orders = JSON.stringify(this.props.ordersArray)
      const orderForm = new FormData()
      orderForm.append('ordersArray', orders)
      axios.post('http://localhost/bobos/addorderstodb.php', orderForm)
      .then(response => true )
      .catch(error => console.log(error))
      //run the function setToInitialState to empty everything after 5sec from click on confirm and send form
      setTimeout(()=> {
        this.props.setToInitialState()
      } , (5000))
    }
  
  render(){ 
    const { ordersArray } = this.props;
    var totalPrice = 0
    const cartItems = ordersArray.length ? ordersArray.map((item, index) => {
      totalPrice += item.totPrice * item.howMany
      return  <tr key={index}>
                <td className="d-flex flex-column align-items-end">
                  <img src={`http://localhost/bobos/uploaded-images/${item.imgFromDB}`} alt={item.name} />
                  <p>{item.name} ({item.options.join(',')})</p>
                </td>
                <td className="row d-flex align-items-center f-direction"><span className="col-12 p-0">{item.totPrice * item.howMany}</span> <span className="col-12 p-0">ملّيم</span></td>
                <td className="row d-flex align-items-center f-direction how_many">
                  <span className="col-md-2">{item.howMany}</span>
                  <div className="col-md-10 d-flex align-items-center f-direction">
                    <button className="btn btn-success mx-2" onClick={() => this.props.increaseCartOrders(index)} >+</button>
                    <button className="btn btn-danger" onClick={() => this.props.decreaseCartOrders(index) } >-</button>
                  </div>
                </td>
                <td className="text-center"><i className="uil uil-trash-alt delete__btn" onClick={() => this.props.deleteItems(index)}></i></td>
              </tr>
      
    }) : null

    return (
      <div className="container pt-4">
        <div className="row cart__heading d-flex justify-content-between f-direction txt-direction mb-3 text-center">
          <span className="col-sm-6">سلّة المشتريات<i className="uil uil-shopping-cart fs-2"></i> </span>
          <span className="col-sm-6">لديك <span className="text-danger">{this.props.numbOfOrders}</span> عناصر في السلّة</span>
        </div>

        {this.props.numbOfOrders > 0 ?
          <React.Fragment>
          <table className="cart_page_table">
            <tbody>
              <tr>
                <th>الوجبة</th>
                <th>الثمن</th>
                <th>الكمّية</th>
                <th>حذف</th>
              </tr>
              {cartItems}
            </tbody>
          </table>
          <div className="cart__bottom-info pt-2">
            <div className="text-start">
              <p className="mb-0">السعر الإجمالي</p>
              <p className="d-flex f-direction justify-content-end"><strong className="px-2">{totalPrice}</strong> <span>مليم</span></p>
            </div>
            <div className="d-flex f-direction justify-content-between align-items-center mt-3">
              <NavLink to="/menu" onClick={() => document.title = "Menu" } ><i className="uil uil-angle-double-left"></i> مواصلة التسوق</NavLink>
              <button className="btn btn-primary" onClick={()=> {this.setState({confirmOrdering: true, showOverlay:true}); document.body.style.overflow = 'hidden'} }>تأكيد الشراء</button>
            </div>
          </div>
          </React.Fragment>
          : 
          <div className="no__item_in_cart">
            <p className="text-center">لم تقم بإختيار أي وجبة.. توجه إلى القائمة و اختر وجبتك المفضلة </p>
            <div className="text-start mt-5">
              <NavLink to="/menu" onClick={() => document.title = "Menu" } ><i className="uil uil-angle-double-left"></i> قائمة الطعام</NavLink>
            </div>
          </div>
        }

        {/* OVERLAY TO SHOW WHEN USER SELECT ONE MEAL (TO PREVENT CLICKING ON OTHER PARTS) */}
        <div className={this.state.showOverlay ? 'overlay' : 'd-none' } onClick={()=> { this.setState({showOverlay: false, confirmOrdering:false, waiting3sec:'init'}); document.body.style.overflow = 'visible' } } ></div>

        {/* message will render when cllick on confoirm btn */}
        <div className={this.state.confirmOrdering ? 'confirm_cart_order' : 'd-none' }>
          <p>هل تريد تأكيد طلبك؟</p>
          <div className="d-flex justify-content-evenly">
            <button className="btn btn-success" onClick={ ()=> {this.setState({waiting3sec: 'load', confirmOrdering:false}); setTimeout(()=> this.setState({waiting3sec: 'after3'}) , 3000)} }>نعم</button>
            <button className="btn btn-danger" onClick={()=> { this.setState({showOverlay: false, confirmOrdering:false});  document.body.style.overflow = 'visible' }}>إلغاء</button>
          </div>
        </div>

        {/* message will render after click yes confirm order this will request from user to enter his phone number */}
        <div className={this.state.waiting3sec === 'load' ? 'confirm_cart_order' : 'd-none' }>
          <p>تحميل..</p>
        </div>

        <div className={this.state.waiting3sec === 'after3' ? 'confirm_cart_order' : 'd-none' }>
          <div>
            <p>يرجى إدخال رقم الهاتف للتأكيد</p>
            <input type="tel" className="phone_field fs-6 txt-direction" placeholder="رقم الهاتف اجباري" onChange={(e) => {
              this.setState({validNumber: e.target.value});
              e.target.value !== this.props.ordersArray[0].phoneNumb ? document.querySelector('.phone_err_msg').classList.add('d-block') : document.querySelector('.phone_err_msg').classList.remove('d-block') 
            }  } />
            <span className='phone_err_msg'>رقم الهاتف خاطئ، الرجاء التأكّد قبل الإرسال</span>
            <div className="mt-3">
              <button className="btn btn-success" onClick={ ()=> this.confirmPhoneAndOrder() }>إرسال</button>
            </div>
          </div>
        </div>

        <div className={this.state.waiting3sec === 'afterPhoneConfrm' ? 'confirm_cart_order' : 'd-none' }>
          <p>لقد تلقّينا طلبك بنجاج. مرحبا بك</p>
        </div>
      </div>
    );
  }
}

export default Cart;