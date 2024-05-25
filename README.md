# Bloggy App

Project aims to create a Milestone Blog App.


## Project Skeleton


```
 Blogg App

|----readme.md         
SOLUTION
├── src
|    ├── index.css
|    ├── index.js
|    ├── App.css
|    ├── App.js
|    ├── app
|    │   └── store.jsx
|    ├── assets
|    │   ├── about.png
|    ├── components
|    │   ├── auth
|    │   │   ├── LoginFom.jsx
|    │   │   └── RegisterForm.jsx
|    │   ├── blog
|    │   │   ├── Card.jsx
|    │   │   ├── CommentCard.jsx
|    │   │   ├── CommentForm.jsx
|    │   │   ├── DeleteModal.jsx
|    │   │   └── UpdateModal.jsx
|    │   ├── FooTer.jsx
|    │   ├── NavBar.jsx
|    ├── features
|    │   ├── authSlice.jsx
|    │   └── blogSlice.jsx
|    ├── helper
|    │   └── ToastNotify.jsx
|    ├── hooks
|    │   ├── useAuthCalls.jsx
|    │   ├── useAxios.jsx
|    │   └── useBlogCalls.jsx
|    ├── pages
|    │   ├── About.jsx
|    │   ├── Dashboard.jsx
|    │   ├── Detail.jsx
|    │   ├── Login.jsx
|    │   ├── NewBlog.jsx
|    │   ├── NotFound.jsx
|    │   ├── Profile.jsx
|    │   └── Register.jsx
|    └── router
|        ├── AppRouter.jsx
|        └── PrivateRouter.jsx
```

## Expected Outcome

![Blog App]()



## Steps to Solution

- Step 1 : Create React App using `npx create-react-app milestone-blog-app`

- Step 2 : Use NodeSs backend for authentication and CRUD operations.

- Step 4 : You can view sample app on https://milestone-blogapp-cw.vercel.app/.


## Bonus

- [React Helmet](https://www.npmjs.com/package/react-helmet)
- [Open Graph](https://medium.com/@muhammederdinc/open-graph-protokol%C3%BC-nedir-2c61f1454526)

## Demo

[Milestone Blog App](https://milestone-blogapp-cw.vercel.app/)


## API


```
  login => auth/login/
  register => users/
  logout => auth/logout/
```

- Post Read/List

```javascript
    // Pagination yapısı backend tarafından ayarlandı. page bilgisi gelen response ta var oradan kaç sayfa olduğunu yakalayabilirsiniz. Default olarak her sayfada 25 veri sergileniyor. Bunu manuel olarak istek atarken ayarlayabilirsiniz. Örneğin;
    //?page=1&limit=10

  endpoints => blogs?page=1
  method: GET
  no authentication
  comments, countOfVisitors ve likes bilgileri response da dönüyor buradan alarak sayıları/uzunluklarını kullanabilirsiniz.
```

- Post Create

```javascript
  endpoints => blogs
  method: POST
  headers: {"Authorization":`Token ${yourtoken}`}

  body: {
      "title": "Topkapı Sarayı",
      "content": "Topkapı Sarayı (Osmanlı Türkçesi: طوپقپو سرايى), İstanbul Sarayburnu'nda, Osmanlı             İmparatorluğu'nun 600 yıllık tarihinin 400 yılı boyunca, devletin idare merkezi olarak kullanılan ve Osmanlı padişahlarının yaşadığı saraydır. Bir zamanlar içinde 4.000'e yakın insan yaşamıştır.\n Topkapı Sarayı Fatih Sultan Mehmed tarafından 1478’de yaptırılmış, Abdülmecid’in Dolmabahçe Sarayı’nı yaptırmasına kadar yaklaşık 380 sene boyunca devletin idare merkezi ve Osmanlı padişahlarının resmi ikâmetgâhı olmuştur. Kuruluş yıllarında yaklaşık 700.000 m²'lik bir alanda yer alan sarayın bugünkü alanı 80.000 m²'dir.\nopkapı Sarayı, saray halkının Dolmabahçe Sarayı, Yıldız Sarayı ve diğer saraylarda yaşamaya başlaması ile birlikte boşaltılmıştır. Padişahlar tarafından terk edildikten sonra da içinde birçok görevlinin yaşadığı Topkapı Sarayı hiçbir zaman önemini kaybetmemiştir. Saray zaman zaman onarılmıştır. Ramazan ayı içerisinde padişah ve ailesi tarafından ziyaret edilen Kutsal Emanetler'in bulunduğu Hırka-i Saadet Dairesi’nin her yıl bakımının yapılmasına ayrı bir önem verilmiştir.",
      "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Topkapi_Palace_Seen_From_Harem.JPG/270px-Topkapi_Palace_Seen_From_Harem.JPG",
      "categoryId": "6591ef8d26959a81bce92d5a",
      "isPublished": "true"
}
    // yukarıdaki verileri göndermeniz yeterli olacaktır
.
    category endpoints => "categories"
    isPublished => {
      "false":"draft",
      "true":"published"
    }

```

- Post Update

```json
  endpoints => blogs/{post_id} //blogs/6596a348fe3c4517336492eb
  method: PUT
  headers: {"Authorization":`Token ${yourtoken}`}

  body: {
      "_id": "6596a348fe3c4517336492eb",
      "userId": "6596a2a7fe3c4517336492ce",
      "categoryId": "6591ef8d26959a81bce92d5a",
      "title": "Topkapı Sarayı!",
      "content": "Topkapı Sarayı (Osmanlı Türkçesi: طوپقپو سرايى), İstanbul Sarayburnu'nda, Osmanlı İmparatorluğu'nun 600 yıllık tarihinin 400 yılı boyunca, devletin idare merkezi olarak kullanılan ve Osmanlı padişahlarının yaşadığı saraydır. Bir zamanlar içinde 4.000'e yakın insan yaşamıştır.\n Topkapı Sarayı Fatih Sultan Mehmed tarafından 1478’de yaptırılmış, Abdülmecid’in Dolmabahçe Sarayı’nı yaptırmasına kadar yaklaşık 380 sene boyunca devletin idare merkezi ve Osmanlı padişahlarının resmi ikâmetgâhı olmuştur. Kuruluş yıllarında yaklaşık 700.000 m²'lik bir alanda yer alan sarayın bugünkü alanı 80.000 m²'dir.\nopkapı Sarayı, saray halkının Dolmabahçe Sarayı, Yıldız Sarayı ve diğer saraylarda yaşamaya başlaması ile birlikte boşaltılmıştır. Padişahlar tarafından terk edildikten sonra da içinde birçok görevlinin yaşadığı Topkapı Sarayı hiçbir zaman önemini kaybetmemiştir. Saray zaman zaman onarılmıştır. Ramazan ayı içerisinde padişah ve ailesi tarafından ziyaret edilen Kutsal Emanetler'in bulunduğu Hırka-i Saadet Dairesi’nin her yıl bakımının yapılmasına ayrı bir önem verilmiştir.",
      "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Topkapi_Palace_Seen_From_Harem.JPG/270px-Topkapi_Palace_Seen_From_Harem.JPG",
      "isPublish": true
}

    category endpoints => "categories"
    isPublished => {
      "false":"draft",
      "true":"published"
    }
```

- Post Delete

```javascript
  endpoints => blogs/{post_id} // blogs/6596a348fe3c4517336492eb
  method: DELETE
  headers: {"Authorization":`Token ${yourtoken}`}
```

- Comments Create

```javascript
  endpoints => comments
  method: POST
  headers: {"Authorization":`Token ${yourtoken}`}

  body:{
      "blogId": "6596a348fe3c4517336492eb",
      "comment": "Comment 1"
  }

```

- Likes Create or UnLike

```json
  endpoints => blogs/{post_id}/postLike // blogs/6596a348fe3c4517336492eb/postLike
  method: POST
  headers: {"Authorization":`Token ${yourtoken}`}
```

- Get Post Detail

```json
  endpoints => blogs/${post.id} // blogs/6591ef8d26959a81bce92d5d
  method: GET
  headers: {"Authorization":`Token ${yourtoken}`}
```

- User Blogs

```json
  endpoints => blogs?author=${user.id} // blogs?author=6596a2a7fe3c4517336492ce
  method: GET
  headers: {"Authorization":`Token ${yourtoken}`}
```



## Postman Documentation

[View Postman Documentation]()