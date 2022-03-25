let collageUserInfo = null;
function checkCollageUserInfo() {
  if (getApp().globalData.collageUserInfo) {
    collageUserInfo = getApp().globalData.collageUserInfo
  } else if(wx.getStorageSync('collageUserInfo')){
    let jsoncollageUserInfo = JSON.parse(collageUserInfo)
    collageUserInfo = jsoncollageUserInfo
  } else{
    collageUserInfo = null;
  }
  return collageUserInfo
}
module.exports = {
    checkCollageUserInfo
}