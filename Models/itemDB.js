let Item = require('./item.js');
let appItems  = [];

let itemObj = new Item ();
//item1
itemObj = new Item();
itemObj.setItemCode(1);
itemObj.setItemName("Chasing Light Rails in the QC - Framed");
itemObj.setDescription("This long exposure captures the vibrant lights reflecting off not only the buildings but as well as the light rail train as it passes by. Captured in this long exposure is a Light Rail train passing through the 4th Ward Station.");
itemObj.setCategory("Landscape");
itemObj.setImageURL("images/DSC_5939.jpeg");
itemObj.setPrice("$40.00");

appItems.push(itemObj);
//console.log(appItems.length);
//item2
itemObj = new Item();
itemObj.setItemCode(2);
itemObj.setItemName("Jerry Richardson Stadium Aerial Print - Framed.");
itemObj.setDescription("Jerry Richardson Football Stadium. Home of the UNC Charlotte 49er's.");
itemObj.setCategory("Landscape");
itemObj.setImageURL("images/009B41238CEC2F88AD91ECED0FE8143D.jpeg");
itemObj.setPrice("$40.00");

appItems.push(itemObj);
//item3
itemObj = new Item();
itemObj.setItemCode(3);
itemObj.setItemName("Charlotte Skyline Aerial Print - Framed.");
itemObj.setDescription("Charlotte Skyline. Showing some great tones.");
itemObj.setCategory("Landscape");
itemObj.setImageURL("images/44EDE802AF56F43DC051F7195EA51985.jpeg");
itemObj.setPrice("$40.00");

appItems.push(itemObj);
//item4
itemObj = new Item();
itemObj.setItemCode(4);
itemObj.setItemName("North Carolina State's Bell Tower - Framed.");
itemObj.setDescription("Long exposure of the North Carolina State's Bell Tower. The center point of NCSU's campus.");
itemObj.setCategory("Landscape");
itemObj.setImageURL("images/DSC_1825.jpeg");
itemObj.setPrice("$40.00");

appItems.push(itemObj);
//item5
itemObj = new Item();
itemObj.setItemCode(5);
itemObj.setItemName("Kemba Walker's Step-back Fadeaway - Framed");
itemObj.setDescription("Charlotte Hornets vs. Sacromento Kings. Kemba Walker (#15) shakes Justin Jackson with a nasty step back fader.");
itemObj.setCategory("Sports");
itemObj.setImageURL("images/DSC_7805.jpeg");
itemObj.setPrice("$50.00");

appItems.push(itemObj);
console.log(appItems.length);
//item6
itemObj = new Item();
itemObj.setItemCode(6);
itemObj.setItemName("Zach LaVine, SG for the Chicago Bulls - Framed.");
itemObj.setDescription("Charlotte Hornets vs. Chicago Bulls (Pre-season). Zach LaVine, 2016 All-Star Slam Dunk Winner runs back down the court.");
itemObj.setCategory("Sports");
itemObj.setImageURL("images/DSC_5717.jpeg");
itemObj.setPrice("$50.00");

appItems.push(itemObj);
console.log(appItems);
//category1 holds only Landscape photos
var category1 = [appItems[0], appItems[1], appItems[2]];
//category2 holds only Sports photos
var category2 = [appItems[3], appItems[4], appItems[5]];

var itemsPerCategory = [{categoryName: "Landscape", items: category1}, { categoryName: "Sports", items: category2 }];

var getItems = function () {
    return itemsPerCategory;
};

var getItem = function (itemID) {
    //this is hardcoded should be updated find item from items list with specified item ID
    return appItems[itemID - 1];
};
var exists = function (itemID) {
    //this is hardcoded should be updated find item from items list with specified item ID
    if(getItem)
    return true;
    else
    return false;
};

module.exports.getItems = getItems;
module.exports.getItem = getItem;
module.exports.exists = exists;
