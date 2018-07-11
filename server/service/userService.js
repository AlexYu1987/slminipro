/**
 * User service
 * Created by: Alex.Y (2018/7/10)
 * Updated by:
 */

const {
  User,
  sequelize,
} = require('../db/models.js')

const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

/**
 * Update user's balance and discount by openId
 * @param openId required
 * @param [balance, discount] optional
 */
const updateUserById = async function(openId, balance, discount) {
  const updateOpt = {}
  if (balance) {
    updateOpt.balance = balance
  }

  if (discount) {
    updateOpt.discount = discount
  }

  await User.update(updateOpt, {
    where: {
      openId: openId
    }
  })
}

/**
 * Find all users.
 * @param [offset, limit] required
 * return raw types
 */
const pagedFind = async function(offset, limit) {
  let queryClause = 'SELECT a.open_id AS openId, a.user_info AS userInfo, b.balance AS balance, b.discount AS discount, \
    b.role AS role From cSessionInfo a INNER JOIN users b ON(a.open_id = b.openId) LIMIT ?, ?'

  let users = await sequelize.query(queryClause, {
    type: sequelize.QueryTypes.SELECT,
    replacements: [offset, limit]
  })

  return users
}

module.exports = {
  updateById,
  findAll
}