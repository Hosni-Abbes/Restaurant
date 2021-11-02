<?php

  include_once './dbconnect.php';

  //set headers
  header('Access-Control-Allow-Origin: * ');
  header('Access-Control-Allow-Methods: * ');
  header('Access-Control-Allow-Headers: * ');


  $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
  $password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);

  //CHECK IF FIELDS NOT EMPTY
  if(isset($email) && !empty($email) && isset($password) && !empty($password)){
    //CHECK IF EMAIL IS VALID
    if(filter_var($email, FILTER_VALIDATE_EMAIL)){
      //CHECK IF EMAIL AND PASSWORD ARE MATCHED
        //make query to get admin data from db
        $sql = $conn->query("SELECT * FROM admin");
        $rows = $sql->fetchAll();
        foreach($rows as $row){
          $adminEmail = $row[1];
          $adminPass = $row[2];
        }
        //check if email and password are matched
        if( $email === $adminEmail && password_verify($password, $adminPass) ){
          echo 'Login success';
        }else{
          echo 'Incorrect email or password!';
        }
    }else{
      echo 'Email is not valid!';
    }
  }else{
    echo 'Please enter your email and password to login!';
  }
  
  
  ?>
