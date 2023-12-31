import responseHandler from "../handlers/response.handler.js";
import reviewModel from "../models/review.model.js";

const create = async (req, res) => {
  try {
    const { movieId } = req.params;

    const review = await reviewModel({
      user: req.user.id,
      movieId,
      ...req.body,
    });

    await review.save();

    responseHandler.OK(res, {
      ...review._doc,
      id: review.id,
      user: req.user,
    });
  } catch (error) {
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewModel.findOneAndDelete({
      _id: reviewId,
      user: req.user.id,
    });

    if (!review) {
      return responseHandler.notFound(res);
    }

    responseHandler.OK(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getReviewOfUser = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find({
        user: req.user.id,
      })
      .sort("-createdAt");

    responseHandler.OK(res, reviews);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default { create, remove, getReviewOfUser };
