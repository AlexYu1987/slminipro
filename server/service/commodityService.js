/**
 * Commodity service
 * Created by: Alex.Y(2018/7/10)
 * Update by:
 */
const {
  Commodity
} = require('../db/models.js')

/**
 * Delete commodity by id.
 * Use sequelize soft delete.
 * @Param id required
 */
const deleteById = async function(id) {
  await Commodity.destroy({
    where: {
      id: id
    }
  })
}
module.exports = {
  deleteById
}