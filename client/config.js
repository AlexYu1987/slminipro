/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://1t8xbpno.qcloud.la';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,

    addCommodityUrl: `${host}/weapp/commodity/add`,
    delCommodityUrl: `${host}/weapp/commodity/del`,
    queryAllCommodityUrl: `${host}/weapp/commodity/all`,

    submitOrderUrl: `${host}/weapp/order/add`,
    queryOrderUrl: `${host}/weapp/order/query`,
    countUncompliteOrderUrl: `${host}/weapp/order/uncomplite/count`,
    queryOrderById: `${host}/weapp/order`,
    queryAllOrdersUrl: `${host}/weapp/order/query/all`,
    processOrderUrl: `${host}/weapp/order/process`,
    rollbackOrderUrl: `${host}/weapp/order/rollback`,
  },

  admins: [{
    nickName: '余佩琪',
    avatarUrl: '/images/s5.png',
    description: '分店一管理员'
  }],
};

module.exports = config;