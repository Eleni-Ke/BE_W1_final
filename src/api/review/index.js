import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import {
  checkReviewSchema,
  triggerBadRequest,
} from "../products/validation.js";
import {
  getProducts,
  getReviews,
  writeProducts,
  writeReviews,
} from "../../lib/fs-tools.js";
import { check } from "express-validator";

const reviewsRouter = Express.Router();

reviewsRouter.post(
  "/:productsId/reviews",
  checkReviewSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const product_id = req.params.productsId;
      const newReview = {
        ...req.body,
        review_id: uniqid(),
        productId: product_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const allreviews = await getReviews();
      allreviews.push(newReview);
      await writeReviews(allreviews);
      res.status(201).send({ review_id: newReview.review_id });
    } catch (error) {
      next(error);
    }
  }
);

export default reviewsRouter;
