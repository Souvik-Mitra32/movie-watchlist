const path = require("path");
const AppError = require(path.join(__dirname, "../utils/AppError.js"));
const watchlistModel = require(path.join(__dirname, "../models/watchlist.js"));
const movieService = require(path.join(__dirname, "./movie.js"));

const getAllWatchlists = async () => {
    const watchlists = await watchlistModel.selectAllWatchlists();
    // if (watchlists.length === 0) {
    //     throw new AppError("No watchlist found", 404);
    // }
    return watchlists;
}
const getWatchlistById = async (watchlistId) => {
    const watchlist = await watchlistModel.selectWatchlistById(watchlistId);
    if (!watchlist) {
        throw new AppError("No watchlist found", 404);
    }
    return watchlist;
}

const createWatchlist = async (name, description) => {
    const existingWatchlist = await watchlistModel.selectWatchlistByname(name);
    if (existingWatchlist) {
        throw new AppError("Watchlist already exists", 409);
    }
    if (!name) {
        throw new AppError("Watchlist name required", 400);
    }
    return await watchlistModel.insertWatchlist(name, description);
}

const getMoviesFromAllWatchlists = async () => {
    const watchlists = await watchlistModel.selectAllWatchlists();
    if (watchlists.length === 0) {
        throw new AppError("No watchlist found", 404);
    }
    let movies = [];
    watchlists.forEach(watchlist => watchlist.movie_ids?.forEach(movieId => movies.push(movieId)));
    return movies;
}

const addMovie = async (watchlistId, movieId) => {
    const watchlist = await watchlistModel.selectWatchlistById(watchlistId);
    if (!watchlist) {
        throw new AppError("No watchlist found", 404);
    }
    const movies = await watchlistModel.selectAllMovies(watchlistId);
    if (movies.length > 0 && movies.includes(movieId)) {
        throw new AppError("Movie already added", 409);
    }
    await watchlistModel.insertMovie(watchlistId, movieId);
    return "Movie added"
}

const editWatchlistName = async (watchlistId, updatedName) => {
    const watchlist = await watchlistModel.selectWatchlistById(watchlistId);
    if (!watchlist) {
        throw new AppError("No watchlist found", 404);
    }
    if (!updatedName) {
        throw new AppError("Watchlist name can not be empty", 400);
    }
    return await watchlistModel.updateWatchlistName(watchlistId, updatedName);
}

const editWatchlistDescription = async (watchlistId, description) => {
    const watchlist = await watchlistModel.selectWatchlistById(watchlistId);
    if (!watchlist) {
        throw new AppError("No watchlist found", 404);
    }
    return await watchlistModel.updateWatchlistDescription(watchlistId, description);
}

const removeMovie = async (watchlistId, movieId) => {
    const watchlist = await watchlistModel.selectWatchlistById(watchlistId);
    if (!watchlist) {
        throw new AppError("No watchlist found", 404);
    }
    const movies = await watchlistModel.selectAllMovies(watchlistId);
    if (movies.length === 0 || !(movies.includes(movieId))) {
        throw new AppError("No movie found to remove", 409);
    }
    return await watchlistModel.removeMovie(watchlistId, movieId);
}

const deleteWatchlist = async (watchlistId) => {
    const watchlist = await watchlistModel.selectWatchlistById(watchlistId);
    if (!watchlist) {
        throw new AppError("No watchlist found to delete", 409);
    }
    return await watchlistModel.deleteWatchlist(watchlistId);
}

module.exports = {
    getAllWatchlists,
    getWatchlistById,
    createWatchlist,
    getMoviesFromAllWatchlists,
    addMovie,
    editWatchlistName,
    editWatchlistDescription,
    removeMovie,
    deleteWatchlist,
}