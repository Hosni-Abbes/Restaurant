import React from 'react';
import axios from 'axios';

class NMenu extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      allMeals: [],
      optionsFromDB:'',
      priceFromDB: '',
      imgFromDB:'',
      isLoading: false,
      name: '',
      options_price: [],
      options:[],
      hot: '',
      howGet: '',
      howMany: 1,
      totPrice: 0,
      phoneNumb: 0,
      error:false
    }
    this.fetchMeals = this.fetchMeals.bind(this)
    this.loading = this.loading.bind(this)
    this.renderMealOptions = this.renderMealOptions.bind(this)
    this.collectOptions = this.collectOptions.bind(this)
    this.incAndSaveOrder = this.incAndSaveOrder.bind(this)
    this.dismissOrder = this.dismissOrder.bind(this)
  }

  // FUNCTION TO FETCH aLL EXISTaN MEaLS FROM DB
  fetchMeals = () => {
    //use setInterval to get data every 2s
    const interval = setInterval(()=>{ 
      //Make http request
      axios('http://localhost/bobos/get-allmeals.php')
      .then(response => this.setState({ allMeals: response.data }) )
      .catch(error => console.log(error))
    }, 2000 )
    return () => clearInterval(interval)
  }

  //FUNCTION SHOW LOADING ANIMATION
  loading = () => {
    this.setState({isLoading:true})
    setTimeout(()=>this.setState({isLoading:false}),2000)
  }

  //function to render a form of options when click on meal
  renderMealOptions = (order) => {
    //Set the state with the clicked order
    this.props.clickedOrderFunc(order)
    this.setState({name: order})
    document.body.style.overflow = 'hidden'
  }

  //function to collect  orders options wwhen checkbox is checked
  collectOptions = (e) => {
    let arrayOfOptions = this.state.options
    let arrayOfOptionsPrice = this.state.options_price
    let optionprice = e.target.value.substring(e.target.value.indexOf('-')+1)
    if(e.target.checked === true){
      arrayOfOptions.push(e.target.value.substring(0, e.target.value.indexOf('-')))
      arrayOfOptionsPrice.push(optionprice)
      let totPrice = arrayOfOptionsPrice.reduce((a,b) => parseInt(a)+parseInt(b) , 0)
    this.setState({totPrice: parseInt(this.state.priceFromDB) + totPrice })
    }else{
      arrayOfOptions.splice(arrayOfOptions.indexOf(e.target.value),1)
      arrayOfOptionsPrice.splice(arrayOfOptionsPrice.indexOf(e.target.value),1)
      let totPrice = arrayOfOptionsPrice.reduce((a,b) => parseInt(a)+parseInt(b) , 0)
    this.setState({totPrice: parseInt(this.state.priceFromDB) + totPrice })
    }
    
  }

  //function to increase number of orders when confirm 
  //and save the selected order and options to add it to cart
  incAndSaveOrder = () => {
    if (this.state.name === '' || this.state.options_price === [] || this.state.howGet === '' || this.state.phoneNumb === 0){
      this.setState({error: true})
    }else{
      this.props.increseOrders()
      this.renderMealOptions('')
      document.body.style.overflow = 'visible'
      //add class animation on meal added to cart message
      document.querySelector('.added_msg_success').classList.add('msg_animation')
      setTimeout(()=>{document.querySelector('.added_msg_success').classList.remove('msg_animation')}, 2000)

      this.props.confirmOrder(this.state)
      this.setState({
        allMeals: [],
        optionsFromDB:'',
        priceFromDB: '',
        imgFromDB:'',
        name: '',
        options_price: [],
        options: [],
        hot: '',
        howGet: '',
        howMany: 1,
        totPrice: 0,
        phoneNumb: 0,
        error:false
      })
    }
  }

  //function to dismiss order
  dismissOrder = () => {
    this.renderMealOptions('')
    document.body.style.overflow = 'visible'
    this.setState({
      optionsFromDB:'',
      priceFromDB: '',
      imgFromDB:'',
      name: '',
      options_price: [],
      options: [],
      hot: '',
      howGet: '',
      howMany: 1,
      totPrice: 0,
      phoneNumb: 0,
      error: false
    })
  }

  componentDidMount = () => {
    this.loading()
    this.fetchMeals()
  }

  render(){
    return (
      <div className="container">
        <section className="all__meals text-center d-flex flex-column" id="meals">
        <h2 className="my-4">قائمة الطعام</h2>

      {/* Create the menu with data from DB */}
       {/* Loading animation */}
      <div className={this.state.isLoading ? 'd-flex justify-content-center mt-5' : 'd-none'}>
        <div className="spinner-grow text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
        <div className="spinner-grow text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
        <div className="spinner-grow text-success" role="status"><span className="visually-hidden">Loading...</span></div>
        <div className="spinner-grow text-danger" role="status"><span className="visually-hidden">Loading...</span> </div>
      </div> 

      {/* Show all meals here */}
      <div className="row justify-content-between flex-row-reverse">
      {
        this.state.allMeals.length ? this.state.allMeals.map((meal, index) => {
          return  <div key={meal.meal_id} className="card col-12 col-sm-4 col-md-3 col-xl-2 home_page_meal" onClick={ () => {this.renderMealOptions(meal.meal_name); this.setState({optionsFromDB:meal.meal_options_price, priceFromDB: meal.meal_price, imgFromDB:meal.meal_img})} } >
                    <div className="meal__img"><img src={`http://localhost/bobos/uploaded-images/${meal.meal_img}`} alt={meal.meal_name} /></div>
                    <div className="meal__info">
                      <p className="meal__title mt-3">{meal.meal_name}</p>
                    </div>
                  </div>
        }) :
              <div className={this.state.isLoading ? 'd-none' : "d-flex flex-column justify-content-center fs-3 pt-3"}>
                <p>لا يوجد وجبات في الوقت الحالي</p>
                <p>إتصل بنا للإستفسار عن أمر ما </p>
                <a href="tel:22222222">22 222 222</a>
              </div>
      }
      </div>
        {/* OVERLAY TO SHOW WHEN USER SELECT ONE MEAL (TO PREVENT CLICKING ON OTHER PARTS) */}
        <div className={this.props.clickedOrder === '' ? 'd-none' : 'overlay' } onClick={()=> this.dismissOrder() }></div>
        {/* Added to cart message */}
        <div className="added_msg_success">
          <span>تم إضافة طلبك إلى سلّة المشتريات</span>
        </div>
         {/* Error message */}
        <div className={this.state.error ? "alert__msg text-center" : "d-none"}>
          <p className="mb-1">الرجاء ملأ الخانات الإجبارية</p>
          <small className="d-block mb-3">(نوع الوجبة، طريقة التسليم و رقم الهاتف)</small>
          <button type="button" className="btn btn-success" onClick={() => this.setState({error: false})}>حسنا</button>
        </div>

        {/* RENDER THE CLIKED ORDER OPTION WHEN CLICK ON ORDER */}
        {
        this.props.clickedOrder === ''? null
        :
        <form dir="rtl" lang="ar" action="#" className="choose_order_options" onSubmit={(e)=> e.preventDefault()}>
          <p className="mt-0">مرحبا، لقد إخترت <strong>{this.props.clickedOrder}</strong></p>
          <div className="row  align-items-center">
            <div className="col-6 flex-column">
              <p className="mt-0 txt-direction">إختر نوع الوجبة</p>
              {
                this.state.optionsFromDB.split(',').map((option, index) => {
                  return <div key={index} className="d-flex  txt-direction align-items-center ">
                            {/* <input type='checkbox' className="mx-1" id={`opt${index}`} value={option.substring(option.indexOf('-')+1)} onClick={e => this.collectOptions(e)} />  <label htmlFor={`opt${index}`}>{option}</label> */}
                            <input type='checkbox' className="mx-1" id={`opt${index}`} value={option} onClick={e => this.collectOptions(e)} />  <label htmlFor={`opt${index}`}>{option}</label>
                          </div>
                })
              }
            </div>
            <div className="col-6 flex-column ">  
              <span>حار؟</span>
              <div className="d-flex  justify-content-center align-items-center "><input type='radio' className="mx-1" id="opt6" name="hot_nothot" value="حار كثيرا" onChange={ e => this.setState({hot: e.target.value}) } /> <label htmlFor="opt6">حار كثيرا</label></div>
              <div className="d-flex  justify-content-center align-items-center "><input type='radio' className="mx-1" id="opt7" name="hot_nothot" value="ليس حارا" onChange={ e => this.setState({hot: e.target.value}) } /> <label htmlFor="opt7">ليس حارا</label></div>
              <div className="d-flex  justify-content-center align-items-center "><input type='radio' className="mx-1" id="opt8" name="hot_nothot" value="حار متوسّط" onChange={ e => this.setState({hot: e.target.value}) } /> <label htmlFor="opt8">حار متوسّط</label></div>
            </div>
            <div className="col-12 row  m-auto">
              <div className="col-4">
                <p>كم تريد أن تطلب من وجبة؟</p>
                <input type="number" min="1" placeholder="1" onChange={e => this.setState({howMany: e.target.value})}   />
              </div>
              <div className="col-8">
              <p>كيف تريد تسلّم وجبتك؟</p>
              <div className="d-flex  txt-direction align-items-center "><input type='radio'className="mx-1"  id="opt9" name="n5" /> <label className="w-75 txt-direction" htmlFor="opt9"><input className="w-100 rounded-3 txt-direction border border-secondary" type='text' placeholder="أريد ارسال طلبي الى هذا العنوان" onChange={ e => this.setState({howGet: e.target.value}) }  /> </label></div>
              <div className="d-flex  txt-direction align-items-center "><input type='radio' className="mx-1" id="opt10" name="n5" value="سأكون في مطعمكم في أقل من نصف ساعة" onChange={ e => this.setState({howGet: e.target.value}) }  /> <label htmlFor="opt10">سأكون في مطعمكم في أقل من نصف ساعة</label></div>
              <div className="d-flex  txt-direction align-items-center "><input type='radio' className="mx-1" id="opt11" name="n5" value="سأكون في مطعمكم بعد أكثر من نصف ساعة" onChange={ e => this.setState({howGet: e.target.value}) }  /> <label htmlFor="opt11">سأكون في مطعمكم بعد أكثر من نصف ساعة</label></div>
              </div>
            </div>
            <div className="col-12 row  d-flex justify-content-between align-items-center mt-3 the_phone_sec">
              <p className="txt-direction col-sm-8">يرجى إدخال رقم الهاتف للإستضهار به عند الحصول على طلبك</p>
              <input  className="txt-direction col-sm-4 phone_field" type="tel" placeholder="رقم الهاتف اجباري" required onChange={ e => this.setState({phoneNumb: e.target.value}) }  />
            </div>
            <div className="col-12  txt-direction row align-items-center mt-4">
              <div className="col-6">
                <span className="">الثمن: </span>
                <span className="">{this.state.options.length ? this.state.totPrice * this.state.howMany : this.state.priceFromDB } ملّيم</span>
              </div>
              <div className="col-6  d-flex justify-content-evenly">
                <button className="btn btn-success" onClick={() => this.incAndSaveOrder() }>موافق</button>
                <button className="btn btn-danger" onClick={() =>{ this.dismissOrder() }}>إلغاء</button>
              </div>
            </div>
          </div>
        </form>
        }
        </section>
      </div>
    );
  }
}

export default NMenu;