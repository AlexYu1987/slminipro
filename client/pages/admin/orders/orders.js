const qcloud = require('../../../vendor/wafer2-client-sdk/index.js')
const { service: { queryAllOrdersUrl}} = require('../../../config.js')
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    waitting: [],
    all: [],
    tabs: [{
      title: '待处理',
      condition:{status: 'waitting', orderBy: 'createdAt ASC'},
      page: 0,
      pageSize: 10,
      hidden: true,
      orders: [],
    }, {
      title: '所有订单',
      condition: { status: null, orderBy: 'createdAt DESC' },
      page: 0,
      pageSize: 10,
      hidden: true,
      orders: [],
    }],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
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
        })
      },
    })
  },

  onShow: function() {
    this.data.tabs.forEach(tab => getList(tab))
  },

  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
  },

  bindDownload: function(e) {
    const that = this
    const i = e.currentTarget.id
    const tab = this.data.tabs[i]
    getList(tab)
  },

  scroll: function(e) {
    const i = e.currentTarget.id
    const tab = this.data.tabs[i]  
    tab.scrollTop = e.detail.scrollTop
  },

  refresh: function(e) {
    const i = e.currentTarget.id
    const tab = this.data.tabs[i]
    tab.page = 0
    tab.scrollTop = 0
    tab.orders = []
    getList(tab)
  },
})

const getList = function(tab) {
  tab.hidden = false
  const data = {}

  if (tab.condition.status) {
    data.status = tab.condition.status
  }

  data.orderBy = tab.condition.orderBy
  data.offset = tab.page * tab.pageSize
  data.limit = tab.pageSize

  qcloud.request({
    url: queryAllOrdersUrl,
    data: data,

    success: res => {
      tab.page += 1
      tab.orders.push(...res.data.data)
      tab.hidden = true
    },

    fail: res => {
      wx.showModal({
        title: '加载失败',
        content: res.data.errMsg,
        success: () => {
          tab.hidden = true
        }
      })
    }
  })
}