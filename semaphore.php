<?php
$parameters = array(
    'apikey' => 'e6e948aa1353b7243f59bfecc28b42ff', 
    'number' => $_POST['numbers'],
    'message' => $_POST['message'],
    'sendername' => 'CABWAD'
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://semaphore.co/api/v4/messages');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($parameters));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$output = curl_exec($ch);
curl_close($ch);

echo $output;

?>
