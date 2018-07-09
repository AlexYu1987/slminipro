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
  data: {
    badge_order: 0,
    badge_pay: 0
  },
  onLoad: function() {

  },

  onShow() {
    const userinfo = wx.getStorageSync('userinfo')
    const that = this
    this.setData({
      userinfo: userinfo
    })

    if (userinfo.role === 'user') {
      var data = {
        userOpenId: userinfo.openId
      }
    }
    qcloud.request({
      url: countUncompliteOrderUrl,
      data: data ? data : {},
      success: function(res) {
        that.setData({
          badge_order: res.data.data
        })
      },
      fail: function(res) {
        wx.showModal({
          title: '获取订单数失败',
          content: res.error || res.errMsg,
        })
      }
    })
  }
})