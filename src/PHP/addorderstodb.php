<?php

  include_once './dbconnect.php';

  //set headers
  header('Access-Control-Allow-Origin: * ');
  header('Access-Control-Allow-Methods: * ');
  header('Access-Control-Allow-Headers: * ');


  //GET THE DATA SENDED FROM JS BY HTTP REQUEST
  $orders_array = $_POST['ordersArray'];
  
  //USE JSON_DECODE TO DECODE THE JSON STRING SENDED FROM JS BY HTTP REQUEST
  $all_orders = json_decode($orders_array);

  //ADD UNIQUE ID FOR EACH ORDER
  $unique_id = time() . rand(1, 100000);

  //LOOP ON EACH MEAL ADDED BY THE CLIENT
  for($i=0;$i< count($all_orders); $i++){
    //CONVERT OPTIONS ARRAY TO STRING TO ADD IT TO DB
    $options = join(',', $all_orders[$i]->options);
    //ADD DATA TO DB
    $sql = " INSERT INTO `orders`(`meal_id`, `meal_unique_id`, `meal_name`, `meal_options`, `meal_is_hot`, `meal_how_get`, `meal_how_many`, `meal_price`, `meal_phone`)
              VALUES('', '{$unique_id}', '{$all_orders[$i]->name}', '{$options}', '{$all_orders[$i]->hot}', '{$all_orders[$i]->howGet}', '{$all_orders[$i]->howMany}', '{$all_orders[$i]->totPrice }', '{$all_orders[$i]->phoneNumb}')  ";
    $conn->exec($sql);
    
  }
// echo "order added";

?>
