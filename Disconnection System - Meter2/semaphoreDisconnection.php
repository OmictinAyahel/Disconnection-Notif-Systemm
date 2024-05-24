<?php

$messagesArr = json_decode($_POST['message'], true);

// Semaphore API Integration
$parametersArr = array();
foreach ($messagesArr as $message) {
    $parameters = array(
        'apikey' => 'e6e948aa1353b7243f59bfecc28b42ff',
        'number' => $message['contactNumber'],
        'message' => $message['message'],
        'sendername' => 'CABWAD'
    );
    $parametersArr[] = $parameters;
}

$responses = array();
foreach ($parametersArr as $parameters) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://semaphore.co/api/v4/messages');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($parameters));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $output = curl_exec($ch);
    curl_close($ch);

    $responses[] = $output;
}

echo json_encode($responses);

?>
