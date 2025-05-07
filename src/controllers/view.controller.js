const path = require("path");
const watchlistService = require(path.join(__dirname, "../services/watchlist.js"));
const movieService = require(path.join(__dirname, "../services/movie.js"));

let error = null;

const homepage = async (req, res, next) => {
    try {
        const movies = req.session.movies || await movieService.fetchTrendingMovies();
        const searchedMovie = req.session.query;
        const watchlists = await watchlistService.getAllWatchlists();

        delete req.session.movies;
        delete req.session.query;
        return res
            .status(200)
            .render(path.join(__dirname, "../views/home.ejs"), {
                movies,
                searchedMovie,
                watchlists,
                error,
            })
    } catch (err) {
        error = err.message;
        return res
            .status(err.statusCode)
            .render(path.join(__dirname, "../views/home.ejs"), {
                error,
            });
    }
}

const newWatchlist = async (req, res, next) => {
    try {
        const watchlists = await watchlistService.getAllWatchlists();
        return res
            .status(200)
            .render(path.join(__dirname, "../views/create.ejs"), {
                watchlists,
                error,
            });
    } catch (err) {
        error = err.message;
        return res
            .status(err.statusCode)
            .redirect("../views/create.ejs");
    }
}

const createWatchlist = async (req, res, next) => {
    const { name, description } = req.body;
    try {
        const newWatchlist = await watchlistService.createWatchlist(name, description);
        return res
            .status(200)
            .redirect("/watchlist/" + newWatchlist.id);
    } catch (err) {
        error = err.message;
        return res
            .status(err.statusCode)
            .redirect("/new-watchlist");
    }
}

const searchMovies = async (req, res, next) => {
    const { query } = req.query;
    req.session.query = query;
    try {
        req.session.movies = await movieService.fetchSearchedMovies(query);
        return res
            .status(200)
            .redirect("/");
    } catch (err) {
        error = err.message;
        return res
            .status(err.statusCode)
            .redirect("/");
    }
}

const viewWatchlist = async (req, res, next) => {
    const watchlistId = Number(req.params.watchlistId);
    req.session.watchlistId = watchlistId;
    try {
        const watchlists = await watchlistService.getAllWatchlists();
        const watchlist = await watchlistService.getWatchlistById(watchlistId);
        movies = await Promise.all(watchlist.movie_ids.map((movieId) => movieService.fetchMovieById(movieId)));
        return res
            .status(200)
            .render(path.join(__dirname, "../views/watchlist.ejs"), {
                watchlists,
                watchlist,
                movies,
                error,
            });
    } catch (err) {
        error = err.message;
        return res
            .status(err.statusCode)
            .redirect("/");
    }
}

const removeMovie = async (req, res, next) => {
    const movieId = Number(req.params.movieId);
    const watchlistId = req.session.watchlistId;
    delete req.session.watchlistId;
    try {
        await watchlistService.removeMovie(watchlistId, movieId);
        return res
            .status(200)
            .redirect("/watchlist/" + watchlistId);
    } catch (err) {
        error = err.message;
        return res
            .status(err.statusCode)
            .redirect("/watchlist/" + watchlistId);
    }
}

const editWatchlist = async (req, res, next) => {
    const watchlistId = Number(req.params.watchlistId);
    try {
        const watchlists = await watchlistService.getAllWatchlists();
        const watchlist = await watchlistService.getWatchlistById(watchlistId);
        return res
            .status(200)
            .render(path.join(__dirname, "../views/edit.ejs"), {
                watchlists,
                watchlist,
            })
    } catch (err) {
        error = err.message;
        return res
            .status(err.statusCode)
            .redirect("/watchlist/" + watchlistId + "/edit");
    }
}

const confirmEditWatchlist = async (req, res, next) => {
    const { updatedName, updatedDescription } = req.body;
    const watchlistId = Number(req.params.watchlistId);
    try {
        await watchlistService.editWatchlistName(watchlistId, updatedName);
        await watchlistService.editWatchlistDescription(watchlistId, updatedDescription);
        return res
            .status(200)
            .redirect("/watchlist/" + watchlistId);
    } catch (err) {
        error = err.message;
        return res
            .status(err.statusCode)
            .render("../views/edit.ejs", {
                error,
            });
    }
}

const deleteWatchlist = async (req, res, next) => {
    const watchlistId = Number(req.params.watchlistId);
    try {
        await watchlistService.deleteWatchlist(watchlistId);
        return res
            .status(200)
            .redirect("/");
    } catch (err) {
        error = err.message;
        return res
            .status(err.statusCode)
            .redirect("/");
    }
}

const addMovie = async (req, res, next) => {
    const watchlistId = Number(req.params.watchlistId);
    const movieId = Number(req.params.movieId);
    try {
        await watchlistService.addMovie(watchlistId, movieId);
        return res
            .status(200)
            .redirect("/");
    } catch (err) {
        error = err.message;
        return res
            .status(err.statusCode)
            .redirect("/");
    }
}

module.exports = {
    homepage,
    newWatchlist,
    createWatchlist,
    searchMovies,
    viewWatchlist,
    removeMovie,
    editWatchlist,
    confirmEditWatchlist,
    deleteWatchlist,
    addMovie,
}