## movieBackend
本專案透過後端串接TMDB API並傳送數據給前端，並使用TMDB第三方登入

### Demo
網站入口: https://fang-ting-chen.github.io/movieweb-frontend/  
前端專案: https://github.com/Fang-Ting-Chen/movieweb-frontend

### 雲端託管
MongoDB Atlas MongoDB雲端資料庫服務，儲存session  
Render 部署API Server

### 主要技術
+ Node.js
+ express
+ express-session
+ Mongoose
+ cors
+ RESTful API

### api
| base route | routes | HTTP method | feature |
| :--: | :--: | :--: | :--: |
| /movie | /nowplaying/:page | get | 取得上映電影數據 |
| /movie | /popular/:page | get | 取得熱門電影數據 |
| /movie | /upcoming/:page | get | 取得即將上映電影數據 |
| /movie | /search/:keyword/:page | get | 取得搜尋到的電影數據 |
| /movie | /genre/:page/:genreid  | get | 取得電影分類數據 |
| /movie | /login | get | 登入 |
| /movie | /callback | get | 儲存sessionId、accountId並跳轉頁面到前端 |
| /movie | /logout | get | 登出 |
| /movie | /watchlist/:page | get | 取得(會員)觀看電影列表數據 |
| /movie | /addwatchlist | post | (會員)增加電影到觀看電影列表 |
| /movie | /deletewatchlist | post | (會員)刪除觀看電影列表中的電影 |
| /movie | /ckecklogin | get | 確認登入 |

### 聲明
本作品的圖片及內容皆為個人學習使用，無任何商業用途。
