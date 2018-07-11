// pages/admin/send/send.js
const qcloud = require('../../../vendor/wafer2-client-sdk/index.js')

const {
  service: {
    processOrderUrl,
  }
} = require('../../../config.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    orderId: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {
      orderId,
      address
    } = options

    let add = JSON.parse(address)
    this.setData({
      address: add,
      orderId: orderId
    })
  },

  processOrder: function(e) {
    const that = this
    const data = {
      orderId: this.data.orderId,
      company: e.detail.value['company'],
      num: e.detail.value['num'],
      fee: e.detail.value['fee']
    }

    wx.showModal({
      title: '确认发货',
      content: '快递费将从用户账户中扣除',
      success: function() {
        qcloud.request({
          url: processOrderUrl,
          data: data,
          success: () => {
            wx.showToast({
              title: '发货成功',
              success: () => {
                setTimeout(wx.navigateBack, 2000)
              }
            })
          },

          fail: (res) => {
            wx.showModal({
              title: '发货失败',
              content: res.data.errMsg,
            })
          },
        })
      }
    })
  },

  copyAddress: function() {
    const address = this.data.address
    const data = `${address.provinceName} ${address.cityName} ${address.distribute} 
      ${address.street} ${address.name} 收 电话：${address.phone}`

    wx.setClipboardData({
      data: data,
      success: () => {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  }
})