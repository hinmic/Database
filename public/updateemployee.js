function updateEmployee(empID){
    $.ajax({
        url: '/employees/' + empID,
        type: 'PUT',
        data: $('#update-employee').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
