const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("./math-mentor-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const getUserData = async (uid) => {
  try {
    const userRecord = await getAuth().getUser(uid);
    return {
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
    };
  } catch (error) {
    return {
      displayName: null,
      photoURL: null,
    };
  }
};

module.exports = { getUserData };
