const path = require("path");
const express = require("express");
const router = express.Router();
const viewController = require(path.join(__dirname, "../controllers/view.controller.js"));

router.get("/", viewController.homepage);
router.get("/new-watchlist", viewController.newWatchlist);
router.post("/new-watchlist/create", viewController.createWatchlist);
router.get("/search-movies", viewController.searchMovies);
router.get("/watchlist/:watchlistId", viewController.viewWatchlist);
router.post("/watchlist/:watchlistId/add-movie/:movieId", viewController.addMovie);
router.post("/watchlist/:watchlistId/movie/:movieId/remove", viewController.removeMovie);
router.get("/watchlist/:watchlistId/edit", viewController.editWatchlist);
router.post("/watchlist/:watchlistId/confirm-edit", viewController.confirmEditWatchlist);
router.post("/watchlist/:watchlistId/delete", viewController.deleteWatchlist);

module.exports = router;