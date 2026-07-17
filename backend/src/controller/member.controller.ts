import type { Request, Response } from "express";
import * as memberService from "../services/member.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMembers = asyncHandler(async (req: Request, res: Response) => {
  const serverId = req.params.serverId as string;
  const members = await memberService.getMembers(serverId, req.user.id);

  res.status(200).json({
    success: true,
    message: "All Members retrieved successfully",
    members,
  });
});
