function filterCustomerByID() {
    //get the first and last name by a ID dropdown selection menu
    var custID = document.getElementById('custIDFilter').value
    //construct the URL and redirect to it
    window.location = '/customers/filter/' + parseInt(custID)
    console.log("At filterCustByID.js")
}
