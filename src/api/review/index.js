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
        product_id: product_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const allReviews = await getReviews();
      allReviews.push(newReview);
      await writeReviews(allReviews);
      res.status(201).send({ review_id: newReview.review_id });
    } catch (error) {
      next(error);
    }
  }
);

reviewsRouter.get("/:productsId/reviews", async (req, res, next) => {
  try {
    const productId = req.params.productsId;
    const allReviews = await getReviews();
    const productReviews = allReviews.filter((e) => e.product_id === productId);
    res.send(productReviews);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:productsId/reviews/:reviewsId", async (req, res, next) => {
  try {
    const reviewId = req.params.reviewsId;
    const allReviews = await getReviews();
    const matchedReview = allReviews.find((e) => e.review_id === reviewId);
    res.send(matchedReview);
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
