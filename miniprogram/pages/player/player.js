// pages/player/player.js
let musicList = [];
let nowPlayingIndex = 0; // 表示正在播放歌曲的index
const backgroundAudioManager = wx.getBackgroundAudioManager(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    nowPlayingIndex = options.index;
    musicList = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },

  _loadMusicDetail(musicId) {
    backgroundAudioManager.pause();
    const music = musicList[nowPlayingIndex];
    console.log(music)
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false,
    }, () => {
      wx.showLoading({
        title: '歌曲加载中。。。',
      })
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'musicUrl',
        }
      }).then(res => {
        const { result: { data } } = res;
        backgroundAudioManager.src = data[0].url;
        backgroundAudioManager.title = music.name;
        backgroundAudioManager.coverImgUrl = music.al.picUrl;
        backgroundAudioManager.singer = music.ar[0].name;
        backgroundAudioManager.epname = music.al.name;
        this.setData({
          isPlaying: true
        }, () => {
          wx.hideLoading()
        })
      })
    })
  },

  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause();
    } else {
      backgroundAudioManager.play();
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  onPrev() {
    nowPlayingIndex--;
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musicList.length - 1
    }
    this._loadMusicDetail(musicList[nowPlayingIndex].id)
  },

  onNext() {
    nowPlayingIndex++;
    if (nowPlayingIndex === musicList.length) {
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musicList[nowPlayingIndex].id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})