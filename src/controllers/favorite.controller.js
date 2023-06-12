import responseHandler from "../handlers/response.handler";
import favoriteModel from "../models/favorite.model";

const addFavorite = async (req, res) => {
  try {
    const isFavorite = await favoriteModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId,
    });

    if (isFavorite) {
      return responseHandler.OK(res, isFavorite);
    }

    const favorite = new favoriteModel({
      ...req.body,
      user: req.user.id,
    });

    await favorite.save();

    responseHandler.created(res, favorite);
  } catch (error) {
    responseHandler.error(res);
  }
};

const removeFavoite = async (req, res) => {
  try {
    const { favoriteId } = req.params;

    const favorite = await favoriteModel.findOne({
      user: req.user.id,
      _id: favoriteId,
    });

    if (!favorite) {
      return responseHandler.notFound(res);
    }

    await favorite.remove();

    responseHandler.OK(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getFavoritesOfUser = async (req, res) => {
  try {
    const favorite = await favoriteModel
      .find({
        user: req.user.id,
      })
      .sort("-createdAt");

    responseHandler.OK(res, favorite);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default { addFavorite, removeFavoite, getFavoritesOfUser };
