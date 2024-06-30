// server.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./models');
const {
    getHome,
    getUsers,
    getRecipes,
    getComments,
    getCategories,
    getNewRecipe,
    postNewRecipe,
    getLogSig,
    postSignup,
    postLogin,
    logout,
    getRecipesByCategory,
    getRecipeById,
    getDashboard,
    getUserRecipes,
    getEditRecipe,
    postEditRecipe,
    postDeleteRecipe,
    getEditProfile,     // Import the new functions
    postEditProfile,
    postDeleteProfile
} = require('./functions');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// Middleware to make session data available to all templates
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

db.sequelize.sync().then(() => {
    console.log('Database synchronized');

    // Root route that redirects to /home
    app.get('/', (req, res) => {
        res.redirect('/home');
    });

    app.get('/home', getHome);
    app.get('/users', getUsers);
    app.get('/recipes', getRecipes);
    app.get('/comments', getComments);
    app.get('/categories', getCategories);
    app.get('/new-recipe', getNewRecipe);
    app.post('/new-recipe', postNewRecipe);

    // Add new routes for login/signup
    app.get('/logsig', getLogSig);
    app.post('/signup', postSignup);
    app.post('/login', postLogin);
    app.get('/logout', logout);

    app.get('/categories/:categoryId/recipes', getRecipesByCategory);
    app.get('/recipes/:id', getRecipeById);

    // Add the new route for dashboard
    app.get('/dashboard', getDashboard);
    
    // Add the new route for user recipes
    app.get('/user-recipes', getUserRecipes);

    // Add routes for editing and deleting recipes
    app.get('/edit-recipe/:id', getEditRecipe);
    app.post('/edit-recipe/:id', postEditRecipe);
    app.post('/delete-recipe/:id', postDeleteRecipe);

    // Add routes for editing and deleting profiles
    app.get('/edit-profile', getEditProfile);
    app.post('/edit-profile', postEditProfile);
    app.post('/delete-profile', postDeleteProfile);

    // Debug route to check session data
    app.get('/session-info', (req, res) => {
        res.json(req.session);
    });

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
