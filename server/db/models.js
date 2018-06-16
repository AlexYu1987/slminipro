/* 
 * Define models
 * Created by: Alex.Y (6/13/2018)
 */

const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  //mysql configuration
});

const User = sequelize.define('user', {
  'id': {
    'type': Sequelize.UUID,
    'primaryKey': true,
    'defaultValue': Sequelize.UUIDV1
  },
  'nickname': {
    'type': Sequelize.STRING,
    'allowNull': false
  },
  'openID': {
    'type': Sequelize.STRING,
  },
  'balance': {
    'type': Sequelize.FLOAT,
    'defaultValue': 0,
    'validate': {
      'min': 0
    }
  },
  'discount': {
    'type': Sequelize.FLOAT,
    'defaultValue': 1.0,
    'validate': {
      'min': 0,
      'max': 1
    }
  },
  'addressID': {
    'type': Sequelize.STRING,
    'references': {
      'model': Address,
      'key': 'id'
    }
  }
}, {
  'tableName': 'user'
});

const Address = sequelize.define('address', {
  'id': {
    'type': Sequelize.UUID,
    'primaryKey': true,
    'defaultValue': Sequelize.UUIDV1
  },
  'name': {
    'type': Sequelize.STRING,
    'allowNull': false
  },
  'gender': {
    'type': Sequelize.ENUM('value 1', 'value 2'),
    'allowNull': false
  },
  'province': {
    'type': Sequelize.STRING,
    'allowNull': false
  },
  'city': {
    'type': Sequelize.STRING,
    'allowNull': false
  },
  'street': {
    'type': Sequelize.STRING,
    'allowNull': false
  },
  'phone': {
    'type': Sequelize.STRING,
    'allowNull': false
  }
},{
  'tableName': 'address'
});

