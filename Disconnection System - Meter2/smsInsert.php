<?php
include 'connection.php';

$contacts = json_decode($_POST['contacts'], true);

// Get current date
$current_date = date("Y-m-d");

$stmt = $conn->prepare("INSERT INTO tbl_history (acc_num, customer_name, address, meter_num, unpaid_bills, months_arrears, message_type, message, contact_num, sent_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssssss", $acc_num, $customer_name, $address, $meter_num, $unpaid_bills, $months_arrears, $message_type, $message, $contact_num, $current_date);

foreach ($contacts as $contact) {
    $acc_num = $contact['Account Number'];
    $customer_name = $contact['Name of Customer'];
    $address = $contact['Address'];
    $meter_num = $contact['Meter Number'];
    $unpaid_bills = $contact['Unpaid Bills'];
    $months_arrears = $contact['Months in Arrears'];
    $message_type = $contact['Message Type'];
    $message = $contact['Message Content'];
    $contact_num = $contact['Contact Number'];

    $stmt->execute();
}

$stmt->close();
$conn->close();

echo "Data inserted into database successfully.";
?>
