//設置&處理傳入的http請求，將其分配到相應的controller上

var express = require('express');
var router = express.Router();

const movie = require('../controller/movieController');

//電影列表
router.get('/nowplaying/:page', movie.getNowPlayingMovies); //現正播出
router.get('/popular/:page', movie.getPopularMovies); //熱門電影
router.get('/upcoming/:page', movie.getUpcomingMovies); //即將播出電影

//搜尋
router.get('/search/:keyword/:page', movie.getSearchInfo);
//電影分類
router.get('/genre/:page/:genreid', movie.getGenreMovies);

//授權碼登入
router.get('/login', movie.login);
router.get('/callback', movie.callback);
router.get('/logout', movie.logout);

//(會員)觀看電影列表
router.get('/watchlist/:page', movie.getWatchListMovie)
//(會員)增加電影到觀看電影列表
router.post('/addwatchlist', movie.addToWatchListController)
//(會員)刪除觀看電影列表中的電影
router.post('/deletewatchlist', movie.deleteWatchListController)
//確認登入
router.get('/ckecklogin', movie.checkLogin)


module.exports = router;
