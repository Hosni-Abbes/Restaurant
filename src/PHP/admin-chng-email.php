<?php

  include_once './dbconnect.php';

  //set headers
  header('Access-Control-Allow-Origin: * ');
  header('Access-Control-Allow-Methods: * ');
  header('Access-Control-Allow-Headers: * ');


  $current_email = filter_var($_POST['current-email'], FILTER_SANITIZE_EMAIL);
  $current_pass = filter_var($_POST['current-pass'], FILTER_SANITIZE_STRING);
  $new_email = filter_var($_POST['new-email'], FILTER_SANITIZE_EMAIL);

  //CHECK IF FIELDS NOT EMPTY
  if(isset($current_email) && !empty($current_email) && isset($current_pass) && !empty($current_pass) && isset($new_email) && !empty($new_email) ){
    //CHECK IF EMAIL IS VALID
    if(filter_var($current_email, FILTER_VALIDATE_EMAIL) && filter_var($new_email, FILTER_VALIDATE_EMAIL)){
      //CHECK IF EMAIL AND PASSWORD ARE MATCHED
        //make query to get admin data from db
        $sql = $conn->query("SELECT * FROM admin");
        $rows = $sql->fetchAll();
        foreach($rows as $row){
          $adminEmail = $row[1];
          $adminPass = $row[2];
        }
        //check if email and password are matched
        if( $current_email === $adminEmail && password_verify($current_pass, $adminPass) ){
          //make query to update email
          if($sql2 = $conn->query("UPDATE admin SET admin_email = '{$new_email}' WHERE admin_email = '{$adminEmail}' ")){
            echo 'Email changed successfully';
          }else{
            echo 'Something went wrong, try again later';
          }
        }else{  //email or password are not matched
          echo 'Incorrect email or password!';
        }
    }else{
      echo 'Please enter a valid email!';
    }
  }else{
    echo 'Please fill out all fields!';
  }
  
  
  ?>
