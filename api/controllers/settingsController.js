const User = require("../models/User");

// Update User Settings
exports.updateSettings = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["email", "password", "preferences"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    updates.forEach((update) => {
      if (update === "password") {
        // Update password using Firebase Admin SDK
        admin.auth().updateUser(user.uid, { password: req.body.password });
      } else {
        user[update] = req.body[update];
      }
    });
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};
