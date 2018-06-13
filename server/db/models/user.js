/* 
 * User model define
 * Created by: Alex.Y (6/13/2018)
 */

module.exports = (sequelize, DataType) => {
  return sequelize.define('user', {
    id: {
      type: DataType.STRING,
      allowNull: false,
      primaryKey: true
    }
  });
}