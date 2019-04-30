var express = require('express');
var router = express.Router();

//Controller Logic to handle user specic functionality
//var express = require('express');
//var app = module.exports = express();
let UserDB = require('../Models/userDB.js');
let ItemFeedbackDB = require('../Models/ItemFeedbackDB.js');
let ItemDB = require('../Models/itemDB.js');
let UserProfile = require('../Models/userProfile.js');
let UserItem = require('../Models/userItem.js');

//session handling
var session = require('express-session');
var cookieParser = require('cookie-parser');

router.use(cookieParser());
router.use(session({ secret: "nbad session secret" }));


router.all('/profile', (request, response, next) => {
  console.log("profile all request");
  //check if session tracking has started:
  let sessionProfile = request.session.currentProfile;
  //console.log(sessionProfile);

  let action = request.query.action;
  console.log("user profile action " + action);

  if (typeof sessionProfile != 'undefined') { //session data exists. Use that.
    //console.log("session profile " + sessionProfile);

    //add user to view
    response.locals.theUser = request.session.theUser;

  } else {//session tracking not started. Use hard-coded data
    //set default user object using hardcoded data from DB

    //get a user as if they logged in
    let theUser = UserDB.getUser("hcarlton@uncc.edu");
    request.session.theUser = theUser;
    console.log("user added to sesion " + theUser);
    //add user to view data
    response.locals.theUser = request.session.theUser;

    action = "showProfile";
    let userProfile = new UserProfile();
    let userItems = ItemFeedbackDB.selectUserItems(1);
    if (userItems.length >= 1) {
      // viewURL = "/profile";
      userProfile.setItems(userItems);
      request.session.currentProfile = userProfile.getItems();
    }
    //console.log(userItems);
  }
  next();
});
router.get('/profile', (request, response) => {
  console.log("profile get request");
  //check if session tracking has started:
  let sessionProfile = request.session.currentProfile;
  //console.log(sessionProfile);

  let action = request.query.action;
  console.log("user profile GET action " + action);

  if (typeof sessionProfile == 'undefined') {
    //session tracking not started. Use hard-coded data
    //set default user object using hardcoded data from DB

    //get a user as if they logged in
    let theUser = UserDB.getUser("hcarlton@uncc.edu");
    request.session.theUser = theUser;
    console.log("user added to sesion " + theUser);

    action = "showProfile";
    let userProfile = new UserProfile();
    let userItems = ItemFeedbackDB.selectUserItems(1);
    if (userItems.length >= 1) {
      // viewURL = "/profile";
      userProfile.setItems(userItems);
      request.session.currentProfile = userProfile;
    }
    //console.log(userProfile);
  }

  //console.log("updated session properties: " + JSON.stringify(request.session));
  if (action == null || action == "" || action == "showProfile") {
    respData = showProfile(request, response);
    return response.render(respData.view, { data: respData.data });
  } else if (action == "signout") {
    //save user profile to db
    console.log("signout");
    request.session.destroy();
    //remove user from locals
    delete response.locals.theUser;
    return response.render('index');
  }
  //before forwarding to view, check if profile is empty
  let userProfile = request.session.currentProfile;
  if (userProfile == null || userProfile.length == 0) {
    request.emptyProfile = "Your profile is empty";
  }
  response.locals.theUser = request.session.theUser;

  return response.render('myItems', { data: request.session.currentProfile });
});

//post profile requests with action parameter
router.post('/profile', function (request, response) {
  let action = request.body.action;
  console.log("user profile action " + action);

  if (action == null || action == "" || action == "showProfile") {
    respData = showProfile(request, response);
  } else if (action == "updateProfile") {
    respData = updateProfile(request, response);
  } else if (action == "save") {
    respData = updateProfileSave(request, response);
  } else if (action == "rate") {
    respData = updateProfileRate(request, response);
  } else if (action == "madeIt") {
    respData = updateProfileMadeIt(request, response);
  } else if (action == "delete") {
    respData = updateProfileDelete(request, response);
  } else if (action == "signout") {
    //save user profile to db
    console.log("signout");
    request.session.destroy();
    delete response.locals.theUser;
    respData = {};
  }
  //before forwarding to view, check if cart is empty after updates
  let userProfile = request.session.currentProfile;
  if (userProfile == null || userProfile.length == 0) {
    request.emptyProfile = "Your profile is empty";
  }

  //console.log(respData.data);
  response.render(respData.view, { data: respData.data });
});

let showProfile = function (request, response) {

  let userProfile = request.session.currentProfile;
  if (userProfile == null || userProfile == 0) {
    request.emptyProfile = "Your profile is empty";
  } else {
    request.session.currentProfile = userProfile;
  }
  viewAddress = 'myItems';
  // Get item object from items list
  viewData = userProfile;
  //console.log("view Data :" + JSON.stringify(viewData));
  // Set viewData to this item object

  //return data and how to display it
  profile = { view: viewAddress, data: viewData };
  return profile;
};

let updateProfile = function (request, response) {
  console.log("update profile function");
  let viewAddress = "";
  //get all item codes on view
  let viewItems = request.body.itemList;
  let itemCodeParam = request.body.itemCode;

  //console.log(viewItems);
  //console.log(itemCodeParam);
  //validate itemCodeParam
  if (itemCodeParam != null || !itemCodeParam == "") {
    //get profile from session

    let userProfile = request.session.currentProfile;
    //validate item requested for update is in itemList
    if (isItemInView(viewItems, itemCodeParam)) {
      console.log("item in view");
      //get item from profile. If not in profile redisplay profile view
      userItem = isItemInProfile(userProfile, itemCodeParam);

      if (userItem != null) {
        console.log("item in profile");

        request.thisUserItem = userItem;
        //return "/profile/feedback";

        viewAddress = "feedback";
        // Get item object from items list
        viewData = userItem;
        //console.log("view Data :" + JSON.stringify(viewData));
        // Set viewData to this item object

        //return data and how to display it
        profile = { view: viewAddress, data: viewData };
        return profile;

      }
    }
  }
  return null;
}

let isItemInProfile = function (userProfile, itemCodeParam) {
  console.log(userProfile)
  let itemCode = 0;
  let rating = 0;
  let userItems = userProfile
  for (let i = 0; i < userItems.length; i++) {
    itemCode = userItems[i].item.itemCode;
    if (itemCode == itemCodeParam) {
      return userItems[i];
    }
  }
  return false;
};

let addItem = function (request) {
  console.log("add item to profile function");

  //if request makes it here that means it was validated:
  //user verified.
  //requested item is in view
  //requested item is not already in user profile
  let sessionProfile = request.session.currentProfile;
  let userId = request.session.theUser.id;

  profile = new UserProfile();
  profile.setItems(sessionProfile);

  let itemCode = request.body.itemCode;
  if (ItemDB.exists(itemCode)) {
    let item = ItemDB.getItem(itemCode);

    let profileItem = new UserItem();
    profileItem.setItem(item);
    profileItem.setRating(0);
    profileItem.setMadeIt(false);
    profile.addItem(profileItem);

    //console.log("after adding item " + JSON.stringify(profile.getItems()));
    request.session.currentProfile = profile.getItems();
    return true;
  }
  return false;
}

let updateProfileSave = function (request, response) {
  console.log("update profile save function");

  let userProfile = request.session.currentProfile;

  //get all item codes on view
  let viewItems = request.body.itemList;
  let itemCodeParam = request.body.itemCode;

  let viewAddress = "";

  if ((isItemInView(viewItems, itemCodeParam)) && (userProfile.length == 0 || !isItemInProfile(userProfile, itemCodeParam))) {
    itemAdded = addItem(request);
    //console.log("itemAdded " + itemAdded);
    viewAddress = "myItems"
  } else {
    request.errorMessag = "problem with item save request. Try again.";
  }

  viewData = request.session.currentProfile;
  //console.log("view Data :" + JSON.stringify(viewData));
  // Set viewData to this item object

  //return data and how to display it
  profile = { view: viewAddress, data: viewData };
  return profile;
}

let updateProfileRate = function (request, response) {
  let userProfile = request.session.currentProfile;

  //get all item codes on view
  let viewItems = request.body.itemList;
  let itemCodeParam = request.body.itemCode;

  if ((isItemInView(viewItems, itemCodeParam)) && (isItemInProfile(userProfile, itemCodeParam))) {
    let ratingParam = request.body.rating;

    if (typeof ratingParam != 'undefined' && ratingParam <= 5 && ratingParam >= 1) {
      let userProfileObj = new UserProfile();
      userProfileObj.setItems(userProfile);
      let userItem = isItemInProfile(userProfile, itemCodeParam);
      userItem.rating = parseInt(request.body.rating);

      //console.log(userItem);
      userProfileObj.updateItemRating(userItem, ratingParam);
      request.session.currentProfile = userProfileObj.getItems();
      // console.log("profile from session")
      // console.log(request.session.currentProfile);

      viewData = request.session.currentProfile;
      //console.log("view Data :" + JSON.stringify(viewData));
      // Set viewData to this item object

      //return data and how to display it
      profile = { view: "myItems", data: viewData };
      return profile;
    } else {
      //item is in profile. Request is to rate item. show feedback page
      return updateProfile(request, response);
    }
  } else {
    response.locals.errorMessage = "problem with item rating feedback request. Try again.";

    viewData = request.session.currentProfile;
    //console.log("view Data :" + JSON.stringify(viewData));
    // Set viewData to this item object

    //return data and how to display it
    profile = { view: "myItems", data: viewData };
    return profile;
  }
}

let updateProfileMadeIt = function (request, response) {
  let userProfile = request.session.currentProfile;

  //get all item codes on view
  let viewItems = request.body.itemList;
  let itemCodeParam = request.body.itemCode;

  if ((isItemInView(viewItems, itemCodeParam)) && (isItemInProfile(userProfile, itemCodeParam))) {
    let madeItParam = request.body.madeIt;


    if (typeof madeItParam != 'undefined') {
      let userProfileObj = new UserProfile();
      userProfileObj.setItems(userProfile);
      let userItem = isItemInProfile(userProfile, itemCodeParam);
      userItem.madeIt = madeItParam;

      //console.log(userItem);
      userProfileObj.updateItemFlag(userItem, madeItParam);
      request.session.currentProfile = userProfileObj.getItems();
      //console.log("profile from session")
      //console.log(request.session.currentProfile);
    } else {
      response.locals.data.errorMessage = "problem with item rating feedback request. Try again.";
    }
  } else {
    response.locals.data.errorMessage = "problem with item rating feedback request. Try again.";
  }
  viewData = request.session.currentProfile;
  //console.log("view Data :" + JSON.stringify(viewData));
  //Set viewData to this item object

  //return data and how to display it
  profile = { view: "myItems", data: viewData };
  return profile;
}

let isItemInView = function (viewItems, itemCode) {
  //check if item in profile
  for (let i = 0; i < viewItems.length; i++) {
    if (viewItems[i] == itemCode) {
      //item is in profile
      return true;
    }
  }
  //item is not in profile
  return false;
}

let updateProfileDelete = function (request, response) {
  console.log("in updateProfileDelete function");
  let userProfile = request.session.currentProfile;
  //console.log(userProfile);
  //get all item codes on view
  let viewItems = request.body.itemList;
  let itemCodeParam = request.body.itemCode;

  if ((isItemInView(viewItems, itemCodeParam)) && (isItemInProfile(userProfile, itemCodeParam))) {

    let userProfileObj = new UserProfile();
    userProfileObj.setItems(userProfile);
    let userItem = isItemInProfile(userProfile, itemCodeParam);
    if (userItem != null) {
      console.log("remove item");
      //console.log(userProfile);
      userProfileObj.removeItem(itemCodeParam);
      request.session.currentProfile = userProfileObj.getItems();
      //console.log("profile from session")
      //console.log(request.session.currentProfile);
    }
  } else {
    response.locals.data.errorMessage = "problem with item rating feedback request. Try again.";
  }

  viewData = request.session.currentProfile;
  //console.log("view Data :" + JSON.stringify(viewData));

  //Set viewData to this item object
  //return data and how to display it
  profile = { view: "myItems", data: viewData };
  return profile;
}
module.exports = router;
