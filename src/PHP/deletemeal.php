<?php

  include_once './dbconnect.php';

  //set headers
  header('Access-Control-Allow-Origin: * ');
  header('Access-Control-Allow-Methods: * ');
  header('Access-Control-Allow-Headers: * ');


  //GET THE DATA SENDED FROM JS BY HTTP REQUEST
  $meal_id = filter_var($_POST['meal-id'], FILTER_SANITIZE_NUMBER_INT);
  
    //REMOVE MEAL FROM DB
    $sql = " DELETE FROM `meals` WHERE `meals`.`meal_id` = $meal_id ";
    $conn->exec($sql);
    echo 'Meal deleted';
    


?>
