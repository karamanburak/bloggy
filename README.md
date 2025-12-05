# Bloggy App

- [Bloggy App Live](https://bloggiie.vercel.app/)
- [Bloggy Api Live](https://bloggy-api-v8e5.onrender.com/)

## Description

📰 Bloggy app is a web page made with react. While previously written blogs can be viewed, favorite blogs can be added and removed. After logging in, the user can update their profile or create blogs that are not public.

## Features

- **User Authentication**: Users can sign up and log in to access the site.
- **Create Blog Posts**: Users can write new blog posts, save them as drafts, or publish them publicly.
- **Edit Profile**: Users can update their profile information.
- **Interact with Blogs**: Users can like/unlike blog posts and leave comments.
- **Drafts**: Users can save blog posts as drafts and view them on their private page.

## Tech Stack

- **Frontend**: React, Redux, Mui
- **Backend**: Node.js, Express
- **Authentication**: Token

## Installation

1. Clone the repository:

```
git clone https://github.com/karamanburak/bloggy-app.git
cd bloggy-app
```

2.  Install dependencies:

```
bun install
```

3. Set up environment variables:

Create a .env file in the root directory and add the following:

```
VITE_BASE_URL =
VITE_WEATHER_apiKey =
```

4. Run the development server:

```
bun run dev
```

# Usage

### Register and Login

1. Navigate to the registration page to create a new account.
2. After registering, log in with your new account credentials.

### Creating a Blog Post

1. After logging in, navigate to the "Blogs" page.
2. Write your blog post in the provided editor.
3. Choose to save the post as a draft or publish it publicly.

### Managing Blog Posts

- Drafts: View and edit your drafts from your profile page.
- Public Posts: Edit or delete your public posts.

### Interacting with Other Users

- Like/Unlike: Click the like button on a blog post to like or unlike it.
- Comments: Leave comments on blog posts to engage with other users.

## Project Skeleton

```
- Bloggy App (folder)
|
|
SOLUTION
├── public
├── src
|    ├── app
|    │   └── store.jsx
|    ├── assets
|    │   └── [images]
|    ├── components
|    │   ├── auth
|    │   │   ├── Information.jsx
|    │   │   ├── LoginForm.jsx
|    │   │   └── RegisterForm.jsx
|    │   ├── blog
|    │   │   ├── BlogCard.jsx
|    │   │   ├── BlogModal.jsx
|    │   │   ├── CommentForm.jsx
|    │   │   ├── DeleteBlog.jsx
|    │   │   ├── EditBlog.jsx
|    │   │   ├── Editor.jsx
|    │   │   ├── NewBlog.jsx
|    │   │   ├── SocialShare.jsx
|    │   │   ├── TinyMCE.jsx
|    │   │   └── TrendBlog.jsx
|    │   ├── global
|    │   │   ├── AuthImage.jsx
|    │   │   └── Navbar.jsx
|    │   ├── home
|    │   │   ├── CustomSwiper.jsx
|    │   │   ├── Footer.jsx
|    │   │   ├── HomeCard.jsx
|    │   │   ├── NewsCard.jsx
|    │   │   ├── PageHeader.jsx
|    │   │   ├── Quotes.jsx
|    │   │   ├── ShowsCard.jsx
|    │   │   └── WeatherCard.jsx
|    │   ├── profile
|    │   │   ├── MyBlogsCard.jsx
|    │   │   ├── MyBlogsContainer.jsx
|    │   │   └── UpdateProfileModal.jsx
|    ├── features
|    │   │   ├── autSlice.jsx
|    │   │   ├── blogSlice.jsx
|    │   │   ├── categorySlice.jsx
|    │   │   └── newsShowsSlice.jsx
|    ├── helper
|    │   │   └── ToastNotify.js
|    ├── hooks
|    │   │   ├── useAuthCall.jsx
|    │   │   ├── useAxios.jsx
|    │   │   ├── useBlogCall.jsx
|    │   │   ├── useCategoryCall.jsx
|    │   │   └── useNewsCall.jsx
|    ├── pages
|    │   ├── About.jsx
|    │   ├── Blogs.jsx
|    │   ├── Dashboard.jsx
|    │   ├── Detail.jsx
|    │   ├── Login.jsx
|    │   ├── NotFound.jsx
|    │   ├── Profile.jsx
|    │   └── Register.jsx
|    ├── router
|    |   ├── AppRouter.jsx
|    |   └── PrivateRouter.jsx
|    ├── styles
|    |   ├── globalStyles.js
|    |   └── theme.js
|    ├── App.jsx
|    ├── main.jsx
|    ├── .gitignore
|    ├── frontend.env
|    ├── index.css
|    ├── index.html
|    ├── LICENSE
|    ├── package.json
|    ├── bun.lockb
|    ├── README.md
|    ├── vercel.json
└──   vite.config.js
```

 ## Outcome 

 ![Bloggy Gif](https://github.com/user-attachments/assets/1b87e17a-c46e-4958-8f7c-fea27a1a33b1) 

## Postman Documentation

[View Postman Documentation](https://documenter.getpostman.com/view/32987022/2sA3s9BnRX#677d706d-bc2c-401f-9808-d56288077f3a)
