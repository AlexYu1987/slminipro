// page/component/new-pages/user/user.js
const {
  service: {
    queryUncompliteOrdersUrl,
    countUncompliteOrderUrl
  }
} = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const util = require('../../utils/util.js')

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
          let orders = res.data.data
          that.mapOrders2toast(orders)
        },
        fail: function(res) {
          wx.showModal({
            title: '获取订单失败',
            content: res.error || res.errMsg,
          })
        }
      })
      
    } else if (userinfo.role === 'admin') {
      qcloud.request({
        url: countUncompliteOrderUrl,
        success: function(res) {
          that.setData({badge:res.data.data})
        },
        fail: function(res) {
          wx.showModal({
            title: '获取订单数失败',
            content: res.error || res.errMsg,
          })
        }
      })
    }
  },

  mapOrders2toast(orders) {
    const toasts = orders.map(order => {
      let list = ''
      order.details.forEach(detail => {
        list += `${detail.commodity.name}X${detail.count}) `
      })
      order.list = list
      order.createdAt = util.dataTimeFormatter(order.createdAt)
      return order
    })
    this.setData({orders: toasts})
  }
})