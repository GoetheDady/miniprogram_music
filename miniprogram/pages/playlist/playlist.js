// pages/playlist/playlist.js
const MAX_LIMIT = 15;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [{
      url: 'http://p1.music.126.net/iThtqS-EfKBLvsN5uhaF9g==/109951164453784664.jpg'
    }, {
      url: 'http://p1.music.126.net/xn1JF3EOyEXFhtb_MrfaEw==/109951164453311336.jpg'
    }, {
      url: 'http://p1.music.126.net/4D4PYTX_XcEPZQeQf5554w==/109951164453320221.jpg'
    }, {
      url: 'http://p1.music.126.net/0zJcnaSOJGQYfQ_bkPYH0g==/109951164453790015.jpg'
    }],
    playlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getPlaylist()
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
    this.setData({
      playlist: []
    }, () => {
      this._getPlaylist();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  _getPlaylist() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT
      }
    }).then(res => {
      console.log(res)
      wx.stopPullDownRefresh();
      wx.hideLoading();
      this.setData({
        playlist: [
          ...this.data.playlist,
          ...res.result.data
        ]
      })
    })
  }
})