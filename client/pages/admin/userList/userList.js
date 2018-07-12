// pages/admin/userList/userList.js
const qcloud = require('../../../vendor/wafer2-client-sdk/index.js')
const {
  service: {
    getAllUserPagedUrl,
    getUserByIdUrl,
  }
} = require('../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    users: [],
    page: 0,
    size: 10,
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
          hidden: false,
        })
      },
    })

    const users = that.data.users
    const result = queryAllUser(that.data.page, that.data.size, (res) => {
      const users = res.data.data
      let result = users.map(user => {
        return JSON.parse(user.userInfo)
      })

      if (result.length > 0) {
        that.data.page++
          users.push(result)
      }

      that.setData({
        users: users,
        hidden: true
      })
    })
  },

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });

    this.refresh()
  },

  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    this.refresh
  },

  inputTyping: function(e) {
    const that = this
    this.setData({
      inputVal: e.detail.value,
      hidden: false,
    });

    const result = queryUserById(this.data.inputVal, res => {
      const users = res.data.data
      let result = users.map(user => {
        return JSON.parse(user.userInfo)
      })

      that.setData({
        users: result,
        hidden: true,
      })
    })
  },

  scroll: function(event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    })
  },

  refresh: function() {
    const that = this
    that.setData({
      users: [],
      page: 0,
      hidden: false
    })

    const result = queryAllUser(0, that.data.size)
    if (result.length > 0) {
      that.setData({
        users: result,
        hidden: true,
        page: 1
      })
    }
  },

  bindDownload: function() {
    that = this
    that.setData({
      hidden: false
    })
    const users = that.data.users
    queryAllUser(that.data.page, that.data.size, (res) => {
      const users = res.data.data
      let result = users.map(user => {
        return JSON.parse(user.userInfo)
      })

      if (result.length > 0) {
        users.push(...result)
      }

      that.setData({
        users: users,
        hidden: true
      })
    })
  },
})

const queryAllUser = (page, size, success) => {
  let result = []
  qcloud.request({
    url: getAllUserPagedUrl,
    data: {
      offset: page * size,
      limit: size
    },

    success: success,

    fail: (res) => {
      wx.showModal({
        title: '加载数据失败',
        content: res.data.errMsg,
      })
    }
  })

  return result
}

const queryUserById = function(openId, success) {
  let result = []

  qcloud.request({
    url: getUserByIdUrl,
    data: {
      openId: openId
    },

    success: success,

    fail: (res) => {
      wx.showModal({
        title: '加载数据失败',
        content: res.data.errMsg,
      })
    }
  })

  return result
}