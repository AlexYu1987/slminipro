import WxValidate from '../common/Validator.js'

const {guid} = require('../../utils/util.js')

Page({
  data: {
    image: ''
  },

  onLoad: function() {
    //初始化表单校验器
    this.validator = new WxValidate({
      name: {
        required: true,
        maxlength: 100
      },
      price: {
        required: true,
        digits: true
      },
      picUrl: {
        required: true
      }
    },{
      name:{
        required: '产品名称未填写',
        maxlength: '产品名称长度不能超过100个字符'
      },
      price: {
        required: '产品价格未填写',
        digits: '价格'
      },
      picUrl: {
        required: '未选择产品图片'
      }
    })
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({image: res.tempFilePaths[0]});
      }
    })
  },
  
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.image // 需要预览的图片http链接列表
    })
  },

  delUrl: function() {
    this.setData({image: ''})
  },

  addCommodity: function(e) {
    let that = this
    if (!this.validator.checkForm(e)) {
      let error = this.validator.errorList[0]
      wx.showToast({
        title: error.msg
      })
    }

    //保存图片
    wx.uploadFile({
      url: require('../../config.js').service.uploadUrl,
      filePath: image,
      name: guid(),
      success: function(d) {
        //调用增加商品的接口
        wx.request({
          url: '',
          header: {'Content-Type': "application/x-www-form-urlencoded"},
          method: 'POST',
          data: {name: e.name, price: e.price, picUrl: e.picUrl, param: e.param, ensure: e.ensure, discription: e.discription},
          success: function(res) {
            if(res.data.status === 200) {
              wx.showToast({
                title: '保存成功'
              })
              //TODO:回到主页面
            } else {
              wx.showToast({
                title: res.error.message,
              })
            }
          },
          fail: function() {
            wx.showtoast({
              title: '保存失败'
            })
          }
        })
      },
      fail: function() {
        wx.showToast({
          title: '上传图片失败',
        })
      }
    })
  }
})