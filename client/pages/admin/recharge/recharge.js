// pages/admin/recharge.js
const qcloud = require('../../../vendor/wafer2-client-sdk/index.js')
const {
  service: {
    getUserByIdUrl,
    updateUserByIdUrl,
  }
} = require('../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    const openId = options.openId

    qcloud.request({
      url: getUserByIdUrl,
      data: {openId: openId},

      success: (res) => {
        const result = res.data.data
        if (result.length > 0) {
          const users = result.map(user => {
            const u = {}
            const userInfo = JSON.parse(user.userInfo)
            u.nickName = userInfo.nickName
            u.avartaUrl = userInfo.avartaUrl
          })

          that.setData({user: users[0]})
        }
      },

      fail: (res => {
        wx.showModal({
          title: '获取用户信息失败',
          content: res.data.errMsg,
        })
      })
    })
  },

 updateUser: function(e) {
    const that = this
    const data = {openId: that.data.user.openId,
      balance: e.detail.value['balance'],
      discount: e.detail.value['discount']
    }
    qcloud.request({
      url: updateUserByIdUrl,
      method: 'POST',
      data: data,

      sucess: res => {
        wx.showToast({
          title: '充值成功',
          success: () => {
            setTimeout(wx.navigateBack, 2000)
          }
        })
      },

      fail: res => {
        wx.showModal({
          title: '充值失败',
          content: res.data.errMsg,
        })
      }
    })
 }
})