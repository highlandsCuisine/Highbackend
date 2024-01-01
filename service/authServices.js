const { signInWithEmailAndPassword } = require("firebase/auth");
const { serviceAuth, auth } = require("../database/firebase");
//create a user
const createUser = async (credentials) => {
  const user = await serviceAuth.createUser(credentials);
  return user;
};
// signIn User
const signInExistingUser = async (email, password) => {
  const user = await signInWithEmailAndPassword(auth, email, password);
  return user;
};
//update user credentials if
const updateUser = async (UID, credentials) => {
  const updatedUser = await serviceAuth.updateUser(UID, credentials);
  return updatedUser;
};
// deleteUsers
const deleteUser = async (UID) => {
  const deletedUser = await serviceAuth.deleteUser(UID);
  return deletedUser;
};
// reset Password
const resetPassword = async (email) => {
  const resetLink = await serviceAuth.generatePasswordResetLink(email);
  const r = resetLink.split("apiKey=");
  const makeLink = `${r[0]}apiKey=${process.env.FIREBASE_APIKEY}`;
  return makeLink;
};
//set custom claims if any
const setCustomClaims = async (UID, claim) => {
  const customClaims = await serviceAuth.setCustomUserClaims(UID, claim);
  return customClaims;
};
// check if user is authenticated or not
const isAuth = async (token) => {
  const isAuthenticated = await serviceAuth.verifyIdToken(token);
  return isAuthenticated;
};

module.exports = {
  isAuth,
  createUser,
  deleteUser,
  updateUser,
  resetPassword,
  setCustomClaims,
  signInExistingUser,
};
