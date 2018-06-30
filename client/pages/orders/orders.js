const {
  showBusy,
  showModal,
  showSuccess
} = require('../../utils/util.js')

const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const { service: { submitOrderUrl } } = require('../../config.js')

// page/component/orders/orders.js
Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    orders: []
  },

  onLoad() {
    let that = this
    let carts = wx.getStorageSync('carts')
    this.setData({carts: carts})
    this.setData({
      orders: carts.map(c => {
        if (c.selected) return c
      })
    })
  },

  onReady() {
    this.getTotalPrice();
  },

  addAdress() {
    let that = this
    wx.chooseAddress({
      success: function(res) {
        that.setData({
          address: res
        })
        that.setData({
          hasAddress: true
        })
      },
      fail: function(err) {
        showModal(err)
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total
    })
  },

  toPay() {
    let that = this
    wx.showModal({
      title: '提交订单？',
      content: '总金额：' + this.data.total,
      text: 'center',
      success: that.submit
    })
  },

  submit() {
    let that = this
    let details = []
    this.data.orders.forEach(goods => {
      if (!goods.selected) return
      details.push({
        commodityId: goods.id,
        count: goods.num
      })
    })

    if(!this.data.hasAddress) {
      wx.showModal({
        title: '无法提交订单',
        content: '未填写收货地址',
      })
      return
    }

    let user = wx.getStorageSync('userinfo')

    showBusy('正在创建订单')
    qcloud.request({
      url: submitOrderUrl,
      header: {
        openId: user['openId']
      },
      method: 'POST',
      data: {details:details, address:that.data.address},
      success: function(res) {
        if (res.data.code == 500) {
          showModal('提交订单失败', res.data.error)
          return
        }
        //更新用户余额
        user['balance'] = res.data.data.balance
        wx.setStorageSync('userinfo', user)
        //清理购物车
        details.forEach((d => {
          let index = that.data.carts.findIndex((v) => {
            return v.id == d.commodityId
          })

          that.data.carts.splice(index,1)
        }))
        wx.setStorageSync('carts', that.data.carts)

        showSuccess('订单已提交')
        setTimeout(() => {
          wx.switchTab({
            url: '../user/user',
          })
        }, 1500)
      },

      fail: function(error) {
        showModal('无法提交订单', error)
      }
    })
  }
})