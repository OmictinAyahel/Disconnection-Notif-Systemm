<?php
include('connection.php');

$messageType = $_POST['messageType'];

$sql = "SELECT messageType, messageContent FROM tbl_message WHERE messageType = '$messageType'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $messageType = $row['messageType'];
    $defaultMessage = $row['messageContent'];
    
    echo json_encode(array('messageType' => $messageType, 'defaultMessage' => $defaultMessage));
} else {
    echo json_encode(array('messageType' => 'not_found', 'defaultMessage' => ''));
}

$conn->close();
?>
