import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0, httpOnly: true });

  res.send({});
});

export { router as signoutRouter };
