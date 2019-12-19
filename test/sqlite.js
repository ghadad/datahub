const Sequelize= require("sequelize");
const sequelize = new Sequelize( {
    // sqlite! now!
    dialect: 'sqlite',
  
    // the storage engine for sqlite
    // - default ':memory:'
    storage: './database.sqlite'
  })
  var Users = sequelize.define('users', {
    title: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.STRING
    }
    }, {
     freezeTableName: true
   });

  sequelize.query("SELECT * FROM `users`", { type: sequelize.QueryTypes.SELECT})
  .then(users => {
    // We don't need spread here, since only the results will be returned for select queries
  })
