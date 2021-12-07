function filterInventoryByID(){
    //get the first and last name by a ID dropdown selection menu
    var itemID = document.getElementById('itemIDFilter').value
    //construct the URL and redirect to it
    window.location = '/inventory/filter/' + parseInt(itemID)
    console.log("At filterInventoryByID.js")
}
