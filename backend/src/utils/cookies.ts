import type { Response } from "express";
import { refreshCookieOptions } from "../config/cookies.js";

export function setRefreshTokenCookie(
    res: Response,
    refreshToken: string
): void {
    res.cookie(
        "refreshToken",
        refreshToken,
        refreshCookieOptions
    );
}

export function clearRefreshTokenCookie(
    res: Response
): void {
    res.clearCookie(
        "refreshToken",
        refreshCookieOptions
    );
}
