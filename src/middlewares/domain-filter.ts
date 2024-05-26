import { NextFunction, Request, Response } from "express";

const allowedDomains = ["localhost:4020", "hs.click-soft.co.kr"];

// 특정 도메인에서만 요청을 허용하는 미들웨어
export const domainFilter = (req: Request, res: Response, next: NextFunction) => {
  const requestDomain = req.get("host");
  if (requestDomain && allowedDomains.includes(requestDomain)) {
    // 요청이 허용된 도메인에서 온 경우 다음 미들웨어로 이동
    next();
  } else {
    // 요청이 허용되지 않은 도메인에서 온 경우 에러 응답
    res.status(403).send("Forbidden");
  }
};