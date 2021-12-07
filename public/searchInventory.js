function searchInventoryByName() {
    //get the item name 
    var item_name_search_string  = document.getElementById('item_name_search_string').value
    //construct the URL and redirect to it
    window.location = '/inventory/search/' + encodeURI(item_name_search_string)
}
