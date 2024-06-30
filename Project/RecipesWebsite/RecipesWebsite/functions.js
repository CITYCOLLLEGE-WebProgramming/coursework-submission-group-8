// functions.js
const db = require('./models');
const bcrypt = require('bcrypt');

const getHome = (req, res) => {
    res.render('home');
};

const getUsers = (req, res) => {
    db.users.findAll().then(users => {
        res.render('users', { users });
    }).catch(error => {
        console.error('Error fetching users:', error);
        res.status(500).send(error);
    });
};

const getRecipes = async (req, res) => {
    const sort = req.query.sort || 'relevance';
    const recipesPerPage = 6;
    const page = parseInt(req.query.page) || 1;
    let orderBy;

    switch (sort) {
        case 'dateAsc':
            orderBy = 'created_at ASC';
            break;
        case 'dateDesc':
            orderBy = 'created_at DESC';
            break;
        case 'relevance':
        default:
            orderBy = 'average_rating DESC';
            break;
    }

    try {
        const [recipes, metadata] = await db.sequelize.query(`SELECT * FROM recipes_with_ratings ORDER BY ${orderBy}`);
        
        const startIndex = (page - 1) * recipesPerPage;
        const endIndex = page * recipesPerPage;
        const paginatedRecipes = recipes.slice(startIndex, endIndex);
        const totalPages = Math.ceil(recipes.length / recipesPerPage);

        res.render('recipes', { recipes: paginatedRecipes, sort, currentPage: page, totalPages });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getComments = (req, res) => {
    db.comments.findAll().then(comments => {
        res.render('comments', { comments });
    }).catch(error => {
        console.error('Error fetching comments:', error);
        res.status(500).send(error);
    });
};

const getCategories = (req, res) => {
    db.categories.findAll().then(categories => {
        res.render('categories', { categories });
    }).catch(error => {
        console.error('Error fetching categories:', error);
        res.status(500).send(error);
    });
};

const getNewRecipe = (req, res) => {
    db.categories.findAll().then(categories => {
        res.render('new-recipe', { categories });
    }).catch(error => {
        console.error('Error fetching categories:', error);
        res.status(500).send(error);
    });
};

const postNewRecipe = async (req, res) => {
    const { title, image_url, description, ingredients, category } = req.body;
    const userId = req.session.user.user_id; // Get the user ID from the session
    try {
        await db.recipes.create({ title, image_url, description, ingredients, category_id: category, user_id: userId });
        res.redirect('/recipes');
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).send('Error adding recipe');
    }
};

const getEditRecipe = async (req, res) => {
    const recipeId = req.params.id;
    try {
        const recipe = await db.recipes.findOne({ where: { recipe_id: recipeId } });
        const categories = await db.categories.findAll();
        res.render('edit-recipe', { recipe, categories });
    } catch (error) {
        console.error('Error fetching recipe for editing:', error);
        res.status(500).send('Error fetching recipe for editing');
    }
};

const postEditRecipe = async (req, res) => {
    const recipeId = req.params.id;
    const { title, image_url, description, ingredients, category } = req.body;
    try {
        await db.recipes.update(
            { title, image_url, description, ingredients, category_id: category },
            { where: { recipe_id: recipeId } }
        );
        res.redirect('/user-recipes');
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).send('Error updating recipe');
    }
};

const postDeleteRecipe = async (req, res) => {
    const recipeId = req.params.id;
    try {
        await db.recipes.destroy({ where: { recipe_id: recipeId } });
        res.redirect('/user-recipes');
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).send('Error deleting recipe');
    }
};

const getLogSig = (req, res) => {
    const showSignup = req.query.signup === 'true';
    res.render('logsig', { showSignup });
};

const postSignup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await db.users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await db.users.create({ username, email, password_hash: passwordHash });

        req.session.user = newUser;

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

const postLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    try {
        const user = await db.users.findOne({ where: { email } });
        if (!user) {
            console.log('User not found');
            return res.status(400).send('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).send('Invalid email or password');
        }

        req.session.user = user;
        console.log('Login successful, redirecting to home');

        res.redirect('/');
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Server error');
    }
};

const getRecipeById = async (req, res) => {
    const recipeId = req.params.id;
    try {
        const recipe = await db.recipes.findOne({ where: { recipe_id: recipeId } });
        res.render('show-recipe', { recipe });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).send('Error fetching recipe');
    }
};

const getRecipesByCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    const recipesPerPage = 6;
    const page = parseInt(req.query.page) || 1;

    try {
        const category = await db.categories.findByPk(categoryId);
        const recipes = await db.recipes.findAll({ where: { category_id: categoryId } });

        const startIndex = (page - 1) * recipesPerPage;
        const endIndex = page * recipesPerPage;
        const paginatedRecipes = recipes.slice(startIndex, endIndex);

        res.render('recipes-by-category', {
            category,
            recipes: paginatedRecipes,
            currentPage: page,
            totalPages: Math.ceil(recipes.length / recipesPerPage)
        });
    } catch (error) {
        console.error('Error fetching recipes by category:', error);
        res.status(500).send(error);
    }
};

const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
};

const getDashboard = (req, res) => {
    res.render('dashboard');
};

const getUserRecipes = async (req, res) => {
    const userId = req.session.user.user_id;
    try {
        const recipes = await db.recipes.findAll({ where: { user_id: userId } });
        res.render('user-recipes', { recipes });
    } catch (error) {
        console.error('Error fetching user recipes:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getEditProfile = (req, res) => {
    const userId = req.session.user.user_id;
    db.users.findOne({ where: { user_id: userId } }).then(user => {
        res.render('edit-profile', { user });
    }).catch(error => {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Error fetching user profile');
    });
};

const postEditProfile = async (req, res) => {
    const userId = req.session.user.user_id;
    const { username, email, password } = req.body;
    try {
        const updates = { username, email };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updates.password_hash = await bcrypt.hash(password, salt);
        }
        await db.users.update(updates, { where: { user_id: userId } });
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Error updating profile');
    }
};

const postDeleteProfile = async (req, res) => {
    const userId = req.session.user.user_id;
    try {
        await db.recipes.destroy({ where: { user_id: userId } });
        await db.users.destroy({ where: { user_id: userId } });
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Error logging out');
            }
            res.redirect('/');
        });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).send('Error deleting profile');
    }
};

module.exports = {
    getHome,
    getUsers,
    getRecipes,
    getRecipeById,
    getComments,
    getCategories,
    getNewRecipe,
    postNewRecipe,
    getLogSig,
    postSignup,
    postLogin,
    logout,
    getRecipesByCategory,
    getDashboard,
    getUserRecipes,
    getEditRecipe,
    postEditRecipe,
    postDeleteRecipe,
    getEditProfile,
    postEditProfile,
    postDeleteProfile
};
