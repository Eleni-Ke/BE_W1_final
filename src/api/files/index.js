import Express from "express";
import multer from "multer";
import { saveProductImg } from "../../lib/fs-tools.js";

const filesRouter = Express.Router();

filesRouter.post(
  "/:productsId/upload",
  multer().single("image"),
  async (req, res, next) => {
    try {
      await saveProductImg();
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
