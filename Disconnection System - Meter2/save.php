<?php
include('connection.php');

$messageType = $_POST['messageType'];
$customMessage = $_POST['customMessage'];

if ($messageType === 'disconnection' || $messageType === 'newMeter') {
    $sql = "INSERT INTO tbl_disconnection (messageContent) VALUES ('$customMessage')";
} else {
    $sql_check = "SELECT * FROM tbl_message WHERE messageType = '$messageType'";
    $result_check = $conn->query($sql_check);

    if ($result_check->num_rows > 0) {
        $sql = "UPDATE tbl_message SET messageContent = '$customMessage' WHERE messageType='$messageType'";
    } else {
        $sql = "INSERT INTO tbl_message (messageType, messageContent) VALUES ('$messageType', '$customMessage')";
    }
}

if ($conn->query($sql) === TRUE) {
    echo "Record saved successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>