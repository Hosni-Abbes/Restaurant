<?php

  include_once './dbconnect.php';

  //set headers
  header('Access-Control-Allow-Origin: * ');
  header('Access-Control-Allow-Methods: * ');
  header('Access-Control-Allow-Headers: * ');


  //GET THE DATA SENDED FROM JS BY HTTP REQUEST
  $meal_name    = filter_var($_POST['meal-name'], FILTER_SANITIZE_STRING);
  $meal_price   = filter_var($_POST['meal-price'], FILTER_SANITIZE_NUMBER_INT);
  $meal_options = filter_var($_POST['meal-options'], FILTER_SANITIZE_STRING);
  $meal_options_price = filter_var($_POST['meal-options-price'], FILTER_SANITIZE_STRING);
  if(isset($_FILES['meal-img'])){
    $meal_img     = $_FILES['meal-img'];
  }


  //CHECK IF FILE FIELD IS EMPTY OR OTHER FIELDS ARE EMPTY
  if(isset($meal_img) && !empty($meal_img) && $meal_img['name'] !== '' ){
    //CHECK IF OTHER FIELDS
    if(!empty($meal_name) && !empty($meal_price) && !empty($meal_options) && !empty($meal_options_price)){
      //CHECK ON PRICE (MUST NOT START WITH 0 AND MUST BE LESS THAN 5 NUMBERS)
      if(is_numeric($meal_price) && preg_match('/^[1-9]\d{0,4}$/', $meal_price) ){
        //CREATE A UNIQUE IMG NAME
        $img_new_name = time() . round(1, 100000000) . $meal_img['name'];
        //CHECK IF FILE EXTENSION IS MUTCHED WITH OUR ALLOWED EXTENSIONS
        $allowedExten = ['jpeg', 'jpg', 'png'];
        $uploaded_file_explode = explode('.', $meal_img['name']);
        $uploaded_file_exten = strtolower(end($uploaded_file_explode)); //the extension of uploaded file
        if(in_array($uploaded_file_exten, $allowedExten)){ //if the extension of uploaded file is matched with our allowed extensions
          //MOVE IMAGE TO UPLOADED FOLDER ON SERVER
          if(move_uploaded_file($meal_img['tmp_name'], './uploaded-images/' . $img_new_name)){
            //MAKE QUERY TO ADD DATA TO DB
            $sql = " INSERT INTO `meals`(`meal_id`, `meal_name`, `meal_price`, `meal_options`, `meal_options_price`, `meal_img`)
                      VALUES('', '{$meal_name}', '{$meal_price}', '{$meal_options}', '{$meal_options_price}', '{$img_new_name}') ";
            $conn->exec($sql);

            echo 'Meal added';
          }

        }else{ echo 'يجب اختيار صورة بإمتداد (jpg, jpeg, png)!'; }
      }else{ echo 'الرجاء التثبّت من الثمن'; }
    }else{ echo 'الرجاء ملأ جميع الحقول!'; }
  }else{ echo 'الرجاء اختيار صورة امتداد (jpeg, jpg, png).'; }

?>
