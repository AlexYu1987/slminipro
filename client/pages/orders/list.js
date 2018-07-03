const {
  service: {
    queryUncompliteOrdersUrl,
    countUncompliteOrderUrl
  }
} = require('../../config.js')

const qcloud = require('../../vendor/wafer2-client-sdk/index')

const util = require('../../utils/util.js')

// pages/orders/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    pageSize: 5,
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight,
          userinfo: wx.getStorageSync('userinfo')
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    getList(this)
  },

  bindDownLoad: function() {
    getList(this)
  },

  scroll: function(event) {
    this.setData({scrollTop: event.detail.scrollTop})
  },

  refresh: function(event) {
    this.setData({
      page: 1,
      scrollTop: 0,
      orders: []
    })
  }
})

const getList = function(that) {
  that.setData({hidden: false})
  const userinfo = that.data.userinfo
  const data = {}
  if (userinfo.role === 'user') {
    data.userOpenId = userinfo.openId
  }
  data.offset = that.data.page * that.data.pageSize
  data.limit = that.data.pageSize

  qcloud.request({
    url: queryUncompliteOrdersUrl,
    data: data,
    success: function (res) {
      let orders = that.data.orders
      orders.push(...res.data.data)
      that.setData({
        orders: orders,
        hidden: true,
        page : that.data.page + 1
      })
    },
    fail: function (res) {
      wx.showModal({
        title: '加载失败',
        content: res.error || res.errMsg,
      })
    }
  })
}