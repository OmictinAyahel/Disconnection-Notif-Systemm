<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notification System</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <!-- DataTables CSS -->
    <link href="https://cdn.datatables.net/1.10.25/css/jquery.dataTables.min.css" rel="stylesheet">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <link rel="stylesheet" href="css/mainstyle.css">

    
    <!-- Bootstrap JS and dependencies -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <!-- DataTables JS -->
    <script src="https://cdn.datatables.net/1.10.25/js/jquery.dataTables.min.js"></script>
    <!-- SheetJS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.0/xlsx.full.min.js"></script>
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"></script>

    <!-- Custom JavaScript -->
    <script src="js/mains.js"></script>
    <script src="js/style.js"></script>
</head>

<body style="overflow: auto;">

    <div class="jumbotron text-center">
        <div class="row">
            <div class="col-lg-1">
                <img src="assets/image/cabwad-logo.png" class="logo">
            </div>
            <div class="col-lg-10">      
                    <h1 class="display-4">Disconnection Notification System </h1>
                    <p class="lead mr-5">Receive instant alerts directly to your phone!</p>
                    
                    
            </div>
            <div class="col-lg-1 p-0 mt-5">
                <!-- <img src="assets/image/cabwad-logo.png" class="logo"> -->
                <br><br><br>
                <button id="historyButton" class="btn btn-primary" style="float: right;">View History</button>
            </div>
        </div>
    </div>

    <div class="container-fluid upload-container">

        <div class="row upload-section">
            <div class="col-md-6 text-center">
                <div class="card upload-card ml-5">
                    <div class="card-body">
                        <p class="card-text">Upload your Excel file to view customer information:</p>
                        <a href="#" id="uploadLinkTop" class="btn btn-primary">Upload Excel File</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" id="dataTableSection" style="display: none;">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="table-top-left">
                            <a href="#" id="uploadLink" class="btn btn-primary">Upload Excel File</a>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <button id="sendSingleSMSBtn" class="btn btn-primary float-right" style="display: none;">Send
                            SMS
                        </button>
                        <button id="sendMultipleSMSBtn" class="btn btn-primary float-right" style="display: none;">Send
                            SMS to All
                        </button>
                    </div>
                </div>
                <table id="userTable" class="display" style="width:100%; height:50px !important;">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="selectAllCheckbox"></th>
                            <th>Account Number</th>
                            <th>Name of Customer</th>
                            <th>Address</th>
                            <th>Meter Number</th>
                            <th>Unpaid Bills</th>
                            <th>Months In Arrears</th>
                            <th>Contact Number</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        <div class="row mt-4" id="historySection" style="display: none;">
            <div class="col-md-12">
                <div class="table-top-left">
                    <a href="#" id="exportBtn" class="btn btn-primary">Export</a>
                </div>
                <table id="historyTable" class="display" style="width:100%">
                    <thead>
                        <tr>
                            <th>Account Number</th>
                            <th>Name of Customer</th>
                            <th>Address</th>
                            <th>Meter Number</th>
                            <th>Unpaid Bills</th>
                            <th>Months In Arrears</th>
                            <th>Message Type</th>
                            <th>Message Content</th>
                            <th>Contact Number</th>
                            <th>Sent Date</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        <!-- Upload Modal -->
        <div class="modal upload-container-modal" id="fileUploadModal" tabindex="-1" role="dialog"
            aria-labelledby="fileUploadModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close close-upload" aria-label="Close">
                            <span aria-hidden="true">&#8592;</span>
                        </button>
                        <h5 class="modal-title" id="fileUploadModalLabel">Upload Excel File</h5>
                    </div>
                    <div class="modal-body">
                        <input type="file" id="fileInput" class="form-control-file" accept=".xlsx, .xls">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Message Type Modal -->
    <div class="modal fade" id="messageTypeModal" tabindex="-1" role="dialog" aria-labelledby="messageTypeModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="messageTypeModalLabel">Select Message Type</h5>
                </div>
                <div class="modal-body">
                    <p>Select the type of message:</p>
                    <select class="form-control" id="smsOption">
                        <option value=""></option>
                        <option value="reminder">Reminder</option>
                        <option value="notice">Notice</option>
                        <option value="announcement">Announcement</option>
                        <option value="disconnection">Disconnection</option>
                        <option value="newMeter">Overdue Meter</option>
                    </select>
                    <br>

                    <div id="messageOptions" style="display: none;">
                        <button class="btn btn-primary" id="edit">Edit</button>
                        <div class="col-md-12" id="dateContainer" style="display: none;">
                            <h3 style="font-size: 18px;">Select the dates</h3>
                            <hr>
                            <div class="row">
                                <div class="col-md-6">
                                    <label for="dueDateInput">Due Date:</label>
                                    <input type="date" class="form-control" id="dueDateInput"
                                        style="margin-top: 10px;">
                                </div>
                                <div class="col-md-6">
                                    <label for="disconnectionDateInput">Disconnection Date:</label>
                                    <input type="date" class="form-control" id="disconnectionDateInput"
                                        style=" margin-top: 10px;">
                                </div>
                                <button class="btn btn-success" style="font-size: 12px; height: 30px; margin: 10px;"
                                    id="showMessage">Show message</button>
                            </div>
                        </div>
                        <br>
                        <textarea class="form-control" id="customMessage" disabled></textarea>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
                    <button type="button" class="btn btn-primary" id="confirmType">Confirm</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="disconnectionMessageContainer" tabindex="-1" role="dialog"
        aria-labelledby="disconnectionMessageLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="disconnectionMessageLabel">Messages:</h5>
                </div>
                <div class="modal-body disconnection-body">
                    <textarea class="form-control disconnection-message" id="disconnectionMessage" disabled></textarea>
                </div>
            </div>
        </div>
    </div>

    <!-- Add SMS Confirmation Modal -->
    <div class="modal fade" id="smsConfirmationModal" tabindex="-1" role="dialog"
        aria-labelledby="smsConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="smsConfirmationModalLabel">Confirm SMS Details</h5>
                </div>
                <div class="modal-body confirmation-body" style="max-height: 400px; overflow-y: auto;">
                    <div id="confirmationTable"></div>
                    <p id="messageInput"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary go-back">Go Back</button>
                    <button type="button" class="btn btn-primary send-button" id="sendSMSButton">Send</button>
                </div>
            </div>
        </div>
    </div>
    
    <footer class="jumbotron">
        <p style="text-align: center; color: #fff; margin-top:5px;">&copy; 2024 Notification System. All rights reserved.</p>
    </footer>

</body>

</html>
