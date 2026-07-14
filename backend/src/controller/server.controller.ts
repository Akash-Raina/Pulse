import type { Request, Response } from "express";
import * as serverService from "../services/server.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createServer = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;

    const server = await serverService.createServer(name, req.user.id);

    res.status(201).json({
      success: true,
      message: "Server created successfully",
      server,
    });
  },
);

export const getServers = asyncHandler(async (req: Request, res: Response) => {
  const servers = await serverService.getServers(req.user.id);

  res.status(200).json({
    message: "Servers returned successfully",
    servers,
  });
});

export const editServer = asyncHandler(async (req: Request, res: Response) => {
  const serverId = req.params.serverId as string;

  const updatedServer = await serverService.editServer({
    serverId,
    userId: req.user.id,
    ...req.body,
  });

  return res.status(201).json({
    message: "Server Setting updated successfully",
    updatedServer,
  });
});
