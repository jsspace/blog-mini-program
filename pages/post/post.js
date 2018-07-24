// pages/post/post.js
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');

var realWindowWidth = 0;
var realWindowHeight = 0;
wx.getSystemInfo({
  success: function(res) {
    realWindowWidth = res.windowWidth
    realWindowHeight = res.windowHeight
  }
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id;
    this.id = id;
    let data = wx.getStorageSync(this.id);
    if (data) {
      util.chunkRender(data, 'article', this);
    }
    this.getPost(id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getPost(id) {
    let url = 'https://webfem.com/posts/item?id=' + id;
    let that = this;
    wx.request({
      url: url,
      success: (res) => {
        let content = res.data.data.html;
        that.setData({
          title: res.data.data.title
        });
        WxParse.wxParse('article', 'html', content, that, 12);
      }
    })
  },
  wxParseImgLoad(e) {
    var that = this;
    var tagFrom = e.target.dataset.from;
    var idx = e.target.dataset.idx;
    if (typeof(tagFrom) != 'undefined' && tagFrom.length > 0) {
      this.calMoreImageInfo(e, idx, that, tagFrom)
    }
  },
  wxParseImgTap(e) {
    var that = this;
    var nowImgUrl = e.target.dataset.src;
    var tagFrom = e.target.dataset.from;
    if (typeof(tagFrom) !== 'undefined' && tagFrom.length > 0) {
      wx.previewImage({
        current: nowImgUrl, // 当前显示图片的http链接
        urls: that.data[tagFrom].imageUrls // 需要预览的图片http链接列表
      })
    }
  },
  calMoreImageInfo(e, idx, that, bindName) {
    var temData = that.data[bindName];
    if (!temData || temData.images.length == 0) {
      return;
    }
    var temImages = temData.images;
    //因为无法获取view宽度 需要自定义padding进行计算，稍后处理
    var recal = that.wxAutoImageCal(e.detail.width, e.detail.height, that, bindName);
    // temImages[idx].width = recal.imageWidth;
    // temImages[idx].height = recal.imageheight;
    // temData.images = temImages;
    // var bindData = {};
    // bindData[bindName] = temData;
    // that.setData(bindData);
    var index = temImages[idx].index
    var key = `${bindName}`
    for (var i of index.split('.')) key += `.nodes[${i}]`
    var keyW = key + '.width'
    var keyH = key + '.height'
    that.setData({
      [keyW]: recal.imageWidth,
      [keyH]: recal.imageheight,
    })
  },
  wxAutoImageCal(originalWidth, originalHeight, that, bindName) {
    //获取图片的原始长宽
    var windowWidth = 0,
      windowHeight = 0;
    var autoWidth = 0,
      autoHeight = 0;
    var results = {};
    var padding = that.data[bindName].view.imagePadding;
    windowWidth = realWindowWidth - 2 * padding;
    windowHeight = realWindowHeight;
    //判断按照那种方式进行缩放
    // console.log("windowWidth" + windowWidth);
    if (originalWidth > windowWidth) { //在图片width大于手机屏幕width时候
      autoWidth = windowWidth;
      // console.log("autoWidth" + autoWidth);
      autoHeight = (autoWidth * originalHeight) / originalWidth;
      // console.log("autoHeight" + autoHeight);
      results.imageWidth = autoWidth;
      results.imageheight = autoHeight;
    } else { //否则展示原来的数据
      results.imageWidth = originalWidth;
      results.imageheight = originalHeight;
    }
    return results;
  }
});