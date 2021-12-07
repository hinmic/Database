function filterSalesByID(){
    //get the first and last name by a ID dropdown selection menu
    var saleID = document.getElementById('saleIDFilter').value
    //construct the URL and redirect to it
    window.location = '/sales/filter/' + parseInt(saleID)
    console.log("At filterSalesByID.js")
}
