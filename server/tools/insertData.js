/* 
 * Insert test data
 * Created by Alex.Y
 * Since: /2018/6/20/
 */

const { Commodity: Commodity } = require('../db/models.js')
//Create danhuangsu
for (let name of ['', '',]) {
  Commodity.create({ name: name, price: 82, })
}