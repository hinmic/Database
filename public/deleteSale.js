function deleteSale(saleID){
    console.log("I am in the deleteSale Function")
    $.ajax({
        url: '/sales/' + saleID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
