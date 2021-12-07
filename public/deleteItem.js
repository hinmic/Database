function deleteItem(itemID){
    console.log("I am in the deleteItem Function")
    $.ajax({
        url: '/inventory/' + itemID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
