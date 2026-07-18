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

export const updateMemberRole = asyncHandler(
  async (req: Request, res: Response) => {
    const memberId = req.params.memberId as string;
    const member = await memberService.updateMemberRole(
      memberId,
      req.body,
      req.user.id,
    );

    res.status(201).json({
      success: true,
      message: "Members's role updated successfully",
      member,
    });
  },
);

export const removeMember = asyncHandler(
  async (req: Request, res: Response) => {
    const memberId = req.params.memberId as string;

    await memberService.removeMember(memberId, req.user.id);

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  },
);

export const leaveServer = asyncHandler(async (req: Request, res: Response) => {
  const serverId = req.params.serverId as string;

  await memberService.leaveServer(serverId, req.user.id);

  res.status(200).json({
    success: true,
    message: "You left the server successfully",
  });
});
