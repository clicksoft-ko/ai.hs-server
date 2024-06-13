import { Router, Request, Response } from "express";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";
import { URLConst } from "@/constants/url-const";

const router = Router();

router.get("/",
  async (req: Request, res: Response) => {
    const data = {
      urlconstClient: URLConst.CLIENT,
      nodeEnv: process.env.NODE_ENV,
      baseUrl: process.env.BASE_URL,
    }
    res.send(data);
  })

router.post(
  "/",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser });
  }
);

export { router as currentUserRouter };
