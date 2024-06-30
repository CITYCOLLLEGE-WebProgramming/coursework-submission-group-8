const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('recipeweb', 'root', null, {
  host: 'localhost',
  dialect: 'mysql'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user.model.js')(sequelize, Sequelize);
db.recipes = require('./recipe.model.js')(sequelize, Sequelize);
db.comments = require('./comment.model.js')(sequelize, Sequelize);
db.categories = require('./categories.model.js')(sequelize, Sequelize);

db.users.hasMany(db.recipes, { foreignKey: 'user_id' });
db.recipes.belongsTo(db.users, { foreignKey: 'user_id' });

db.categories.hasMany(db.recipes, { foreignKey: 'category_id' });
db.recipes.belongsTo(db.categories, { foreignKey: 'category_id' });

db.recipes.hasMany(db.comments, { foreignKey: 'recipe_id' });
db.comments.belongsTo(db.recipes, { foreignKey: 'recipe_id' });

db.users.hasMany(db.comments, { foreignKey: 'user_id' });
db.comments.belongsTo(db.users, { foreignKey: 'user_id' });

module.exports = db;