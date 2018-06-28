// page/component/details/details.js
Page({
  data:{
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },

  onLoad: function(option) {
    let goods = {
      id: option.id,
      price: option.price,
      name: option.name,
      picUrl: option.picUrl,
      discription: option.discription,
      ensure: option.ensure,
      param: option.param
    }
    goods.id = option.id;
    goods.price = option.price
    this.setData({"goods":goods});
  },

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },

  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = 0

    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: total
        })
      }, 200)
    }, 300)
    //Add cart to storage
    let carts = wx.getStorageSync("carts") || [];
    let hasInCarts = false;
    carts.forEach(c => {
      if (c.id === this.data.goods.id) {
        c.num +=  this.data.num;
        c.id = this.data.goods.id;
        c.name = this.data.goods.name;
        c.picUrl = this.data.goods.picUrl;
        c.price = this.data.goods.price;
        c.selected = true;
        hasInCarts = true;
        total = c.num
      }
    });

    if (!hasInCarts) {
      carts.push({
        "id" : this.data.goods.id,
        "num" : this.data.num,
        "name": this.data.goods.name,
        "picUrl": this.data.goods.picUrl,
        "price": this.data.goods.price,
        "selected": true, 
      })
      total = this.data.num
    }

    wx.setStorageSync("carts", carts);
  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
 
})