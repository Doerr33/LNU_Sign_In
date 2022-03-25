// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'yinxin-8g7t0bbvb79dd650',
        traceUser: true,
      });
    }

    this.globalData = {

    };
    // 将用户信息全局存取
    try {
      // 从本地获取用户信息到全局变量中
      var userInfo = wx.getStorageSync('userInfo')
      console.log("appjs userInfo",userInfo);
      if (userInfo) {
        this.globalData.userInfo = JSON.parse(userInfo);
        console.log("appjs userInfo",this.globalData.userInfo);
      }
    } catch (e) {
      console.log('app js:', '用户未登录')
    }
    // 将用户信息全局存取
    try {
      // 从本地获取用户信息到全局变量中
      var collageUserInfo = wx.getStorageSync('collageUserInfo')
      console.log("appjs collageUserInfo",collageUserInfo);
      if (collageUserInfo) {
        this.globalData.collageUserInfo = JSON.parse(collageUserInfo);
        console.log("appjs collageUserInfo",this.globalData.collageUserInfo);
      }
    } catch (e) {
      console.log('app js collageUserInfo:', '用户未填写信息')
    }
  }
});
