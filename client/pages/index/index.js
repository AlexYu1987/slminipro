/*
 * index page controller
 * Created by: Alex.Y
 * From 2018/6/19
 */

const qcloud = require('../../vendor/wafer2-client-sdk/index')
const {service: {queryAllCommodityUrl}} = require('../../config')
const {showSuccess, showModal, showBusy} = require('../../utils/util.js')

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

  onLoad: function () {
    //获取商品列表
    let that = this
    wx.request({
      url: queryAllCommodityUrl,
      method: 'GET',

      success: function(res) {
        let result = res.data
        if(result.code == 500) {
          showModal('无法获取商品列表', result.error.message)
          return
        }
        
        that.setData({selectedList: result.data})
      },

      fail: function(res) {
        showModal('无法获取商品列表')
      }
    })
  }
})