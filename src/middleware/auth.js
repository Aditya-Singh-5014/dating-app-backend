const admin = require("../config/firebase");

const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    console.log("Authorization header missing");
    return res.status(401).send({ error: "Please authenticate." });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Token verified successfully", decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
