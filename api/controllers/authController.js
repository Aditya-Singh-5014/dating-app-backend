const admin = require("../config/firebase");
const User = require("../models/User");
const axios = require("axios");

exports.registerUser = async (req, res) => {
  const {
    email,
    password,
    name,
    age,
    gender,
    bio,
    interests, // Ensure this field is correctly destructured from req.body
    minAgePreference,
    maxAgePreference,
    genderPreference,
  } = req.body;

  try {
    const userRecord = await admin.auth().createUser({ email, password });

    const newUser = new User({
      uid: userRecord.uid,
      email: userRecord.email,
      name,
      age,
      gender,
      bio,
      interests, // Ensure this field is correctly assigned
      minAgePreference,
      maxAgePreference,
      genderPreference,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to exchange custom token for ID token
const exchangeCustomTokenForIdToken = async (customToken) => {
  const apiKey = process.env.FIREBASE_API_KEY;
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`;

  try {
    const response = await axios.post(url, {
      token: customToken,
      returnSecureToken: true,
    });

    return response.data.idToken;
  } catch (error) {
    throw new Error(error.response.data.error.message);
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);
    const customToken = await admin.auth().createCustomToken(user.uid);

    // Exchange the custom token for an ID token using Firebase Auth REST API
    const idToken = await exchangeCustomTokenForIdToken(customToken);

    res.status(200).json({ token: idToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
