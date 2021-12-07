function deleteCustomer(id){
    console.log("I am in the deleteCustomer function.")
    $.ajax({
        url: '/customers/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
