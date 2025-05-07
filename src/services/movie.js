const path = require("path");
const axios = require("axios");
const { apiEx } = require(path.join(__dirname, "../config/index.js"))
const AppError = require(path.join(__dirname, "../utils/AppError.js"));

const fetchMovieById = async (movieId) => {
    if (!movieId) {
        throw new AppError("Movie id required", 400);
    }
    const { data } = await axios.get(apiEx.baseUrl + "/movie/" + movieId,
        {
            headers: {
                Authorization: "bearer " + apiEx.tokenAuth.bearerToken,
            },
        }
    );
    return {
        id: data.id,
        genres: data.genres.map(genre => genre.name),
        imdb_id: data.imdb_id,
        origin_country: data.origin_country,
        original_language: data.original_language,
        original_title: data.original_title,
        overview: data.overview,
        poster_path: apiEx.imgUrl + "/original" + data.poster_path,
        release_date: data.release_date,
        runtime: data.runtime,
        title: data.title,
        vote_average: data.vote_average,
        vote_count: data.vote_count,
    }
}

const fetchPopularMovies = async () => {
    const { data } = await axios.get(apiEx.baseUrl + "/movie/popular",
        {
            headers: {
                Authorization: "bearer " + apiEx.tokenAuth.bearerToken,
            }
        }
    );
    if (!data) {
        throw new AppError("No movies found", 404)
    }
    const movieIds = data.results.map(result => result.id);
    const movies = await Promise.all(
        movieIds.map(async (movieId) => {
            return await fetchMovieById(movieId);
        })
    );
    return movies;
}

const fetchSearchedMovies = async (title, pageNum) => {
    if (!title) {
        throw new AppError("Movie title required", 400);
    }
    const { data } = await axios.get(apiEx.baseUrl + "/search/movie",
        {
            headers: {
                Authorization: "bearer " + apiEx.tokenAuth.bearerToken,
            },
            params: {
                query: title,
                page: Number(pageNum) || 1,
            }
        }
    );
    if (data.results.length === 0) {
        throw new AppError("No movies found", 404);
    }
    const movieIds = data.results.map(result => result.id);
    const movies = await Promise.all(
        movieIds.map(async (movieId) => {
            return await fetchMovieById(movieId);
        })
    );
    return movies;
}

const fetchUpcomingMovies = async () => {
    const { data } = await axios.get(apiEx.baseUrl + "/movie/upcoming",
        {
            headers: {
                Authorization: "bearer " + apiEx.tokenAuth.bearerToken,
            }
        }
    );
    if (!data) {
        throw new AppError("No movies found", 404)
    }
    const movieIds = data.results.map(result => result.id);
    const movies = await Promise.all(
        movieIds.map(async (movieId) => {
            return await fetchMovieById(movieId);
        })
    );
    return movies;
}

const fetchTrendingMovies = async () => {
    const { data } = await axios.get(apiEx.baseUrl + "/trending/movie/day",
        {
            headers: {
                Authorization: "bearer " + apiEx.tokenAuth.bearerToken,
            }
        }
    );
    if (!data) {
        throw new AppError("No movies found", 404)
    }
    const movieIds = data.results.map(result => result.id);
    const movies = await Promise.all(
        movieIds.map(async (movieId) => {
            return await fetchMovieById(movieId);
        })
    );
    return movies;
}

module.exports = {
    fetchMovieById,
    fetchPopularMovies,
    fetchSearchedMovies,
    fetchUpcomingMovies,
    fetchTrendingMovies,
};