// pages/login/login.js
var that = this;
const checkCollageUserInfo = require("../../utils/checkCollageUserInfo.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    collageUseerInfo:null
  },
  async getUserInfo(e) {
    await this.getANinfo().then(res => {
      this.showToastInfo();
      this.setData({
        userInfo: res.userInfo
      })
    });
    await this.getOpenid().then(res => {
      // 往对象里面添加属性
      this.data.userInfo.openid = res.result.openid;
    });
    await this.checkAddUserInfo().then(res => {
      console.log("检查信息是否存在", res);
      if (res.data.length > 0) {
        console.log("存在");
        this.updateAddUerInfo();
      } else {
        console.log("不存在");
        this.addUserInfo();
      }
    });
    await this.addUserInfoStorage();
    wx.hideLoading()
    wx.navigateBack({
      delta: 1,
    })
    wx.showToast({
      title: '登录成功',
    })
    this.getCollageUserInfo()
  },
  getCollageUserInfo(e) {
    let collageUserInfo = checkCollageUserInfo.checkCollageUserInfo();
    if (collageUserInfo != null) {
      this.setData({
        collageUserInfo: collageUserInfo
      })
    } else {
      wx.navigateTo({
        url: '/pages/adddetail/adddetail',
      })
    }

  },
  showToastInfo() {
    wx.showLoading({
      title: '登陆中···',
    })
  },
  // 获取openid
  getOpenid(e) {
    return new Promise((resolve) => {
      wx.cloud.callFunction({
        name: 'getUserOpenid',
      }).then(res => {
        resolve(res);
      }).catch(res => {
        reject(res)
      })
    })
  },
  // 获取头像信息
  getANinfo(e) {
    return new Promise((resolve) => {
      wx.getUserProfile({
        desc: '用于发布、聊天时显示头像昵称',
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 查询用户信息是否存在
  checkAddUserInfo(e) {
    return new Promise(resolve => {
      wx.cloud.database().collection('users')
        .where({
          _openid: this.data.userInfo.openid
        }).get()
        .then(res => {
          resolve(res)
        })

    })
  },
  // 更新用户信息，比如头像
  updateAddUerInfo(e) {
    return new Promise(resolve => {
      wx.cloud.database().collection('users').where({
        _openid: this.data.userInfo.openid
      }).update({
        data: {
          userInfo: this.data.userInfo
        }
      }).then(res => {
        console.log("更新成功");
        resolve(res)
      })
    })
  },
  // 添加用户信息
  addUserInfo(e) {
    return new Promise(resolve => {
      wx.cloud.database().collection('users').add({
        data: {
          userInfo: this.data.userInfo,
        }
      }).then(res => {
        resolve(res)
      })
    })
  },
  // 添加用户信息到本地
  addUserInfoStorage() {
    return new Promise(resolve => {
      wx.setStorage({
        key: "userInfo",
        encrypt: true, // 若开启加密存储，setStorage 和 getStorage 需要同时声明 encrypt 的值为 true
        data: JSON.stringify(this.data.userInfo),
      }).then(res => {
        console.log("信息已经存储到本地", res);
        getApp().globalData.userInfo = this.data.userInfo;
        resolve(res)
      })
    })
  },
  onLoad() {

  }
})