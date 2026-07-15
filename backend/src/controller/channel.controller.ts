import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as channelService from "../services/channel.service.js"

export const createChannel = asyncHandler(async (req: Request, res: Response)=>{
  const serverId = req.params.serverId as string;
  const channel = await channelService.createChannel({serverId, userInput: req.body, userId: req.user.id});

  res.status(201).json({
    success: true,
    message: "Channel created successfully",
    channel
  })
})
