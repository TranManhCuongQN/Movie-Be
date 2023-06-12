import responseHandler from "../handlers/response.handler";
import tmdbApi from "../tmdb/tmdb.api";

const personDetail = async (req, res) => {
  try {
    const { personId } = req.params;

    const person = await tmdbApi.personDetail({ personId });

    responseHandler.OK(res, person);
  } catch (error) {
    responseHandler.error(res);
  }
};

const personMedias = async (req, res) => {
  try {
    const { personId } = req.params;

    const medias = await tmdbApi.personMedias({ personId });

    responseHandler.OK(res, medias);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default {
  personDetail,
  personMedias,
};
