function filterEmployeeByID(){
    //get the first and last name by a ID dropdown selection menu
    var empID = document.getElementById('empIDFilter').value
    //construct the URL and redirect to it
    window.location = '/employees/filter/' + parseInt(empID)
    console.log("At filterEmpByID.js")
}
