const path = require("path");
const db = require(path.join(__dirname, "../config/db.js"));

const selectAllWatchlists = async () => {
    const { rows } = await db.query(
        "SELECT * FROM watchlist ORDER BY id"
    );
    return rows;
}

const selectWatchlistById = async (watchlistId) => {
    const { rows } = await db.query(
        "SELECT * FROM watchlist WHERE id = $1",
        [watchlistId]
    );
    return rows[0];
}

const selectWatchlistByname = async (name) => {
    const { rows } = await db.query(
        "SELECT * FROM watchlist WHERE name = $1",
        [name]
    );
    return rows[0];
}

const insertWatchlist = async (name, description) => {
    const { rows } = await db.query(
        "INSERT INTO watchlist (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
    );
    return rows[0];
}

const selectAllMovies = async (watchlistId) => {
    const { rows } = await db.query(
        "SELECT movie_ids FROM watchlist WHERE id = $1",
        [watchlistId]
    );
    return rows[0].movie_ids;
}

const insertMovie = async (watchlistId, movieId) => {
    const { rows } = await db.query(
        "UPDATE watchlist SET movie_ids = movie_ids || ARRAY[$1::int] WHERE id = $2 RETURNING *",
        [movieId, watchlistId]
    );
    return rows[0];
}

const updateWatchlistName = async (watchlistId, name) => {
    const { rows } = await db.query(
        "UPDATE watchlist SET name = $1 WHERE id = $2 RETURNING *",
        [name, watchlistId]
    );
    return rows[0];
}

const updateWatchlistDescription = async (watchlistId, description) => {
    const { rows } = await db.query(
        "UPDATE watchlist SET description = $1 WHERE id = $2 RETURNING *",
        [description, watchlistId]
    );
    return rows[0];
}

const removeMovie = async (watchlistId, movieId) => {
    const { rows } = await db.query(
        "UPDATE watchlist SET movie_ids = array_remove(movie_ids, $1) WHERE id = $2 RETURNING *",
        [movieId, watchlistId]
    );
    return rows[0];
}

const deleteWatchlist = async (watchlistId) => {
    const { rows } = await db.query(
        "DELETE FROM watchlist WHERE id = $1 RETURNING *",
        [watchlistId]
    );
    return rows[0];
}

module.exports = {
    selectAllWatchlists,
    selectWatchlistById,
    selectWatchlistByname,
    insertWatchlist,
    selectAllMovies,
    insertMovie,
    updateWatchlistName,
    updateWatchlistDescription,
    removeMovie,
    deleteWatchlist,
}