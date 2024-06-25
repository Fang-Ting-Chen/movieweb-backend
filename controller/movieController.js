//用作處理請求的邏輯。接收從router傳來的請求，並調用函數來執行操作、處理請求和響應格式，最後返回結果給客戶端

const { getNowPlaying, getPopular, getUpcoming, getSearch, createToken, createSession, getAccountId, getWatchList, addToWatchList, deleteWatchList,getGenre } = require('../services/movieService');

//現正播出電影
exports.getNowPlayingMovies = async (req, res) => {
  try {
    const { page } = req.params; 
    const movies = await getNowPlaying(page);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//熱門電影
exports.getPopularMovies = async (req, res) => {
    try {
      const { page } = req.params; 
      const movies = await getPopular(page);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

//即將播出電影
exports.getUpcomingMovies = async (req, res) => {
    try {
      const { page } = req.params; 
      const movies = await getUpcoming(page);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

//搜尋
exports.getSearchInfo = async (req, res) => {
  try {
    const { keyword,page } = req.params; 
    const info = await getSearch(keyword,page);
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

//電影分類
exports.getGenreMovies = async (req, res) => {
  try {
    const { page,genreid } = req.params; 
    const movies = await getGenre(page,genreid);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//(會員)觀看電影列表
exports.getWatchListMovie = async (req, res) => {
  const { page } = req.params;
  const { accountId } = req.session;
  if (!accountId) {
    return res.sendStatus(401);
  }
  try{
    const movies = await getWatchList(accountId, page);
    res.status(200).json(movies);
  }catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

//(會員)增加電影到觀看電影列表
exports.addToWatchListController = async (req, res) => {
  const accountId = req.session.accountId;
  const { mediaId } = req.body;
  try{
    const result = await addToWatchList(accountId, mediaId);
    res.json(result);
  } catch(error) {
    console.error('Error:', error);
  }
}
//(會員)刪除觀看電影列表中的電影
exports.deleteWatchListController = async (req, res) => {
  const accountId = req.session.accountId;
  const { mediaId } = req.body;
  try{
    const result = await deleteWatchList(accountId, mediaId);
    res.json(result);
  } catch(error) {
    console.error('Error:', error);
  }
}

//授權碼登入
exports.login = async (req, res) => {
  try {
    const requestToken = await createToken(); 
    const redirectUrl = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=https://movieweb-backend-bj2o.onrender.com/movie/callback`; //此url部屬後要改!!!!! 
    res.json({ redirectUrl });
  } catch (error) {
    res.status(500).send('Error getting request token');
  }
};

exports.callback = async (req, res) => {
  try {
    const requestToken = req.query.request_token;
    const sessionId = await createSession(requestToken);
    const accountId = await getAccountId(sessionId);
    
    // 將 sessionId 和 accountId 保存到 session
    req.session.sessionId = sessionId;
    req.session.accountId = accountId;  

    // 手動保存會話數據
    req.session.save(err => {
      if (err) {
        return res.status(500).send('Error saving session');
      }

    console.log('callback_Session ID:', req.session.sessionId);
    console.log('callback_Session Account ID:', req.session.accountId);

    res.redirect('https://fang-ting-chen.github.io/movieweb-frontend/');  
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).send('Error creating session');
  }
}

//登出
exports.logout = async(req, res) =>{
  req.session.destroy(); //清除伺服器上的會話資料
  res.status(200).send('登出成功');
}

// 用於前端檢查用户是否已登入
exports.checkLogin = async (req, res) =>{
  console.log('checkLogin_Session ID:', req.session.sessionId);
  console.log('checkLogin_Session account:', req.session.accountId);
  if (req.session.sessionId && req.session.accountId) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
}
