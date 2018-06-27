/*
 * index page controller
 * Created by: Alex.Y
 * From 2018/6/19
 */

const qcloud = require('../../vendor/wafer2-client-sdk/index')

const {
  service: {
    queryAllCommodityUrl,
    loginUrl
  }
} = require('../../config')
const {
  showSuccess,
  showModal,
  showBusy
} = require('../../utils/util.js')

Page({
  data: {
    imgUrls: [
      '/images/b1.jpg',
      '/images/b2.jpg',
      '/images/b3.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  },

  onLoad: function() {
    qcloud.setLoginUrl(loginUrl)
    showBusy('正在登录')
    const session = qcloud.Session.get()
    let that = this

    if (session) {
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qcloud.loginWithCode({
        success: res => {
          wx.removeStorageSync('userinfo')
          wx.setStorageSync('userinfo',res)
          showSuccess('登录成功')
          that.fetchList(res.discount)
        },
        fail: err => {
          console.error(err)
          showModal('登录错误', err.message)
        }
      })
    } else {
      // 首次登录
      qcloud.login({
        success: res => {
          showSuccess('登录成功')
          wx.removeStorageSync('userinfo')
          wx.setStorageSync('userinfo',res)
          that.fetchList(res.discount)
        },
        fail: err => {
          console.error(err)
          showModal('登录错误', err.message)
        }
      })
    }
  },

  fetchList: function(discount) {
    //获取商品列表
    let that = this
    wx.request({
      url: queryAllCommodityUrl,
      method: 'GET',

      success: function (res) {
        let result = res.data
        if (result.code == 500) {
          showModal('无法获取商品列表', result.error.message)
          return
        }
        //根据用户折扣计算商品价格
        result.data.forEach(goods => {
          goods.price = goods.price * discount
        })
        that.setData({
          selectedList: result.data
        })
      },

      fail: function (res) {
        showModal('无法获取商品列表')
      }
    })
  }
})