// page/component/new-pages/user/user.js
const {
  service: {
    queryUncompliteOrdersUrl,
    countUncompliteOrderUrl
  }
} = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index')

Page({
  data: {badge: 0},
  onLoad: function() {

  },

  onShow() {
    const userinfo = wx.getStorageSync('userinfo')
    const that = this
    this.setData({
      userinfo: userinfo
    })

    if (userinfo.role === 'user') {
      qcloud.request({
        url: queryUncompliteOrdersUrl,
        data: {
          userOpenId: userinfo.openId
        },
        success: function(res) {
          let orders = res.data
          that.mapOrders2toast(orders)
        },
        fail: function(res) {
          wx.showModal({
            title: '获取订单失败',
            content: res.data.error.message,
          })
        }
      })
      
    } else if (userinfo.role === 'admin') {
      qcloud.request({
        url: countUncompliteOrderUrl,
        success: function(res) {
          that.setData({badge:res.data})
        },
        fail: function(res) {
          wx.showModal({
            title: '获取订单数失败',
            content: res.error.message,
          })
        }
      })
    }
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

    this.setData({orders: toasts})
  }
})