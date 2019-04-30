let appUsers = [];
var User = require('./user.js');
let userObj = new User();

userObj.setUserID(1);
userObj.setUserName("Hunter");
userObj.setEmail("hcarlton@uncc.edu");

userObj
appUsers.push(userObj);

let addUser = function (id, name, email) {
    userObj = new User();
    userObj.setUserID(id);
    userObj.setUserName(name);
    userObj.setEmail(email);

    appUsers.push(userObj);
    return appUsers;
};


let getUser = function (email) {
    console.log("looking for user");
    for (let i =0;i<appUsers.length;i++){
        console.log(appUsers[i]);
        if (appUsers[i].email == email) {
            console.log("User found with email " + email);
            return appUsers[i];
        }
    }
    return null;
};

let getAllUsers = function () {
    return appUsers;
};

let emailExists = function (email) {
    let u = getUser(email);
    return (u != null);
};

module.exports.getUser = getUser;
module.exports.getAllUsers = getAllUsers;
module.exports.emailExist  = emailExists;
