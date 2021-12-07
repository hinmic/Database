function updateItem(itemID){
    $.ajax({
        url: '/inventory/' + itemID,
        type: 'PUT',
        data: $('#update-item').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
