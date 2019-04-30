class User {
  constructor(id, name, email, pswd) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.pswd = pswd;
  }
  //setting userID
  setUserID(uID) {
    this.id = uID;
  };
  getUserID() {
    return this.id;
  };
  //setting UserName
  setUserName(uName) {
    this.name = uName;
  };

  geUserName() {
    return this.name;
  };
  //setting user email
  setEmail(uEmail) {
    this.email = uEmail;
  };

  getEmail() {
    return this.email;
  };

    setPwsd(uPwsd){
      this.pwsd = uPwsd;
    }
    getPwsd(){
      return this.pwsd;
    }


}
// exports and returns the values declared above
module.exports = User;
