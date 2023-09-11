import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { VideoCallChatModel } from "@/db/models/videoCallChatModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const room = req.query.room as string;

  if (req.method === "GET") {
    const chat = await VideoCallChatModel.findById(room);

    if (chat) {
      res.status(200).json(chat);
    } else {
      const newChat = new VideoCallChatModel({ _id: room, messages: [] });
      await newChat.save();
      res.status(201).json(newChat);
    }
  } else if (req.method === "POST") {
    const body = JSON.parse(req.body);

    const chat = await VideoCallChatModel.findById(room);

    if (chat) {
      const updateChat = await VideoCallChatModel.findByIdAndUpdate(
        room,
        {
          $push: {
            messages: {
              timestamp: body.timestamp,
              user: body.user,
              message: body.message,
            },
          },
        },
        { new: true }
      ).catch((err) => {
        console.error("Update Error:", err);
        res.status(500).json({ error: "Update Error" });
      });

      if (updateChat) {
        res.status(200).json(updateChat);
      }
    } else {
      const newChat = new VideoCallChatModel({
        _id: room,
        messages: [body.message],
      });
      await newChat.save();
      res.status(201).json(newChat);
    }
  }
}
