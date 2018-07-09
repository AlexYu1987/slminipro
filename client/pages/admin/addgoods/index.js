import WxValidate from '../../common/Validator.js'

const {showBusy,showSuccess,showModal} = require('../../../utils/util.js')
const {service: {uploadUrl,addCommodityUrl}} = require('../../../config.js')
const qcloud = require('../../../vendor/wafer2-client-sdk/index.js')

Page({
  data: {
    image: '',
    pcount: 0,
    dcount: 0,
    ecount: 0
  },

  onLoad: function() {
    //设置导航条名称
    wx.setNavigationBarTitle({
      title: '增加商品',
    })
    //初始化表单校验器
    this.validator = new WxValidate({
      name: {
        required: true,
        maxlength: 100
      },
      price: {
        required: true,
      },
      picUrl: {
        minlength: 5
      }
    }, {
      name: {
        required: '产品名称未填写',
        maxlength: '产品名称长度不能超过100个字符'
      },
      price: {
        required: '产品价格未填写',
        digits: '价格'
      },
      picUrl: {
        minlength: '未选择产品图片'
      }
    })
  },

  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          image: res.tempFilePaths[0]
        });
      }
    })
  },

  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [this.data.image] // 需要预览的图片http链接列表
    })
  },

  delUrl: function() {
    this.setData({
      image: ''
    })
  },

  addCommodity: function(e) {
    showBusy('处理中...');
    const that = this

    if (!this.validator.checkForm(e)) {
      let error = this.validator.errorList[0]
      showModal('未填写正确', {
        '原因': error.msg
      })

      return
    }

    if (!this.data.image || this.data.image.length < 1) {
      showModal('未正确填写', {'原因': '未选择商品图片'})
    }

    //上传图片
    wx.uploadFile({
      url: uploadUrl,
      filePath: that.data.image,
      name: 'file',

      success: function(res) {
        if (res.data.code == 500) {
          showModal('图片上传失败')
          return
        }

        //修改图片临时目录到正式目录
        e.detail.value['picUrl'] = JSON.parse(res.data).data.imgUrl

        //图片上传成功后则调用增加商品的接口
        qcloud.request({
          url: addCommodityUrl,
          method: 'POST',
          data: e.detail.value,
          success: function(res) {
            if (res.data.code == 500) {
              showModal(JSON.parse(res.data).error.message)
            } else {
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1800,
                success: function() {
                  //退回到上一个页面
                  setTimeout(wx.navigateBack, 2000)
                }
              })
            }
          },
          fail: function() {
            showModal('保存失败')
          }
        })
      },
      fail: function() {
        showModal('上传图片失败')
      }
    })
  },

  countChar: function(value, cursor) {
    let id = value.currentTarget.id
    let count = value.detail.value.length
    const opt = {}
    opt[id] = count
    this.setData(opt)
  }
})