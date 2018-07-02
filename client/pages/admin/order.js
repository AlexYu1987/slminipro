// pages/admin/order.js
const {
  service: {
    queryUncompliteOrdersUrl
  }
} = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    orders: []
  },

  onLoad: function() {
    const user = wx.getStorageSync('userinfo')
    this.setData({userinfo: user})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    qcloud.request({
      url: queryUncompliteOrdersUrl,
      success: function(res) {
        const orders = that.mapOrders2toast
        that.setData({orders: orders})
      },
      fail: function(res) {
        wx.showModal({
          title: '获取订单失败',
          content: res.data.error,
        })
      }
    })
  },

  mapOrders2toast(orders) {
    const toasts = orders.map(order => {
      const result = {}
      result.user = order.address.name
      result.phone = order.address.phone
      result.create = order.createdAt
      result.total = order.total
      result.details = ''
      order.details.forEach(detail => {
        details + `${order.details.commodity.name}(数量：${order.details.commodity.count})  `
      })
      return result
    })
    return toasts
  }
})