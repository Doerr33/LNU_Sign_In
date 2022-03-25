// packageA/pages/signintotal/signintotal.js
const checkUserInfo = require("../../utils/checkUserInfo.js");
const db = wx.cloud.database().collection("activity");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        signList:null,
        userInfo:null,
        tabs: [{
                id: 0,
                isActive: true,
                name: "我创建的"
            },
            {
                id: 1,
                isActive: false,
                name: "我参与的"
            },
        ]
    },
    // tabs自定义事件
    tabsChange(e) {
        const {
            index
        } = e.detail;
        let {
            tabs
        } = this.data;
        // 最严谨的写法
        // let tabs = JSON.parse(JSON.stringify(this.data.tabs))
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs
        })
    },
    toSignAdd(e){
        wx.navigateTo({
          url: '../signinadd/signinadd',
        })
    },
    getSignIn(){
        db.orderBy('time', 'desc')
        .where({
          _openid : this.data.userInfo.openid
        })
        .get()
        .then(res=>{
            this.setData({
                signList:res.data
            })
        })
    },
    toDetail(e){
        console.log(e);
        let index = e.currentTarget.dataset.index;
        let signList = encodeURIComponent(JSON.stringify(this.data.signList[index]));
        console.log("signList",signList);
        wx.navigateTo({
          url: `../signindetail/signindetail?signList=${signList}`,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userInfo = checkUserInfo.checkUserInfo();
        if (userInfo != null) {
            this.setData({
                userInfo: userInfo
            })
        } else {
            wx.navigateTo({
                url: '../login/login',
            })
        }
        this.getSignIn();
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
        let userInfo = checkUserInfo.checkUserInfo();
        if (userInfo != null) {
            this.setData({
                userInfo: userInfo
            })
        } else {
            wx.navigateTo({
                url: '../login/login',
            })
        }
        this.getSignIn();
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