const User = require("../models/User");

exports.getMatches = async (req, res) => {
  console.log("Received request for matches");
  try {
    const userId = req.user.uid;
    const user = await User.findOne({ uid: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Match by age range preference
    let potentialMatches = await User.find({
      age: { $gte: user.minAgePreference, $lte: user.maxAgePreference },
      _id: { $ne: user._id }, // Exclude the current user
    });

    // Filter potential matches by shared interests
    potentialMatches = potentialMatches.filter((match) => {
      const sharedInterests = match.interests.filter((interest) =>
        user.interests.includes(interest)
      );
      return sharedInterests.length > 0; // At least one shared interest
    });

    console.log("Found matches:", potentialMatches);
    res.json({ data: potentialMatches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: error.message });
  }
};
