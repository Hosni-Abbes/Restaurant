<?php

  include_once './dbconnect.php';

  //set headers
  header('Access-Control-Allow-Origin: * ');
  header('Access-Control-Allow-Methods: * ');
  header('Access-Control-Allow-Headers: * ');


  //GET THE DATA SENDED FROM JS BY HTTP REQUEST
  $order_id = filter_var($_POST['order-id'], FILTER_SANITIZE_NUMBER_INT);
  
    //REMOVEORDER FROM DB
    $sql = " UPDATE `orders` SET `is_finished` = 'finished' WHERE `orders`.`meal_id` = $order_id ";
    $conn->exec($sql);
    echo 'order finished';
    


?>
