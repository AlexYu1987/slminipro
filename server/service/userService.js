/**
 * User service
 * Created by: Alex.Y (2018/7/10)
 * Updated by:
 */

const {
  User
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
 * return raw types
 */
const pagedFindAll = async function(offset, limit) {
  const users = await findAll({
    raw: true,
    offset: offset,
    limit: limit,
  })
  return users
}

module.exports = {
  updateById,
  findAll
}