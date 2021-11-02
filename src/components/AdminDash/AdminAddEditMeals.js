import React from 'react';
import axios from 'axios';

class AdminAddEditMeals extends React.Component {
  constructor(props){
    super(props)
    this.state={
      fetchedMeals: [],
      meal_id: '',
      meal_name:'',
      meal_options:[],
      option_price:'',
      meal_options_price:[],
      meal_price:'',
      meal_img:[],
      new_meal_name:'',
      new_meal_price:'',
      new_meal_img:[],
      resp_msg:'',
      isEditing: false,
      isEditLoading:false
    }
    this.addMealsToDB = this.addMealsToDB.bind(this)
    this.checkingOptions = this.checkingOptions.bind(this)
    this.checkingOptionsPrice = this.checkingOptionsPrice.bind(this)
    this.fetchEditMeals = this.fetchEditMeals.bind(this)
    this.deleteMeal = this.deleteMeal.bind(this)
    this.updateMeal = this.updateMeal.bind(this)
  }

  // FUNCTION TO ADD NEW MEALS
  addMealsToDB = (e) => {
    e.preventDefault()
    //MAKE FORM TO SEND DATA
    const mealForm = new FormData()
    mealForm.append('meal-name', this.state.meal_name)
    mealForm.append('meal-options', this.state.meal_options.join(','))
    mealForm.append('meal-options-price', this.state.meal_options_price.join(','))
    mealForm.append('meal-price', this.state.meal_price)
    mealForm.append('meal-img', this.state.meal_img[0])
    //MAKE HHTTP REQUEST TO SEND FORM TO DB
    if(this.state.meal_img.length){
      axios.post('http://localhost/bobos/addmealstodb.php', mealForm)
      .then(response => {
        this.setState({resp_msg: response.data})
        //IF FORM SUBMITTED EMPTY ALL FIELDS
        if(this.state.resp_msg === 'Meal added'){
          this.props.loading()
          this.setState({meal_id:'', meal_name:'', meal_options:[], meal_options_price:[], meal_price:'', meal_img:[]})
        }
      } )
      .catch(error => console.log(error))
    }else{this.setState({resp_msg: 'الرجاء إضافة صورة الوجبة!'})}
  }

  //FUNCTION TO ADD OPTIONS TO MEAL
  checkingOptions = async (e) => {
    const mealOptions = this.state.meal_options
    const mealOptionsPrice = this.state.meal_options_price
    await e.target.classList.toggle('checked')
    if(e.target.classList.contains('checked')){
      this.setState({ meal_options: mealOptions.concat([e.target.value]) })
    }else{
      mealOptions.splice(mealOptions.indexOf(e.target.value), 1)
      mealOptionsPrice.splice(mealOptionsPrice.indexOf(e.target.value), 1)
      this.setState({ meal_options: mealOptions, meal_options_price:mealOptionsPrice  })
    }
  }

  //FUNCTION TO ADD OPTIONS PRICE TO MEAL
  checkingOptionsPrice = async (option, e) => { 
      if(this.state.option_price !== ''){
        await this.setState({meal_options_price: this.state.meal_options_price.concat([`${option}-${this.state.option_price}`])}) 
      }
    this.setState({option_price:''})
    e.target.parentElement.parentElement.classList.add('d-none')
  }

  //FUNCTION TO GET ALL MEALS TO EDIT OR DELETE
  fetchEditMeals = () => {
    this.axiosCancelSource = axios.CancelToken.source()
    const interval = setInterval(()=>{
      axios('http://localhost/bobos/get-allmeals.php', {cancelToken: this.axiosCancelSource.token})
      .then(response => this.setState({fetchedMeals: response.data}))
      .catch(error => console.log(error))
    },2000)
    return () => clearInterval(interval)
  }

  //FUNCTION TO DELETE MEAL FROM DB WHEN CLICK ON DELETE
  deleteMeal = (id) => {
    const formData = new FormData()
    formData.append('meal-id', id)
    axios.post('http://localhost/bobos/deletemeal.php', formData)
    .then(response => {
      if(response.data === 'Meal deleted'){
        this.setState({isEditLoading:true})
        setTimeout(()=>this.setState({isEditLoading:false}),2000)
      }
    })
    .catch(error => console.log(error))
  }

  //FUNCTION TO UPDATE MEAL AND SEND NEW DATA TO DB
  updateMeal = (e) => {
    e.preventDefault()
    const updatedMealData = new FormData()
    updatedMealData.append('meal-id', this.state.meal_id)
    updatedMealData.append('new-meal-name', this.state.new_meal_name)
    updatedMealData.append('new-meal-price', this.state.new_meal_price)
    updatedMealData.append('new-meal-img', this.state.new_meal_img[0])

    axios.post('http://localhost/bobos/updatemeals.php', updatedMealData)
    .then(response => {
      this.setState({resp_msg: response.data})
    })
    .catch(error => console.log(error))
    this.setState({new_meal_name:'', new_meal_price:'', new_meal_img:[]})
  }

  componentDidMount = () => {
    this.fetchEditMeals()
  }
  
  componentDidUpdate = (prevProp, prevState) => {
    if(prevProp.clickedOption !== this.props.clickedOption){
      this.setState({
        meal_id:'', meal_name:'', meal_price:'', meal_img:[], new_meal_name:'', new_meal_price:'', new_meal_img:[], resp_msg:''
      })
    }
  }

  render(){
    return (
      <React.Fragment>
        <div className={this.props.isLoading || this.state.isEditLoading ? 'd-flex justify-content-center z-index_11 position-absolute pt-5 start-50 translate-middle' : 'd-none'}>
          <div className="spinner-grow text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          <div className="spinner-grow text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
          <div className="spinner-grow text-success" role="status"><span className="visually-hidden">Loading...</span></div>
          <div className="spinner-grow text-danger" role="status"><span className="visually-hidden">Loading...</span> </div>
        </div> 
        {this.props.clickedOption === 'add_meals' ?
        <form className={this.props.isLoading ? 'd-none' : "dash__form m-auto d-flex flex-column w-75 mt-3"} onSubmit={e => this.addMealsToDB(e)} >
          <h2 className="text-center mb-3">أضف وجبة جديدة</h2>
          <p dir="rtl" lang="ar" className="text-end text-success m-0 p-0 fw-bold pb-2">{this.state.resp_msg}</p>
          <input type="text" dir="rtl" lang="ar" placeholder="إسم الوجبة .." value={this.state.meal_name} onChange={e => this.setState({meal_name : e.target.value})} />
          <div className='d-flex justify-content-between align-items-center f-direction'>
            <p className="m-0"><strong>الإختيارات</strong></p>
            <div className="d-flex f-direction align-items-center"><input className="m-0 option_box" type="checkbox" id='thon' value='تن'         onChange={e => this.checkingOptions(e) } /> <label htmlFor='thon'>تن</label> </div>
            <div className="d-flex f-direction align-items-center"><input className="m-0 option_box" type="checkbox" id='omlette' value='اوملات'   onChange={e => this.checkingOptions(e) } /> <label htmlFor='omlette'>اوملات</label> </div>
            <div className="d-flex f-direction align-items-center"><input className="m-0 option_box" type="checkbox" id='salami' value='صلامي'     onChange={e => this.checkingOptions(e) } /> <label htmlFor='salami'>صلامي</label> </div>
            <div className="d-flex f-direction align-items-center"><input className="m-0 option_box" type="checkbox" id='jben' value='جبن'        onChange={e => this.checkingOptions(e) } /> <label htmlFor='jben'>جبن</label> </div>
            <div className="d-flex f-direction align-items-center"><input className="m-0 option_box" type="checkbox" id='scalope' value='اسكالوب' onChange={e => this.checkingOptions(e) } /> <label htmlFor='scalope'>اسكالوب</label> </div>
            <div className="d-flex f-direction align-items-center"><input className="m-0 option_box" type="checkbox" id='chawrma' value='شاورمة'  onChange={e => this.checkingOptions(e) } /> <label htmlFor='chawrma'>شاورمة</label> </div>
          </div>
          <div className="d-flex mt-3 align-items-center f-direction"><strong className="w-50 text-end">الثمن الرئيسي</strong>
            <input className="m-0 w-50" type="number" min="1" dir="rtl" lang="ar" placeholder="مثال: 2300" value={this.state.meal_price} onChange={e => this.setState({meal_price : e.target.value})} />
          </div>
          {/* Show the options prices in line */}
          <div className={this.state.meal_options_price.length ? "mt-3 text-end border p-2 rounded text-secondary" : "d-none"}>{this.state.meal_options_price.join(' | ')}</div>
          {/* Show the option's price editing divs */}
          <div className={this.state.meal_options.length ? " mt-3" : "d-none" }> 
            {
              this.state.meal_options.length ? this.state.meal_options.map((option,index) => {
                return <div key={index} className="d-flex align-items-center justify-content-between mb-1" dir="rtl" lang="ar ">
                  <span className="w-50 text-end">أضف ثمن <strong>{option}</strong></span>
                  <div className="w-50 text-end">
                    <input type='number' className="m-0" min="1" placeholder="مثال: 500" onChange={ e => this.setState({option_price: e.target.value}) } />
                    <button type="button" className="opt_price mx-2 btn-success" onClick={(e) => this.checkingOptionsPrice(option, e)} >تأكيد</button>
                  </div>
                </div> 
              }) : null
            }
          </div>

          <div className="d-flex my-3 align-items-center f-direction"><strong className="w-50 text-end">الصورة</strong> <div><input className="d-none" id='img-file' type="file" accept='image/*' onChange={e => this.setState({meal_img : e.target.files})} /> 
          <span className={this.state.meal_img.length && this.state.meal_img !== undefined  ? "ms-3 text-secondary fs-5 border p-1 rounded w-50" : "d-none" }>{this.state.meal_img.length && this.state.meal_img !== undefined ? this.state.meal_img[0].name : ''}</span>
          <label className="mx-3 fs-4" htmlFor="img-file"><i className="uil uil-image-upload"></i></label> </div> </div>
          <button type="submit">أضف</button>
          <div className={this.state.resp_msg === 'Meal added'? 'msg_meal_added' : 'd-none'}>
            تم إضافة الوجبة بنجاح.
            <button type="button" className="position-absolute top-0 end-0 btn-close" onClick={ () =>{ this.setState({resp_msg:''}) }}></button>
          </div>
        </form>
        :
        <div>
          <div className={this.props.isLoading ? 'd-none' : "d-flex f-direction justify-content-between align-items-center border-bottom mb-1 py-2 txt-direction row"}>
              <div className="col-2"><strong>اسم الوجبة</strong></div>
              <div className="col-2"><strong>سعر الوجبة</strong></div>
              <div className="col-2"><strong>الصورة</strong></div>
              <div className="col-2"><strong>تعديل</strong></div>
              <div className="col-2"><strong>حذف الوجبة</strong></div>
          </div>
        {
          this.state.fetchedMeals.length ? this.state.fetchedMeals.map(meal => {
            return <div key={meal.meal_id} className={this.props.isLoading ? 'd-none' : "d-flex f-direction justify-content-between align-items-center border-bottom mb-1 py-2 txt-direction row"}>
                      <div className="col-2"><span>{meal.meal_name}</span></div>
                      <div className="col-2"><span>{meal.meal_price}</span></div>
                      <div className="col-2"><img src={`http://localhost/bobos/uploaded-images/${meal.meal_img}`} alt={meal.meal_name} className="dash_edit_imgs" /></div>
                      <div className="col-2"><button type="button" className="btn btn-warning text-start" onClick={ ()=>{ this.setState({isEditing: true, meal_id:meal.meal_id, meal_name:meal.meal_name, meal_price:meal.meal_price, meal_img:meal.meal_img}) } }>تعديل</button></div>
                      <div className="col-2"><button type="button" className="btn btn-danger text-start" onClick={ ()=>{this.deleteMeal(meal.meal_id)} }>حذف</button></div>
                  </div>
          })
          :
          <div className={this.props.isLoading ? 'd-none' : "d-flex justify-content-center fs-3 pt-3"}>لم يتم تسجيل اي وجبات!</div>
        }
        {/* FORM WILL RENDER WHEN CLICK EDIT MEAL */}
        <form className={this.state.isEditing ? "d-flex flex-column justify-content-between align-items-center w-75 m-auto position-fixed top-50 start-50 translate-middle bg-white rounded p-3 z-index_11" : "d-none"}
                onSubmit={e =>{ this.updateMeal(e) } }>
          <p>تريد تعديل <strong>{this.state.meal_name}</strong> ؟</p>
          {/* show the message (succes or fail) */}
          <p className={this.state.resp_msg !=='' ? (this.state.resp_msg === 'لم تقم بإضافة أي تعديل' || this.state.resp_msg === 'الرجاء التحقق من السعر' || this.state.resp_msg === 'يجب أن يكون امتداد الصورة (jpg, jpeg, png)') ? 'd-flex text-danger txt-direction fw-bold' : 'd-flex text-success txt-direction fw-bold' : 'd-none'}>{this.state.resp_msg }</p>
          {/* btn close */}
          <button type="button" className="position-absolute top-0 end-0 btn-close" onClick={ () =>{ this.setState({isEditing:false, meal_id:'', new_meal_name:'', new_meal_price:'', new_meal_img:[], resp_msg:'', }) }}></button>
          <div className="d-flex justify-content-between align-items-center f-direction w-100 mb-2 txt-direction border-bottom-secondary row"> 
            <strong className="col-3">تعديل الاسم</strong>
            <span className="col-3">{this.state.meal_name}</span>
            <i className="uil uil-exchange col-3"></i>
            <input className="col-3 p-1 txt-direction" type="text" placeholder="الاسم الجديد" value={this.state.new_meal_name} onChange={ e => this.setState({new_meal_name: e.target.value}) } /> 
          </div>
          <div className="d-flex justify-content-between align-items-center f-direction w-100 mb-2 txt-direction border-bottom-secondary row"> 
            <strong className="col-3">تعديل السعر</strong>
            <span className="col-3">{this.state.meal_price}</span>
            <i className="uil uil-exchange col-3"></i>
            <input className="col-3 p-1 txt-direction" type="number" min="1" placeholder="السعر الجديد" value={this.state.new_meal_price} onChange={ e => this.setState({new_meal_price: e.target.value}) }  />
          </div>
          <div className="d-flex justify-content-between align-items-center f-direction w-100 mb-2 txt-direction border-bottom-secondary row"> 
            <strong className="col-3">تعديل الصورة</strong>
            <div className="col-3"><img className="dash_edit_imgs" src={`http://localhost/bobos/uploaded-images/${this.state.meal_img}`} alt={this.state.meal_name} /></div>
            <i className="uil uil-exchange col-3"></i>
            <input className="d-none" id="chng_file" type="file" accept='image/*' onChange={ e => this.setState({new_meal_img: e.target.files}) }/> <label className="col-3 border p-1 txt-direction text-secondary text-break" htmlFor="chng_file">{this.state.new_meal_img.length ? this.state.new_meal_img[0].name : <span>صورة جديدة </span>} <i className="uil uil-image-upload"></i></label>
          </div>
          <div className="d-flex justify-content-evenly align-items-center f-direction w-100 mt-4">
            <button type="submit" className="btn btn-success">موافق</button>
            <button type="button" className="btn btn-danger" onClick={()=>this.setState({isEditing:false, meal_id:'', new_meal_name:'', new_meal_price:'', new_meal_img:[], resp_msg:''}) }>إلغاء</button>
          </div>
        </form>

        {/* OVERLAY */}
        <div className={this.state.isEditing ? "d-block overlay" : "d-none"} onClick={()=>this.setState({isEditing:false, meal_id:'', new_meal_name:'', new_meal_price:'', new_meal_img:[], resp_msg:''}) }></div>

        </div>
        }
      </React.Fragment>
    );
  }
}

export default AdminAddEditMeals;