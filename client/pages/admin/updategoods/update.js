// pages/admin/updategoods/update.js
const qcloud = require('../../../vendor/wafer2-client-sdk/index.js')
const {
  service: {
    delCommodityUrl,
    queryAllCommodityUrl,
  }
} = require('../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that =  this
    qcloud.query({
      url: queryAllCommodityUrl,
      success: (res) => {
        that.setData({goodsList: res.data.data})
      },
      fail: (res) => {
        wx.showModal({
          title: '查询商品异常',
          content: res.errMsg,
        })
      }
    })
  },

  delGoods: function(e) {
    const that = this
    const id = e.currentTarget.id

    qcloud({
      url: delCommodityUrl,
      method: 'POST',
      data: {id: id},

      success: res => {
        wx.showToast({
          title: '下架成功',
          success: () => {
            that.onLoad()
          }
        })      
      },

      fail: res => {
        wx.showModal({
          title: '无法下架商品',
          content: res.errMsg,
        })
      }
    })
  }
})