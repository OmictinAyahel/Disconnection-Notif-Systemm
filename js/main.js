$(document).ready(function() {
    $('#uploadLink').click(function(e) {
        e.preventDefault();
        $('#fileUploadModal').modal('show');
    });

    $('#uploadLinkTop').click(function(e) {
        e.preventDefault();
        $('#fileUploadModal').modal('show');
    });
    $('#fileInput').on('change', function(e) {
        var file = e.target.files[0];
        if (!file) return;
    
        // Display SweetAlert confirmation
        Swal.fire({
            title: 'Confirm Upload',
            text: 'Are you sure you want to upload this file?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, upload it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var data = new Uint8Array(e.target.result);
                    var workbook = XLSX.read(data, { type: 'array' });
                    var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    var jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    
                    var headers = jsonData.shift();
                    var formattedData = jsonData.map(function(row) {
                        var obj = {};
                        headers.forEach(function(header, i) {
                            var cellValue = row[i];
                            if (header === 'Unpaid Bills') {
                                // Ensure cellValue is a number
                                var numericValue = parseFloat(cellValue);
                                if (!isNaN(numericValue)) {
                                    // Format as currency
                                    obj[header] = numericValue.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
                                } else {
                                    obj[header] = cellValue;
                                }
                            } else {
                                obj[header] = cellValue;
                            }
                        });
                        return obj;
                    });
    
                    renderDataTable(formattedData);
    
                    $('#dataTableSection').show();
                    $('#fileUploadModal').modal('hide');
                };
                reader.readAsArrayBuffer(file);
            } else {
                // User canceled the upload
                // You can add any actions here if needed
            }
        });
    });
    
    // $('#fileInput').on('change', function(e) {
    //     var file = e.target.files[0];
    //     if (!file) return;
    //     var reader = new FileReader();
    //     reader.onload = function(e) {
    //         var data = new Uint8Array(e.target.result);
    //         var workbook = XLSX.read(data, { type: 'array' });
    //         var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    //         var jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    
    //         var headers = jsonData.shift();
    //         var formattedData = jsonData.map(function(row) {
    //             var obj = {};
    //             headers.forEach(function(header, i) {
    //                 var cellValue = row[i];
    //                 if (header === 'Unpaid Bills') {
    //                     // Ensure cellValue is a number
    //                     var numericValue = parseFloat(cellValue);
    //                     if (!isNaN(numericValue)) {
    //                         // Format as currency
    //                         obj[header] = numericValue.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
    //                     } else {
    //                         obj[header] = cellValue;
    //                     }
    //                 } else {
    //                     obj[header] = cellValue;
    //                 }
    //             });
    //             return obj;
    //         });
    
    //         renderDataTable(formattedData);
    
    //         $('#dataTableSection').show();
    //         $('#fileUploadModal').modal('hide');
    //     };
    //     reader.readAsArrayBuffer(file);
    // });
    
    function renderDataTable(data) {
        var headers = Object.keys(data[0]);
        var columns = headers.map(function(header) {
            return { title: header, data: header };
        });
    
        $('#userTable').DataTable({
            data: data,
            columns: columns,
            destroy: true  // To reinitialize the table if it already exists
        });
    }
    
    
    

    $('#selectAllCheckbox').change(function() {
        var isChecked = $(this).prop('checked');
        $('#userTable').find('tbody').find('input[type="checkbox"]').prop('checked', isChecked);
        if (isChecked) {
            $('#sendMultipleSMSBtn').show();
        } else {
            $('#sendMultipleSMSBtn').hide();
        }
    });

    $('#userTable').on('change', 'tbody input[type="checkbox"]', function() {
        var checkedCheckboxes = $('#userTable').find('tbody').find('input[type="checkbox"]:checked');
        var showSingleSMSButton = checkedCheckboxes.length === 1;
        var showMultipleSMSButton = checkedCheckboxes.length > 1; 
        showSendSMSButtons(showSingleSMSButton, showMultipleSMSButton);
    });

    var sendingType, sendingMessageType;

    $('#sendMultipleSMSBtn').click(function() {
        selectedContacts = [];
        $('#userTable').find('tbody').find('input[type="checkbox"]:checked').each(function() {
            var rowData = $(this).closest('tr').find('td'); 
            var unpaidBillsText = rowData.eq(5).text();

            var contact = {
                'Account Number': rowData.eq(1).text(), 
                'Name of Customer': rowData.eq(2).text(), 
                'Address': rowData.eq(3).text(), 
                'Meter Number': rowData.eq(4).text(),
                'Unpaid Bills': unpaidBillsText,
                'Months in Arrears': rowData.eq(6).text(),
                'Contact Number': rowData.eq(7).text()  
            };
            selectedContacts.push(contact);
        });

        sendingType = 'multiple';
        $('#messageTypeModal').modal('show');
    });
    
    $('#sendSingleSMSBtn').click(function() {
        selectedContacts = [];
        $('#userTable').find('tbody').find('input[type="checkbox"]:checked').each(function() {
            var rowData = $(this).closest('tr').find('td'); 
            var unpaidBillsText = rowData.eq(5).text();
  
            var contact = {
                'Account Number': rowData.eq(1).text(), 
                'Name of Customer': rowData.eq(2).text(), 
                'Address': rowData.eq(3).text(), 
                'Meter Number': rowData.eq(4).text(),
                'Unpaid Bills': unpaidBillsText,
                'Months in Arrears': rowData.eq(6).text(),
                'Contact Number': rowData.eq(7).text()  
            };
            selectedContacts.push(contact);
        });
    
        sendingType = 'single';
        
        $('#messageTypeModal').modal('show');
    });

    var defaultMessage, defaultDisconnectionMessage, selectedContacts, selectedOption;
    var disconnectionMessagesArr = [];

    document.getElementById('smsOption').addEventListener('change', function() {
        selectedOption = this.value;
        console.log(selectedOption);
        defaultMessage = "";
        $.ajax({
            url: 'get_default_message.php',
            type: 'POST',
            data: { messageType: selectedOption }, 
            success: function(response) {
                var responseData = JSON.parse(response);

                console.log(responseData);
                if (responseData.messageType === "not_found") {
                    displayMessageType(selectedOption);
                } else {
                    $('#customMessage').val(responseData.defaultMessage);
                    
                    document.getElementById('messageOptions').style.display = 'block';

                    if(selectedOption == 'reminder' || selectedOption == 'notice' || selectedOption == 'announcement') {
                        $('#disconnectionMessageContainer').modal('hide');
                        document.getElementById('edit').style.display = 'block';
                        document.getElementById('dateContainer').style.display = 'none';
                        document.getElementById('customMessage').style.display = 'block';
                    } else if(selectedOption == 'newMeter') {
                        document.getElementById('dateContainer').style.display = 'none';
                        document.getElementById('messageOptions').style.display = 'block';
                        document.getElementById('edit').style.display = 'none';
                        $('#disconnectionMessageContainer').modal('show');
                        document.getElementById('customMessage').style.display = 'none';
                        // if(sendingType === 'single') {
                        //     $('#disconnectionMessageContainer').modal('hide');
                        //     document.getElementById('customMessage').style.display = 'block';
                        // } else {                            
                        //     $('#disconnectionMessageContainer').modal('show');
                        //     document.getElementById('customMessage').style.display = 'none';
                        // }
                    } else {
                        $('#disconnectionMessageContainer').modal('hide');
                        document.getElementById('dateContainer').style.display = 'block';
                        document.getElementById('messageOptions').style.display = 'block';
                        document.getElementById('edit').style.display = 'none';
                        document.getElementById('customMessage').style.display = 'none';
                    }
                }
                
            },
            error: function(xhr, status, error) {
                console.error("Error fetching default message:", error);
                alert('Error fetching default message');
            }
        });
    });
    

    $('#edit').click(function() {
        var $customMessage = $('#customMessage');
        if ($customMessage.prop('disabled')) {
            $customMessage.prop('disabled', false);
            $(this).text('Save');
        } else {

            $('#customMessage').val();
            $customMessage.prop('disabled', true);
            $(this).text('Edit');
        }
    });
    

    $('#confirmType').click(function() {
        defaultMessage = document.getElementById('customMessage').value;

        const containerDefault = document.querySelector('.disconnection-message');
        if(containerDefault) {
            
            defaultDisconnectionMessage = document.querySelector('.disconnection-message').value;
        }
        
        console.log(defaultDisconnectionMessage);
        console.log(defaultMessage);
        
        if(defaultMessage != "" || defaultDisconnectionMessage != "") {
            
            var customMessage = document.getElementById('customMessage').value;
            var messageType = selectedOption;
            
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'save.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            
            xhr.send('messageType=' + encodeURIComponent(messageType) + '&customMessage=' + encodeURIComponent(customMessage));

            $('#messageTypeModal').modal('hide');
            $('#disconnectionMessageContainer').modal('hide');
            displayConfirmation(selectedContacts);
            
        } else {
            alert('Please enter a message!');
        }
    });
    


    $('#sendSMSButton').click(function() {
        var message = $('#messageInput').text();

        var contacts = [];
        var phoneNum = [];

        $('#confirmationTable tbody tr').each(function() {
            var accountNumber = $(this).find('td:eq(0)').text();
            var matchedContact = selectedContacts.find(function(contact) {
                return contact['Account Number'] === accountNumber;
            });

            var contactNumber = matchedContact['Contact Number'];
            phoneNum.push(contactNumber);
        
            if (matchedContact) {
                var contact = {
                    'Account Number': matchedContact['Account Number'],
                    'Name of Customer': matchedContact['Name of Customer'],
                    'Address': matchedContact['Address'],
                    'Meter Number': matchedContact['Meter Number'],
                    'Unpaid Bills': matchedContact['Unpaid Bills'],
                    'Months in Arrears': matchedContact['Months in Arrears'],
                    'Contact Number': matchedContact['Contact Number'],
                    'Message Type': selectedOption,
                    'Message Content': message
                };
        
                if (selectedOption === 'disconnection') {
                    var disconnectionMessage = disconnectionMessagesArr.find(function(message) {
                        return message.id === matchedContact['Account Number'];
                    });
        
                    if (disconnectionMessage) {
                        contact['Message Content'] = disconnectionMessage.message;
                    }
                }
        
                contacts.push(contact);

                console.log(contact);
            }
        });
        

        contacts.sort(); 

        console.log("Succeeded Sent Messages:");
        console.log(contacts);

        // $('#confirmationTable tbody tr').each(function() {
        // var contactNumber = $(this).find('td:eq(2)').text();
        //     contacts.push(contactNumber);
        // });

        // contacts.sort();
        console.log(contacts.length + "\n" + message);
        console.log(message);

        var phoneNumbers = phoneNum.join();

        console.log(phoneNumbers);
        console.log(contacts);
        
        if (contacts.length > 0 && message) {
            if(sendingMessageType === 'disconnection'){
                $.ajax({
                    type: "POST",
                    url: "semaphoreDisconnection.php",
                    data: {
                        contacts: JSON.stringify(contacts), 
                        message: JSON.stringify(disconnectionMessagesArr)
                    },
                    success: function(response) {
                        console.log("SMS sent successfully.");
                        
                        $.ajax({
                            type: "POST",
                            url: "smsInsert.php",
                            data: {
                                contacts: JSON.stringify(contacts)
                            },
                            success: function(db_response) {
                                console.log("Data inserted into database successfully.");

                                clear();
                            },
                            error: function(xhr, status, error) {
                                console.error("Error inserting data into database: " + error);
                            }
                        });

                        Swal.fire({
                            position: "top-end",
                            title: "SMS Sent Successfully",
                            showConfirmButton: false,
                            timer: 1500,
                            customClass: {
                                popup: 'custom-popup-class',
                                title: 'custom-title-class'
                            }
                        });
                        console.log(response);
                        
                    },
                    error: function(xhr, status, error) {
                        console.error("Error sending SMS via Semaphore: " + error);
                        Swal.fire({
                            position: "top-end",
                            title: "Unable to sent message. Please Try Again",
                            showConfirmButton: false,
                            timer: 1500,
                            customClass: {
                                popup: 'custom-popup-class',
                                title: 'custom-title-class'
                            }
                        });
                    }
                });
                clear();
            } else {
                $.ajax({
                    type: "POST",
                    url: "semaphore.php",
                    data: {
                        numbers: phoneNumbers, 
                        message: message
                    },
                    success: function(response) {
                        console.log("SMS sent successfully.");

                        $.ajax({
                            type: "POST",
                            url: "smsInsert.php",
                            data: {
                                contacts: JSON.stringify(contacts)
                            },
                            success: function(db_response) {
                                console.log("Data inserted into database successfully.");

                                clear();
                            },
                            error: function(xhr, status, error) {
                                console.error("Error inserting data into database: " + error);
                            }
                        });
                        

                        Swal.fire({
                            position: "top-end",
                            title: "SMS Sent Successfully",
                            showConfirmButton: false,
                            timer: 1500,
                            customClass: {
                                popup: 'custom-popup-class',
                                title: 'custom-title-class'
                            }
                        });
                        
                        console.log(response);
                        
                    },
                    error: function(xhr, status, error) {
                        console.error("Error sending SMS via Semaphore: " + error);
                        Swal.fire({
                            position: "top-end",
                            title: "Unable to sent message. Please Try Again",
                            showConfirmButton: false,
                            timer: 1500,
                            customClass: {
                                popup: 'custom-popup-class',
                                title: 'custom-title-class'
                            }
                        });
                    }
                });
                clear();
            }
            
        } else {
            alert('Please select contacts and enter a message.');
        }
    });
    
    $('.go-back').click(function() {
        $('#smsConfirmationModal').modal('hide');
        $('#messageTypeModal').modal('show');
        $('#disconnectionMessageContainer').modal('show');

    });

    $('.cancel-btn').click(function() {
        $('#dueDateInput, #disconnectionDateInput').val('');
        $('#dateContainer, #messageOptions').hide();
        $('#customMessage').prop('disabled', true).val(defaultMessage);
        $('#edit').text('Edit');
        $('#smsOption').val("");
        $('#sendSingleSMSBtn, #sendMultipleSMSBtn').hide();
        $('#userTable').find('tbody').find('input[type="checkbox"]').prop('checked', false);
        $('#userTable').find('thead').find('input[type="checkbox"]').prop('checked', false);
        $('#messageTypeModal, #disconnectionMessageContainer').modal('hide');
        $('.disconnection-body').empty();
        if(selectedOption == 'disconnection'){
            document.getElementById('edit').style.display = 'block';
            document.getElementById('customMessage').style.display = 'block';
        }
    });

    function clear(){
        document.getElementById('dueDateInput').value = ""; 
        document.getElementById('disconnectionDateInput').value = ""; 
        document.getElementById('dateContainer').style.display = 'none';
        document.getElementById('messageOptions').style.display = 'none';
        $('#customMessage').prop('disabled', true);
        $('#customMessage').val(defaultMessage);
        $('#edit').text('Edit');
        $('#smsOption').val("");
        $('#sendSingleSMSBtn').hide();
        $('#sendMultipleSMSBtn').hide();
        $('#userTable').find('tbody').find('input[type="checkbox"]').prop('checked', false);
        $('#userTable').find('thead').find('input[type="checkbox"]').prop('checked', false);
        $('#messageTypeModal').modal('hide');
        $('#disconnectionMessageContainer').modal('hide');
        $('.disconnection-body').empty();
        $('#smsConfirmationModal').modal('hide');
    }

    function toSentenceCase(str) {
        return str.toLowerCase().replace(/\b\w/g, function(char) {
            return char.toUpperCase();
        });
    }

    function displayInitialDisconnectionMessage(disconnectionMessagesArr) {
        $('.disconnection-body').empty();
        console.log(disconnectionMessagesArr);
        disconnectionMessagesArr.forEach(function(message, index) {
            var textAreaId = 'disconnectionMessage_' + index;
            var $textArea = $('<textarea class="form-control disconnection-message" id="' + textAreaId + '" style="height: 300px; " disabled></textarea>');
            $textArea.val(message.message); 
            $('.disconnection-body').append($textArea);
        });
    }

    function displayMessageType(type) {
        if (type === 'reminder') {
            sendingMessageType = 'reminder';
            $('#disconnectionMessageContainer').modal('hide');
            document.getElementById('messageOptions').style.display = 'block';
            document.getElementById('customMessage').style.display = 'block';
            document.getElementById('dateContainer').style.display = 'none';
            document.getElementById('edit').style.display = 'block';
            document.getElementById('customMessage').value = "Reminder: Conserve Water!\n\n" +
                "Fix leaks, use water wisely, and save our precious resource. Thank you!";
        } else if (type === 'notice') {
            sendingMessageType = 'notice';
            $('#disconnectionMessageContainer').modal('hide');
            document.getElementById('messageOptions').style.display = 'block';
            document.getElementById('customMessage').style.display = 'block';
            document.getElementById('dateContainer').style.display = 'none';
            document.getElementById('edit').style.display = 'block';
            document.getElementById('customMessage').value = "Notice: Planned Water Shutdown \n\n" +
                "Please be advised of a planned water shutdown in your area for essential maintenance. Kindly make necessary arrangements. We apologize for any inconvenience.\n\n" +
                "Thank you for your understanding.";
        } else if (type === 'announcement') {
            sendingMessageType = 'announcement';
            $('#disconnectionMessageContainer').modal('hide');
            document.getElementById('edit').style.display = 'block';
            document.getElementById('messageOptions').style.display = 'block';
            document.getElementById('customMessage').style.display = 'block';
            document.getElementById('dateContainer').style.display = 'none';
            document.getElementById('customMessage').value = "Upcoming Water District Maintenance \n\n Good Day! \n\n" +
                "Please be informed that our water district will be conducting routine maintenance in your area. During this time, you may experience temporary interruptions in water supply. \n\n" +
                "We apologize for any inconvenience this may cause and appreciate your understanding as we work to ensure the reliability of our water infrastructure.\n\n" +
                "Thank you for your cooperation.";
        } else if (type === 'newMeter') {
            sendingMessageType = 'newMeter';
            document.getElementById('messageOptions').style.display = 'block';
            document.getElementById('dateContainer').style.display = 'none';
            document.getElementById('edit').style.display = 'none';
              
                disconnectionMessagesArr = [];
                var customDisconnectionMessages = "";

                $('#disconnectionMessageContainer').modal('show');
                document.getElementById('customMessage').style.display = 'none';

                selectedContacts.forEach(function(contact) {
                    var nameOfCustomer = toSentenceCase(contact['Name of Customer']);
                    var accountNumber = toSentenceCase(contact['Account Number']);
        
                    customDisconnectionMessages = "Overdue Installation Fee \n" 
                    +  "Good Day! Mr./Mrs. " + nameOfCustomer
                    + ",\n" + "with account number " + accountNumber +"."
                    + "\n\nThis is a reminder that your installation fee of " +  contact['Unpaid Bills']  
                    + " is now due and needs to be settled to avoid service disconnection. Thank you.";
    
                    
                    disconnectionMessagesArr.push({
                        id: contact['Account Number'],
                        messageType: sendingMessageType,
                        message: customDisconnectionMessages,
                        contactNumber: contact['Contact Number']
                    });
                });

                $('.disconnection-body').empty();
                console.log(disconnectionMessagesArr);
                disconnectionMessagesArr.forEach(function(message, index) {
                    var textAreaId = 'disconnectionMessage_' + index;
                    var $textArea = $('<textarea class="form-control disconnection-message" id="' + textAreaId + '" style="height: 300px; " disabled></textarea>');
                    $textArea.val(message.message); 
                    $('.disconnection-body').append($textArea);
                });
            

        }  else if (type === 'disconnection') {
            sendingMessageType = 'disconnection';
            $('#disconnectionMessageContainer').modal('hide');
            document.getElementById('dateContainer').style.display = 'block';
            document.getElementById('messageOptions').style.display = 'block';
            document.getElementById('edit').style.display = 'none';
            document.getElementById('customMessage').style.display = 'none';
            
            function formatDate(dateString) {
                const date = new Date(dateString);
                const options = { year: 'numeric', month: 'long', day: '2-digit' };
                return date.toLocaleDateString('en-US', options);
            }

            if (sendingType === 'single') {
                $('#showMessage').on('click', function() {
                    $('#disconnectionMessageContainer').modal('show');

                    var customMessage = "";
    
                    selectedContacts.forEach(function(contact) {
                        var nameOfCustomer = toSentenceCase(contact['Name of Customer']);
                        var accountNumber = toSentenceCase(contact['Account Number']);
                        
                        customMessage += "Good Day! Mr./Mrs. " + nameOfCustomer + ",\n" + "acc# " + accountNumber;
    
                        var dueDate = $('#dueDateInput').val();
                        if (dueDate) {
                            customMessage += " with outstanding balance of "+ contact['Unpaid Bills']  
                            +  " is due on " + formatDate(dueDate);
                        }
    
                        var disconnectionDate = $('#disconnectionDateInput').val();
                        if (disconnectionDate) {
                            customMessage += ". Pay before " + formatDate(disconnectionDate);
                        }
    
                        customMessage += " to avoid disconnection.";
                    });
                    
                    document.getElementById('dueDateInput').value = '';
                    document.getElementById('disconnectionDateInput').value = '';

                    $('.disconnection-body').empty();
                    var $textArea = $('<textarea class="form-control disconnection-message" style="height: 300px; " disabled></textarea>');
                    $textArea.val(customMessage); 
                    $('.disconnection-body').append($textArea);
                    
                });
                
                console.log('You clicked single');
            } else {
                $('#showMessage').on('click', function() {
                    $('#disconnectionMessageContainer').modal('show');
                    disconnectionMessagesArr = [];
                    var customDisconnectionMessages = "";

                    selectedContacts.forEach(function(contact) {
                        var nameOfCustomer = toSentenceCase(contact['Name of Customer']);
                        var accountNumber = toSentenceCase(contact['Account Number']);
                        customDisconnectionMessages = "Good Day! Mr./Mrs. " + nameOfCustomer + ",\n" + "acc# " + accountNumber;
    
                        var dueDate = $('#dueDateInput').val();
                        
                        if (dueDate) {
                            customDisconnectionMessages += " with outstanding balance of "+ contact['Unpaid Bills'] 
                            +  " is due on " + formatDate(dueDate);
                        }
    
                        var disconnectionDate = $('#disconnectionDateInput').val();
                        if (disconnectionDate) {
                            customDisconnectionMessages += ". Pay before " + formatDate(disconnectionDate);
                        }
    
                        customDisconnectionMessages += " to avoid disconnection.";
    
                        disconnectionMessagesArr.push({
                            id: contact['Account Number'],
                            messageType: sendingMessageType,
                            message: customDisconnectionMessages,
                            contactNumber: contact['Contact Number']
                        });
                    });
    
                    document.getElementById('dueDateInput').value = '';
                    document.getElementById('disconnectionDateInput').value = '';

                    displayInitialDisconnectionMessage(disconnectionMessagesArr);
                });
    
                console.log('You clicked multiple');
            }
        } else if (type === '') {
            defaultMessage = "";
            defaultDisconnectionMessage = "";
            document.getElementById('messageOptions').style.display = 'none';
        }
    }

    function showSendSMSButtons(showSingle, showMultiple) {
        if (showSingle) {
            $('#sendSingleSMSBtn').show();
        } else {
            $('#sendSingleSMSBtn').hide();
        }
        if (showMultiple) {
            $('#sendMultipleSMSBtn').show();
        } else {
            $('#sendMultipleSMSBtn').hide();
        }
    }

    function displayConfirmation(contacts) {

        var message;

        console.log(selectedOption);
        if (selectedOption === 'reminder' || selectedOption === 'notice' || selectedOption === 'announcement') {
            message = defaultMessage;
            $('#messageInput').html(message);
        } else if(selectedOption === 'disconnection' || selectedOption === 'newMeter'){
            message = defaultDisconnectionMessage;
            $('#messageInput').html(message);
            $('#messageInput').hide();
        }

        var tableHtml = '<table class="table">';
        tableHtml += '<thead class="table-info"><tr><th>Account Number</th><th>Name of Customer</th><th>Contact Number</th></tr></thead>';
        tableHtml += '<tbody>';

        contacts.forEach(function(contact) {
            tableHtml += '<tr class="table-info">';
            tableHtml += '<td class="table-info">' + contact['Account Number'] + '</td>';
            tableHtml += '<td class="table-info">' + contact['Name of Customer'] + '</td>';
            tableHtml += '<td contenteditable="true" class="table-info editable-contact">' + contact['Contact Number'] + '</td>';
            tableHtml += '</tr>';
        });

        tableHtml += '</tbody></table>';
        $('#messageInput').html(message);

        $('#confirmationTable').html(tableHtml);
        $('#smsConfirmationModal').modal('show');


    }

    var historyTable;

    $('#historyButton').click(function() {
        var button = $(this);

        if (button.text() === 'View History') {
            $.ajax({
                type: "GET",
                url: "backUpHistory.php", 
                success: function(response) {
                    $('#dataTableSection').hide();
                    $('.upload-section').hide();
                    $('#historySection').show();

                    button.text('Exit History');

                    var data = JSON.parse(response);

                    if (historyTable) {
                        historyTable.clear().destroy();
                    }

                    if (data.length > 0) {
                        historyTable = $('#historyTable').DataTable({
                            "data": data,
                            "columns": [
                                { "data": "acc_num" },
                                { "data": "customer_name" },
                                { "data": "address" },
                                { "data": "meter_num" },
                                { "data": "unpaid_bills" },
                                { "data": "months_arrears" },
                                { "data": "message_type" },
                                { "data": "message" },
                                { "data": "contact_num" },
                                { "data": "sent_date" },
                            ],
                            "language": {
                                "search": "_INPUT_",
                                "searchPlaceholder": "Search records",
                                "lengthMenu": "_MENU_",
                                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                                "infoEmpty": "Showing 0 to 0 of 0 entries",
                                "infoFiltered": "(filtered from _MAX_ total entries)"
                            },
                            "headerCallback": function(thead, data, start, end, display) {
                                $(thead).find('th').css('background-color', '#77c3ec');
                            }
                        });
                        
                    } else {
                        $('#historyTable tbody').append('<tr><td colspan="9" class="text-center">No data</td></tr>');
                    }

                },
                error: function(xhr, status, error) {
                    console.error("Error fetching message history: " + error);
                    alert('Error fetching message history. Please try again.');
                }
            });
        } else {
            $('#historySection').hide();
            $('#dataTableSection').show();
            $('.upload-section').hide();

            button.text('View History');
        }
    });

    $('#exportBtn').click(function() {
        var currentDate = new Date();
        var dateString = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        const table = $('#historyTable').DataTable();
        var data = table.rows().data().toArray();
    
        var firstRow = {
            'acc_num': 'Account Number',
            'customer_name': 'Name of Customer',
            'address': 'Address',
            'meter_num': 'Meter Number',
            'unpaid_bills': 'Unpaid Bills',
            'months_arrears': 'Months in Arrears',
            'message_type': 'Message Type',
            'message': 'Message Content',
            'contact_num': 'Contact Number',
            'sent_date': 'Sent Date'
        };

        data.unshift(firstRow);
    
        var wb = XLSX.utils.book_new();
        
        const ws = XLSX.utils.aoa_to_sheet([]);

        XLSX.utils.sheet_add_json(ws, data, {origin: 'A2'});
    
        const columnWidths = {
            "Account Number": 16, 
            "Name of Customer": 25, 
            "Address": 35, 
            "Meter Number": 15, 
            "Unpaid Bills": 13, 
            "Months in Arrears": 15, 
            "Messagge Type": 15, 
            "Message Conntent": 35, 
            "Contact Number": 15, 
            "Sent Date": 15, 
        };
        ws['!cols'] = [];
    
        for (let col in columnWidths) {
            ws['!cols'].push({ wch: columnWidths[col] });
        }

        XLSX.utils.sheet_add_aoa(ws, [["Disconnection Message History"]], {origin: 'A1'});

        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }, 
        ];

        XLSX.utils.book_append_sheet(wb, ws, "History Data");
    
        XLSX.writeFile(wb, "history_data_" + dateString + ".xlsx");
    });
    

    function renderDataTable(data) {
        $('#userTable').DataTable({
            "data": data,
            "columns": [
                { 
                    "data": null,
                    "render": function(data, type, row, meta) {
                        return '<input type="checkbox" class="row-checkbox">';
                    }
                },
                { "data": "Account Number" },
                { "data": "Name of Customer" },
                { "data": "Address" },
                { "data": "Meter Number" },
                { "data": "Unpaid Bills" },
                { "data": "Months In Arrears" },
                { "data": "Contact Number" }
            ],
            "language": {
                "search": "_INPUT_",
                "searchPlaceholder": "Search records",
                "lengthMenu": "_MENU_",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "Showing 0 to 0 of 0 entries",
                "infoFiltered": "(filtered from _MAX_ total entries)"
            },
            "headerCallback": function(thead, data, start, end, display) {
                $(thead).find('th').css('background-color', '#77c3ec');
            }
        });                   
       
        $('.upload-section').hide();
    }
});
