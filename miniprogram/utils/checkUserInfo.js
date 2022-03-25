let userInfo = null;
function checkUserInfo() {
  if (getApp().globalData.userInfo) {
    userInfo = getApp().globalData.userInfo
  } else if(wx.getStorageSync('userInfo')){
    let jsonUserInfo = JSON.parse(userInfo)
    userInfo = jsonUserInfo
  } else{
    userInfo = null;
  }
  return userInfo
}
module.exports = {
  checkUserInfo
}