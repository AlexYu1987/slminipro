/* 
 * Define sequelize(an ORM middleware) models
 * Created by: Alex.Y (6/13/2018)
 * Updated by: Alex.Y (6/28/2018)
 */
const Sequelize = require('sequelize')
const {
  mysql: config
} = require('../config.js')

const sequelize = new Sequelize(config.db, config.user, config.pass, {
  dialect: 'mysql'
})

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
    'type': Sequelize.ENUM('male', 'female'),
    'defaultValue': 'male',
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
  'distribute': {
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
  },
  'poscode': Sequelize.STRING
});

const User = sequelize.define('user', {
  'openId': {
    'type': Sequelize.STRING(100),
    'primaryKey': true,
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
  'role': {
    'type': Sequelize.ENUM('visitor', 'user', 'admin'),
    'defaultValue': 'visitor'
  }

});

const Express = sequelize.define('express', {
  'id': {
    'type': Sequelize.UUID,
    'primaryKey': true,
    'defauleValue': Sequelize.UUIDV1
  },
  'company': {
    'type': Sequelize.STRING,
    'allowNull': false
  },
  'number': {
    'type': Sequelize.STRING,
    'allowNull': false
  },
  'fee': {
    'type': Sequelize.FLOAT,
    'allowNull': false
  }
});

const Commodity = sequelize.define('commodity', {
  'id': {
    'type': Sequelize.UUID,
    'primaryKey': true,
    'defaultValue': Sequelize.UUIDV1
  },
  'picUrl': Sequelize.STRING,
  'name': {
    'type': Sequelize.STRING,
    'allowNull': false
  },
  'discription': Sequelize.TEXT,
  'param': Sequelize.TEXT,
  'ensure': Sequelize.TEXT,
  'price': {
    'type': Sequelize.FLOAT,
    'allowNull': false
  }
}, {
  paranoid: true
});

const Details = sequelize.define('details', {
  'id': {
    'type': Sequelize.UUID,
    'primaryKey': true,
    'defaultValue': Sequelize.UUIDV1
  },
  'count': {
    'type': Sequelize.INTEGER,
    'allowNull': false,
    'validate': {
      min: 1
    }
  }
});

const Order = sequelize.define('order', {
  'id': {
    'type': Sequelize.UUID,
    'primaryKey': true,
    'defaultValue': Sequelize.UUIDV1
  },
  'status': {
    'type': Sequelize.ENUM('waitting', 'processing', 'completing'),
    'allowNull': false,
    'defaultValue': 'waitting'
  },
  'isSF': {
    'type': Sequelize.BOOLEAN,
    'defaultValue': true
  },
  'note': Sequelize.TEXT,
  'total': {
    'type': Sequelize.FLOAT,
    'allowNull': false
  }
});

//define associations
User.belongsTo(Address)
User.hasMany(Order)
Order.belongsTo(Address)
Order.belongsTo(Express)
Order.hasMany(Details)
Details.belongsTo(Commodity)

module.exports = {
  User,
  Address,
  Express,
  Commodity,
  Order,
  Details,
  Sequelize,
  sequelize,
  buildAll: () => sequelize.sync(),
  rebuildAll: () => sequelize.sync({
    force: true
  })
}