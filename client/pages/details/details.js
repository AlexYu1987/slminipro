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
      id: 1,
      image: "/images/goods1.png",
      title: "抹茶味蛋黄酥",
      price: 0.01,
      stock: "有货",
      detail: "保存需冷藏，吃时微波炉加热30秒",
      parameter: "125g/个\t125Cal",
      service: "食品不支持退货"
    };
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
    let total = this.data.totalNum;

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
          totalNum: num + total
        })
      }, 200)
    }, 300)
    //Add cart to storage
    let carts = wx.getStorageSync("carts") || [];
    let hasInCarts = false;
    carts.forEach(c => {
      if (c.id === this.data.goods.id) {
        c.num = total;
        c.id = this.data.goods.id;
        c.title = this.data.goods.title;
        c.image = this.data.goods.image;
        c.price = this.data.goods.price;
        c.select = true;
        hasInCarts = true;
      }
    });

    if (!hasInCarts) {
      carts.push({
        "id" : this.data.goods.id,
        "num" : total,
        "title": this.data.goods.title,
        "image": this.data.goods.image,
        "price": this.data.goods.price,
        "select": true
      })
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