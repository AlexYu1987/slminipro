/* 
 * Define sequelize(an ORM middleware) models
 * Created by: Alex.Y (6/13/2018)
 */

module.exports = function(sequelize, Sequelize) {
  if (arguments.length < 2) throw new Error('arguments can not less 3.')

  this.Address = sequelize.define('address', {
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
    }});

  this.User = sequelize.define('user', {
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
    }
    // 'addressId': {
    //   'type': Sequelize.UUID,
    //   'references': {
    //     'model': this.Address,
    //     'key': 'id'
    //   }
    });

  this.Express = sequelize.define('Express', {
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
    // 'orderId': {
    //   'type': Sequelize.UUID,
    //   'references': {
    //     'model': this.Order,
    //     'key': 'id'
    //   }
    // }
  });

  this.Commodity = sequelize.define('commodity', {
    'id': {
      'type': Sequelize.UUID,
      'primaryKey': true,
      'defaultValue': Sequelize.UUIDV1
    },
    'bigPic': Sequelize.STRING,
    'smallPic': Sequelize.STRING,
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
  });

  this.Details = sequelize.define('details', {
    'id': {
      'type': Sequelize.UUID,
      'primaryKey': true,
      'defaultValue': Sequelize.UUIDV1
    },
    // 'orderId': {
    //   'type': Sequelize.UUID,
    //   'references': {
    //     'model': this.Order,
    //     'key': 'id'
    //   }
    // },
    // 'commodityId': {
    //   'type': Sequelize.UUID,
    //   'references': {
    //     'model': this.Commodity,
    //     'key': 'id'
    //   }
    // },
    'count': {
      'type': Sequelize.INTEGER,
      'allowNull': false,
      'validate': {
        min: 1
      }
    }
  });

  this.Order = sequelize.define('order', {
    'id': {
      'type': Sequelize.UUID,
      'primaryKey': true,
      'defaultValue': Sequelize.UUIDV1
    },
    // 'userId': {
    //   'type': Sequelize.UUID,
    //   'references': {
    //     'model': this.User,
    //     'key': 'id'
    //   }
    // },
    'status': {
      'type': Sequelize.ENUM('waitting', 'processing', 'completing'),
      'allowNull': false,
      'defaultValue': 'waitting'
    },
    'isSF': {
      'type': Sequelize.BOOLEAN,
      'defaultValue': false
    },
    'note': Sequelize.TEXT
    // 'expressId': {
    //   'type': Sequelize.UUID,
    //   'references': {
    //     'model': this.Express,
    //     'key': 'id'
    //   }
    // },
    // 'addressId': {
    //   'type': Sequelize.UUID,
    //   'references': {
    //     'model': this.Address,
    //     'key': 'id'
    //   }
    // }
  });

  //define associations
  this.User.hasOne(this.Address)
  this.User.hasMany(this.Order)
  this.Order.hasOne(this.Address)
  this.Order.hasOne(this.Express)
  this.Order.hasMany(this.Details)
  this.Details.hasOne(this.Commodity)

  this.buildTable = () => sequelize.sync()
  this.rebuildTable = () => sequelize.sync({force: true})
}