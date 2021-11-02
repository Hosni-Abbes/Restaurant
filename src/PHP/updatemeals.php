<?php

  include_once './dbconnect.php';

  //set headers
  header('Access-Control-Allow-Origin: * ');
  header('Access-Control-Allow-Methods: * ');
  header('Access-Control-Allow-Headers: * ');


  //GET THE DATA SENDED FROM JS BY HTTP REQUEST
  $meal_id          = filter_var($_POST['meal-id'], FILTER_SANITIZE_NUMBER_INT);
  $new_meal_name    = filter_var($_POST['new-meal-name'], FILTER_SANITIZE_STRING);
  $new_meal_price   = filter_var($_POST['new-meal-price'], FILTER_SANITIZE_NUMBER_INT);
  if(isset($_FILES['new-meal-img'])){
  $new_meal_img     = $_FILES['new-meal-img'];
  }

  //IF ALL FIELDS R EMPTY
  if( empty($new_meal_price) && empty($new_meal_name) && empty($new_meal_img) ){
    echo 'لم تقم بإضافة أي تعديل' ;
  }

  //CHECK IF MEAL NAME NOT EMPTY
  if(!empty($new_meal_name)){
    //MAKE QUERY TO ADD DATA TO DB
    $sql1 = " UPDATE `meals` SET `meals`.`meal_name` = '{$new_meal_name}' WHERE `meals`.`meal_id` = $meal_id ";
    $conn->exec($sql1);
    echo 'تم تعديل اسم الوجبة بنجاح' ;
  }

  //CHECK ON PRICE (MUST NOT START WITH 0 AND MUST BE LESS THAN 5 NUMBERS)
  if(!empty($new_meal_price)){
    if(is_numeric($new_meal_price) && preg_match('/^[1-9]\d{0,4}$/', $new_meal_price) ){
      // $price = $new_meal_price
      $sql2 = " UPDATE `meals` SET `meals`.`meal_price` = '{$new_meal_price}' WHERE `meals`.`meal_id` = $meal_id ";
      $conn->exec($sql2);
      echo 'تم تعديل السعر بنجاح';
    }else{ echo 'الرجاء التحقق من السعر'; }
  }

  //CHECK IF IMG FIELD NOT EMPTY
  if(isset($new_meal_img) && !empty($new_meal_img) && $new_meal_img['name'] !== '' ){
    //CREATE A UNIQUE IMG NAME
    $img_new_name = time() . round(1, 100000000) . $new_meal_img['name'];
    //CHECK IF FILE EXTENSION IS MUTCHED WITH OUR ALLOWED EXTENSIONS
    $allowedExten = ['jpeg', 'jpg', 'png'];
    $uploaded_file_explode = explode('.', $new_meal_img['name']);
    $uploaded_file_exten = strtolower(end($uploaded_file_explode)); //the extension of uploaded file
    if(in_array($uploaded_file_exten, $allowedExten)){ //if the extension of uploaded file is matched with our allowed extensions
      //MOVE IMAGE TO UPLOADED FOLDER ON SERVER
      if(move_uploaded_file($new_meal_img['tmp_name'], './uploaded-images/' . $img_new_name)){
        //MAKE QUERY TO ADD DATA TO DB
        $sql3 = " UPDATE `meals` SET `meals`.`meal_img` = '{$img_new_name}' WHERE `meals`.`meal_id` = $meal_id ";
        $conn->exec($sql3);
        echo 'تم تعديل الصورة بنجاح' ;
      }
    }else{ echo 'يجب أن يكون امتداد الصورة (jpg, jpeg, png)'; }
  }


?>
