class User {
  constructor(displayName, email, password, phone) {
    this.displayName = displayName;
    this.email = email;
    this.password = password;
    this.phoneNumber = phone;
  }

  getdisplayName() {
    return this.displayName;
  }

  getEmail() {
    return this.email;
  }

  setdisplayName(displayName) {
    this.displayName = displayName;
  }

  setEmail(email) {
    this.email = email;
  }
}

module.exports = User;
