
let usersItemFeedback = {};
usersItemFeedback["1"] = [{ itemId: "1", rating: 4, flag: "No" },
{ itemId: "4", rating: 1, flag: "Yes" }, { itemId: "3", rating: 0, flag: "Yes" }];

let insert = function (userID, userItem) {

    //get user data
    let userItems = usersItemFeedback[userID]

    if (typeof userItems != 'undefined') {
        for (dbUserItem in userItems) {
            if (userItem.itemId == dbUserItem.itemId) {
                return false;
            }
        }
        //item not in user list so add
        userItems.push({ itemId: userItem.getItem().getItemCode(), rating: userItem.getRating, flag: userItem.getMadeIt() });
    }
};

//This method returns null if a record isn't found.
//need UserItem
let UserItem = require('./userItem.js');
var ItemDB = require('./itemDB.js');

let selectUserItems = function (userID) {

    let userItemsDB = usersItemFeedback[userID]

    let userItems = [];
    if (typeof userItemsDB != 'undefined') { //user saved items
        for (let i = 0; i < userItemsDB.length; i++) {
            userItem = new UserItem();
            userItem.setItem(ItemDB.getItem(userItemsDB[i].itemId));
            userItem.setRating(userItemsDB[i].rating);
            userItem.setMadeIt(userItemsDB[i].flag);
            userItems.push(userItem);
        }
    }
    return userItems;
};

let update = function (userID, userItem) {
    let userItemRatings = userItemRating[userID];
    let userItemFlags = userItemFlag[userID];

    let itemId;
    for (let i = 0; i < userItemRatings.length; i++) {
        //find the userItem data to update
        itemId = userItemRatings[i].split(",")[0]; //the first element in the string is the itemID
        if (itemId == userItem.item.itemCode) {
            //update in the list
            userItemRatings = userItemRatings.slice(i, 1);
            userItemRatings.push(itemId + "," + userItem.getRating());
            userItemFlags.push(itemId + "," + userItem.getMadeIt());

            //update the list
            userItemRating.put(userID, userItemRatings);
            userItemFlag.put(userID, userItemFlags);

            //if we get to here then update successful
            return true;
        }
    }
    //something went wrong
    return false;
};

let removeItem = function (userID, itemCode) {

    let userItemRatings = userItemRating[userID];
    let userItemFlags = userItemFlag[userID];

    let itemId;
    for (let i = 0; i < userItemRatings.lenght; i++) {
        //find the userItem data to update
        itemId = userItemRatings[i].split(",")[0]; //the first element in the string is the itemID
        if (temId == itemCode) {
            //update in the arraylist
            userItemRatings = userItemRatings.slice(i, 1);
            userItemFlags = userItemFlags.slice(i, 1);

            //update the hashtable
            userItemRating[userID] = userItemRatings;
            userItemFlag[userID] = userItemFlags;

            //if we get to here then update successful
            return true;
        }
    }
    //something went wrong
    return false;
};

module.exports.insert = insert;
module.exports.selectUserItems = selectUserItems;
module.exports.update = update;
module.exports.removeItem = removeItem;
