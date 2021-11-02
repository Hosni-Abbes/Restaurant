import React from 'react';
import NMenu from '../Menu/NMenu'

function Home(props) {
    return (
      <div className="home__container">
        <div className="">
          <section className="welcome__section text-center position-relative">
            <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-dark opacity-50"></div>
            <div className="d-flex flex-column order__msg position-absolute top-50 start-50 translate-middle text-white">
              <p className="fs-2">مرحبا بك، هل أنت جائع؟</p>
              <h1 className="mb-3 fs-1">ماذا تنتظر؟</h1>
              <div><a href="#meals" className="order__btn fs-3">أطلب أكل</a></div>
            </div>
          </section>
        </div>
        <NMenu allMealsFromDB={props.allMealsFromDB} clickedOrderFunc={props.clickedOrderFunc} clickedOrder={props.clickedOrder} numbOfOrders={props.numbOfOrders}
                                          increseOrders={props.increseOrders} confirmOrder={props.confirmOrder}  />
      </div>
    );
}

export default Home; 