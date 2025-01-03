import Express, { Request, Response } from "express";
import { authRouter, conversationRouter, newsRouter } from "../modules";

const router = Express.Router();

router.get("/", (req, res, next) => {
  res.json({
    data: "",
    message: "API is working",
  });
});

router.use("/auth", authRouter);
router.use("/news", newsRouter);
router.use("/conversation", conversationRouter);

router.all("*", (req: Request, res: Response, next: Express.NextFunction) => {
  try {
    res.status(404).json({ data: "", msg: "Routes not found" });
  } catch (e) {
    next(e);
  }
});

export const apiRouter = router;
