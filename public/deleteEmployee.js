function deleteEmployee(empID){
    console.log("I am in the deleteEmployee Function")
    $.ajax({
        url: '/employees/' + empID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
