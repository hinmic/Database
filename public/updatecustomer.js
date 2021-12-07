function updateCustomer(custID){
    $.ajax({
        url: '/customers/' + custID,
        type: 'PUT',
        data: $('#update-customer').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
