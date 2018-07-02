// pages/admin/express.js
const {
  service: {
    queryOrderById
  }
} = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    const that = this
    qcloud.request({
      url: queryOrderById,
      data: {id: id},
      success: function(res) {
        const order = res.data
        const result = {}
        result.user = order.address.name
        result.phone = order.address.phone
        result.create = order.createdAt
        result.total = order.total
        result.details = ''
        order.details.forEach(detail => {
          details + `${order.details.commodity.name}(数量：${order.details.commodity.count})  `
        })
        that.setData({order: result})
      },
      fail: function(res) {
        wx.showModal({
          title: '无法获取订单详情',
          content: res.data.error.message,
        })
      }
    })
  }
})