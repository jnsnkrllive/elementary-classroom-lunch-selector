<?php

//Settings
$admin_email = "classroom@karcor.com";  // Admin Email
$errors = "";  // Error String

//Retrieve Data from Form
$from_email = $_POST['teacherEmail'];  // Teacher Email
$to_email = $_POST["recipientEmail"];  //Recipient Email
$post_message = $_POST["message"];  // Message

//Validate - Check for Empty Fields
if (empty($from_email)) {
  $errors .= "Teacher Email is not defined.<br />";
}
if (empty($to_email)) {
  $errors .= "Lunchroom Email is not defined.<br />";
}

//Validate - Check Email Address
if ( !filter_var($from_email, FILTER_VALIDATE_EMAIL) ) {
  $errors .= "Invalid Teacher Email Address.";
}
if ( !filter_var($to_email, FILTER_VALIDATE_EMAIL) ) {
  $errors .= "Invalid Lunchroom Email Address.";
}

//Process the File to be Uploaded
if (empty($errors)) {

  //Load PEAR Libraries needed for Mail
  include("Mail.php");
  include("Mail/mime.php");

  $from = $from_email;
  $reply = $from_email;
  $to = $to_email;
  $cc = $from_email;
  $bcc = $admin_email;
  $subject = "Lunch Choice";
  $message = $post_message;

  //Create Headers
  $hdrs = array(
                "From"     => $from,
                "Reply-To" => $reply,
                "To"       => $to,
                "Cc"       => $cc,
                "Bcc"      => $bcc,
                "Subject"  => $subject
                );

  //Create Email
  $mime = new Mail_mime();
  $mime->setTXTBody($message);

  //Send Email
  $body = $mime->get();
  $mail =& Mail::factory("mail");
  $mail -> send( $to, $hdrs, $body ); 

  //Conditional Redirect
  if ($mail) {
    $response_array['status'] = "success";
    header('Content-type: application/json');
    echo json_encode($response_array);
    exit;
  } else {
    $errors .= "Mail Failure.<br />";
  }




/*
  $to = $to_email;
  $subject = "Lunch Choice";
  $message = $post_message;
  $headers = '';
  $headers .= 'MIME-Version: 1.0' . '\n';
  $headers .= 'Content-type: text/html; charset=iso-8859-1' . '\n';
  $headers .= 'To: ' . $to_email . '\n';
  $headers .= 'Cc: ' . $from_email . '\n';
  $headers .= 'Bcc: ' . $admin_email . '\n';
  $headers .= 'From: ' . $from_email . '\n';
  $mailResult = mail($to, $subject, $message, $headers);
  //Conditional Redirect
  if ($mailResult) {
    $response_array['status'] = "success";
    header('Content-type: application/json');
    echo json_encode($response_array);
    exit;
  } else {
    $errors .= "Mail Failure.<br />";
  }
*/
}

$response_array['status'] = "error";
header('Content-type: application/json');
echo json_encode($response_array);
exit;

?>