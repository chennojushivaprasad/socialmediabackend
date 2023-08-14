import Conversation from "../model/conversationModel.js";

export const addConversation = async (req, res, next) => {
  const { senderId, recipientId } = req.params;

  let conversation;
  try {
    conversation = await Conversation.find({
      member: { $all: [senderId, recipientId] },
    });
  } catch (error) {
    return console.log("error", error);
  }

  const newConversation = new Conversation({
    member: [senderId, recipientId],
  });

  try {
    if (conversation.length === 0) {
      const data = await newConversation.save();
    
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.json({ message: "Something went wrong" });
  }
};

export const getConversation = async (req, res, next) => {
  const { senderId, recipientId } = req.params;

  let data;
  try {
    data = await Conversation.find({
      member: { $all: [senderId, recipientId] },
    });
    if (data.length === 0) return res.status(204).json([]);

    return res.status(200).json(data[0]);
  } catch (error) {
    return res.status(401).json("something went wrong");
  }
};
