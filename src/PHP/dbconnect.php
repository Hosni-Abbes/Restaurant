<?php

    //MAKE DB CONNEXION
    $server   = 'localhost';
    $username = 'root';
    $password = '';
    $dbname   = 'bobos';
  
    try{
      $conn = new PDO("mysql:host=$server;dbname=$dbname", $username, $password);
      // set the PDO error mode to exception
      $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // echo 'Connect successfully';
    }catch(PDOException $e){
      echo 'Connexion Failed: ' . $e->getMessage();
    }

  
?>
