class UserResponse {
  constructor(displayName, email, phone, role, uid) {
    this.uid = uid;
    this.user = displayName;
    this.email = email;
    this.phone = phone;
    this.isLogged = true;
    this.role = role;
  }
}

module.exports = UserResponse;
