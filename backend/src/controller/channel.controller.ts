import type { Request, Response } from "express";
import * as channelService from "../services/channel.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createChannel = asyncHandler(
  async (req: Request, res: Response) => {
    const serverId = req.params.serverId as string;
    const channel = await channelService.createChannel({
      serverId,
      userInput: req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Channel created successfully",
      channel,
    });
  },
);

export const getChannels = asyncHandler(async (req: Request, res: Response) => {
  const serverId = req.params.serverId as string;

  const channels = await channelService.getChannels(serverId, req.user.id);

  res.status(200).json({
    success: true,
    message: "Channel exported successfully",
    channels,
  });
});

export const getChannel = asyncHandler(async (req: Request, res: Response) => {
  const channelId = req.params.channelId as string;
  const channel = await channelService.getChannel(channelId, req.user.id);

  res.status(200).json({
    success: true,
    message: "Accessed Channel Successfully",
    channel,
  });
});

export const editChannel = asyncHandler(async (req: Request, res: Response) => {
  const channelId = req.params.channelId as string;

  const channel = await channelService.editChannel({
    channelId,
    userId: req.user.id,
    userInput: req.body,
  });

  res.status(200).json({
    success: true,
    message: "Channel updated successfully",
    channel,
  });
});
