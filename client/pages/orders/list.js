const {
  service: {
    queryOrderUrl,
    countUncompliteOrderUrl
  }
} = require('../../config.js')

const qcloud = require('../../vendor/wafer2-client-sdk/index')
const util = require('../../utils/util.js')
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

// pages/orders/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      condition: 'waitting',
      title: '待发货订单'
    }, {
      condition: 'cancel',
      title: '被取消订单'
    }, {
      condition: '',
      title: '所有订单'
    }],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    page: 0,
    pageSize: 100,
    orders: []
  },

  tabClick: function(e) {
    if(this.data.activeIndex == e.currentTarget.id) return

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    this.refresh()
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
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          userinfo: wx.getStorageSync('userinfo')
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    getList(getCondition(this), this)
  },

  bindDownLoad: function() {
    getList(getCondition(this), this)
  },

  scroll: function(event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    })
  },

  refresh: function(event) {
    this.setData({
      page: 1,
      scrollTop: 0,
      orders: []
    })
    getList(getCondition(this), this)
  },

  processOrder: function(event) {
    wx.showModal({
      title: ''
    })
  },

  rollbackOrder: function(event) {

  }
})

const getList = function(condition, that) {
  that.setData({
    hidden: false
  })
  const userinfo = that.data.userinfo
  const data = {}
  if (userinfo.role === 'user') {
    data.userOpenId = userinfo.openId
  }
  if (condition && condition.length > 0) {
    data.condition = condition
  }
  data.offset = that.data.page * that.data.pageSize
  data.limit = that.data.pageSize

  qcloud.request({
    url: queryOrderUrl,
    data: data,
    success: function(res) {
      let orders = that.data.orders
      orders.push(...res.data.data)
      that.setData({
        orders: orders,
        hidden: true,
        page: that.data.page + 1
      })
    },
    fail: function(res) {
      wx.showModal({
        title: '加载失败',
        content: res.error || res.errMsg,
        success: () => {
          that.setData({
            hidden: true
          })
        }
      })
    }
  })
}

const getCondition = function(that) {
  return that.data.tabs[that.data.activeIndex].condition
}