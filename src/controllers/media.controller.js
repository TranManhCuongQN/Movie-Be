import responseHandler from "../handlers/response.handler";
import tmdbApi from "../tmdb/tmdb.api";
import userModel from "../models/user.model";
import favoriteModel from "../models/favorite.model";
import reviewModel from "../models/review.model";
import tokenMiddleware from "../middlewares/token.middleware";

const getList = async (req, res) => {
  try {
    const { page } = req.query;
    const { mediaType, mediaCategory } = req.params;

    const response = await tmdbApi.mediaList({
      mediaType,
      mediaCategory,
      page,
    });

    return responseHandler.OK(res, response);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getGenres = async (req, res) => {
  try {
    const { mediaType } = req.params;

    const response = await tmdbApi.mediaGenres({ mediaType });

    return responseHandler.OK(res, response);
  } catch (error) {
    responseHandler.error(res);
  }
};

const search = async (req, res) => {
  try {
    const { query, page } = req.query;
    const { mediaType } = req.params;

    const response = await tmdbApi.mediaSearch({
      query,
      page,
      mediaType: mediaType === "people" ? "person" : mediaType,
    });

    return responseHandler.OK(res, response);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getDetail = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;

    const params = { mediaType, mediaId };

    const media = await tmdbApi.mediaDetail(params);

    media.credits = await tmdbApi.mediaCredits(params);

    const videos = await tmdbApi.mediaVideos(params);

    media.videos = videos;

    const recommed = await tmdbApi.mediaRecommend(params);

    media.recommed = recommed.results;

    media.images = await tmdbApi.mediaImages(params);

    const tokenDecoded = tokenMiddleware.tokenDecode(req);

    if (tokenDecoded) {
      const user = await userModel.findById(tokenDecoded.data);

      if (user) {
        const isFavorite = await favoriteModel.findOne({
          user: user.id,
          mediaId,
        });

        media.isFavorite = isFavorite !== null;
      }
    }

    media.reviews = await reviewModel
      .find({ mediaId })
      .populate("user")
      .sort("-createdAt");

    responseHandler.OK(res, media);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default { getList, getGenres, search, getDetail };
