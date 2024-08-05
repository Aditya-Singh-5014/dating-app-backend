const Message = require("../models/Message");

// Send a message
exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;

  try {
    const message = new Message({
      senderId: req.user.uid,
      receiverId,
      content,
    });

    await message.save();

    // Send WebSocket notification to the receiver
    const ws = require("../server").ws;
    ws.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        client.userId === receiverId
      ) {
        client.send(JSON.stringify({ type: "newMessage", data: message }));
      }
    });

    res.status(201).json({ message: "Message sent", message });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.uid, receiverId: userId },
        { senderId: userId, receiverId: req.user.uid },
      ],
    }).sort("createdAt");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).send(error);
  }
};
