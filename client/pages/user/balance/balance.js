// pages/user/balance/balance.js
const {
  admins
} = require('../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const userinfo = wx.getStorageSync('userinfo')
    this.setData({
      user: userinfo,
      adminList: admins
    })
  },
})