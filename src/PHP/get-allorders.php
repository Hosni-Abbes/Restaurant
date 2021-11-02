<?php

  include_once './dbconnect.php';

  //set headers
  header('Access-Control-Allow-Origin: * ');
  header('Access-Control-Allow-Methods: * ');
  header('Access-Control-Allow-Headers: * ');


  //ARRAY WILL CONTAIN ALL DATA
  $arr_of_data = [];
  //MAKE QUERY TO FETCH ALL MEALS DATA FROM DB
  $sql = $conn->query(" SELECT * FROM `orders` WHERE `orders`.`is_finished` != 'finished' ORDER BY meal_id DESC ");
  $rows = $sql->fetchAll();
  foreach($rows as $row){
    array_push($arr_of_data, $row);
  }
  //USE JSON_ENCODE TO MAKE DATA IN JSON FORMAT / ADD JSON_UNESCAPED_UNICODE AS SECOND ARGUMENT BECAUSE WE NEED TO RETRIEVE ARABIC DATA
  echo json_encode($arr_of_data, JSON_UNESCAPED_UNICODE);

?>
