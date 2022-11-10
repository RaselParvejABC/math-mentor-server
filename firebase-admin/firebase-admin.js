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
      displayName: userRecord.displayName ?? "Name Not Found",
      photoURL: userRecord.photoURL ?? "https://i.ibb.co/64B2d1Q/not-found.png",
    };
  } catch (error) {
    return {
      displayName: "Name not Found",
      photoURL: "https://i.ibb.co/64B2d1Q/not-found.png",
    };
  }
};

module.exports = { getUserData };
