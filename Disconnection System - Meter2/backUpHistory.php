<?php
include 'connection.php'; 

$sql = "SELECT acc_num, customer_name, address, meter_num, unpaid_bills, months_arrears, message_type, message, contact_num, sent_date FROM tbl_history";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data); 
} else {
    echo "No records found";
}

$conn->close();
?>
