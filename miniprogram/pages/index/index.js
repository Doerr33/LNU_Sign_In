// packageA/pages/signin/signin.js
const checkUserInfo = require("../../utils/checkUserInfo");
const checkCollageUserInfo = require("../../utils/checkCollageUserInfo");
var that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    checkCollageUserInfo: null
  },

  async scanCode(e) {
    await this.checkUserInfo();
    await this.checkCollageUser().then(res => {
      wx.scanCode({
        success(res) {
          console.log("扫码结果", res)
          wx.navigateTo({
            url: `/${res.path}`,
          })
        }
      })
    })
  },
  checkUserInfo(e) {
    console.log("userInfo");
    return new Promise((resolve, reject) => {
      let userInfo = checkUserInfo.checkUserInfo();
      console.log(userInfo);
      if (userInfo != null) {
        this.setData({
          userInfo: userInfo
        })
        resolve(userInfo)
        return 
      } else {
        wx.navigateTo({
          url: '/pages/login/login',
        })
        reject("未登录")
        return
      }
    })
  },
  checkCollageUser(e) {
    console.log("detailUserInfo");
    return new Promise((resolve, reject) => {
      let collageUserInfo = checkCollageUserInfo.checkCollageUserInfo();
      console.log("detailUserInfo",collageUserInfo);
      if (collageUserInfo != null) {
        this.setData({
          checkCollageUserInfo: checkCollageUserInfo
        })
        resolve(collageUserInfo)
      } else {
        wx.navigateTo({
          url: '/pages/adddetail/adddetail',
        })
        reject("未填写详细信息")
      }
    })
  },
  toSignInAdd(e) {
    console.log(e);
    wx.navigateTo({
      url: '../signtotal/signtotal',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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