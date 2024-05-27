
function showBackdrop() {
    var backdrop = document.createElement('div');
    backdrop.classList.add('custom-modal-backdrop');
    document.body.appendChild(backdrop);
}

function removeBackdrop() {
    var backdrop = document.querySelector('.custom-modal-backdrop');
    if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
    }
}

$('#sendSMSModal').on('show.bs.modal', function () {
    
});

$('#fileUploadModal').on('show.bs.modal', function () {
    showBackdrop();
});

$('#fileUploadModal').on('hidden.bs.modal', function () {
    removeBackdrop();
});

$('.close-upload').on('click', function() {
    $('.modal-content').addClass('animate-close');

    setTimeout(function() {
        $('#fileUploadModal').modal('hide');
        $('.modal-content').removeClass('animate-close');
    }, 200);
});

