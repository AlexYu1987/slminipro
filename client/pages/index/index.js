/*
 * index page controller
 * Created by: Alex.Y
 * From 2018/6/19
 */

const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util')

Page({
  data: {
    imgUrls: [
      '/images/b1.jpg',
      '/images/b2.jpg',
      '/images/b3.jpg'
    ],
    selectedList: [{
      id: 103,
      name: "蛋黄酥",
      url: "/images/s4.png",
      price: 30
    }, {
      id: 102,
      name: "牛轧糖",
      url: "/images/s5.png",
      price: 25
    }, {
      id: 100,
      name: "黑森林蛋糕",
      url: "/images/s6.png",
      price: 26
    }, {
      id: 120,
      name: "榴莲班戟",
      url: "/images/s6.png",
      price: 56
    }, {
      id: 150,
      name: "蛋黄酥",
      url: "/images/s4.png",
      price: 30
    }, {
      id: 101,
      name: "牛轧糖",
      url: "/images/s5.png",
      price: 25
    }],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  },

  onLoad: function () {
    let self = this;
    util.showBusy('正在登录')

    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功')
          that.setData({
            userInfo: result,
            logged: true
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')
              that.setData({
                userInfo: result.data.data,
                logged: true
              })
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  }
})