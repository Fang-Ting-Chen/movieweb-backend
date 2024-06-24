//串接調用第三方 TMDB API

const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();



const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: process.env.AUTHORIZATION
  }
};

//現正播出電影
const getNowPlaying = async(page) => {
  const urlNowPlaying = `https://api.themoviedb.org/3/movie/now_playing?language=zh-TW&page=${page}`;
  try{
    const response = await fetch(urlNowPlaying, options);
    const data = await response.json(); 
    return data;
  }catch(error){
    console.error('Error:', error);
    throw error;
  }
};

//熱門電影
const getPopular = async(page) => {
    const urlPopular = `https://api.themoviedb.org/3/movie/popular?language=zh-TW&page=${page}`
    try{
        const response = await fetch(urlPopular, options);
        const data = await response.json(); 
        return data;
      }catch(error){
        console.error('Error:', error);
        throw error;
      }
};

//即將播出電影
const getUpcoming = async(page) => {
    const currentDate = new Date().toISOString().split('T')[0]; // 獲取當前日期，格式為 'YYYY-MM-DD'
    const urlPopular = `https://api.themoviedb.org/3/movie/upcoming?language=zh-TW&page=${page}&region=US&primary_release_date.gte=${currentDate}`
    try{
        const response = await fetch(urlPopular, options);
        const data = await response.json(); 
        return data;
      }catch(error){
        console.error('Error:', error);
        throw error;
      }
};

//搜尋
const getSearch = async(keyword, page) => {
  const urlSearch = `https://api.themoviedb.org/3/search/movie?query=${keyword}&language=zh-TW&page=${page}`
  try{
    const response = await fetch(urlSearch, options);
    const data = await response.json(); 
    return data;
  }catch(error){
    console.error('Error:', error);
    throw error;
  }
}

//電影分類
const getGenre = async(page,genreid) => {
  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=zh-TW&page=${page}&sort_by=popularity.desc&with_genres=${genreid}`
  try{
      const response = await fetch(url, options);
      const data = await response.json(); 
      return data;
    }catch(error){
      console.error('Error:', error);
      throw error;
    }
};

//(會員)觀看電影列表
const getWatchList = async(accountid, page) =>{
  const url = `https://api.themoviedb.org/3/account/${accountid}/watchlist/movies?language=zh-TW&page=${page}&sort_by=created_at.asc`
  try{
    const response = await fetch(url, options);
    const data = await response.json(); 
    return data;
  }catch(error){
    console.error('Error:', error);
    throw error;
  }
}


//(會員)增加電影到觀看電影列表
const addToWatchList = async(accountid, mediaId) => {
  const url = `https://api.themoviedb.org/3/account/${accountid}/watchlist`
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: process.env.AUTHORIZATION
    },
    body: JSON.stringify({
      media_type: 'movie',
      media_id: mediaId,
      watchlist: true
    })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ message: 'Failed to add to watchlist' });
  }
}
//(會員)刪除觀看電影列表中的電影
const deleteWatchList = async(accountid, mediaId) => {
  const url = `https://api.themoviedb.org/3/account/${accountid}/watchlist`
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: process.env.AUTHORIZATION
    },
    body: JSON.stringify({
      media_type: 'movie',
      media_id: mediaId,
      watchlist: false
    })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ message: 'Failed to add to watchlist' });
  }
}

//授權碼登入
//step 1: 創建Request Token
const createToken = async() => {
  const url = 'https://api.themoviedb.org/3/authentication/token/new'
  try{
    const response = await fetch(url, options);
    const data = await response.json(); 
    return data.request_token;
  }catch(error){
    console.error('Error:', error);
    throw error;
  }
}
//step 2: 創建Session id
const createSession = async (requestToken) => {
  const url = `https://api.themoviedb.org/3/authentication/session/new`;
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: process.env.AUTHORIZATION
    },
    body: JSON.stringify({
      request_token: requestToken
    })
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return data.session_id;
};
//step 3: 使用 session_id 取得 account_id
const getAccountId = async (sessionId) => {
  const url =`https://api.themoviedb.org/3/account?session_id=${sessionId}`
  const response = await fetch(url, options);
  const data = await response.json();
  return data.id;
};

module.exports = { getNowPlaying, getPopular, getUpcoming, getSearch, createToken, createSession, getAccountId, getWatchList, addToWatchList, deleteWatchList, getGenre };