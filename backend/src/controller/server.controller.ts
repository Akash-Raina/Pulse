import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as serverService from "../services/server.service.js"

export const createServer = asyncHandler(async (req: Request, res: Response) =>{
  const {name} = req.body;

  const server = await serverService.createServer(name, req.user.id);

  res.status(201).json({
    success: true,
    message: "Server created successfully",
    server
  })

})
