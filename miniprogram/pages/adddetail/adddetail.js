// packageA/pages/signinadd/signinadd.js
const db = wx.cloud.database().collection("collageusers");
const js_date_time = require('../../utils/js_date_time.js');
const checkUserInfo = require("../../utils/checkUserInfo");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        youName: '',
        collage: '',
        professional: '',
        phone: '',
        index: 0,
        buttonDisable: true,
        picker: ['大一', '大二', '大三', '大四', '研究生'],
        userInfo: null,
        grade: ''
    },
    InputName(e) {
        this.setData({
            youName: e.detail.value,
        })
    },
    InputCollege(e) {
        this.setData({
            collage: e.detail.value,
        })
    },
    InputProfessional(e) {
        this.setData({
            professional: e.detail.value,
        })
    },
    InputPhone(e) {
        this.setData({
            phone: e.detail.value,
        })
    },
    PickerChange(e) {
        console.log(e);
        this.setData({
            index: e.detail.value,

        })
        this.setData({
            grade: this.data.picker[this.data.index],
            buttonDisable: false,
        })
    },


    publish(e) {
        this.setData({
            buttonDisable: true,
        })
        this.setLoaction();
        wx.showLoading({
            title: '创建中···',
        })
        db.add({
            data: {
                youName: this.data.youName,
                collage: this.data.collage,
                professional: this.data.professional,
                phone: this.data.phone,
                index: this.data.index,
                userInfo: this.data.userInfo,
                grade: this.data.grade
            }
        }).then(res => {
            console.log("创建成功", res);
            wx.showToast({
                title: '创建成功',
            })
            wx.reLaunch({
              url: '../index/index',
            })
        })
    },
    setLoaction(e) {
        let collageUserInfo = {};
        collageUserInfo.youName = this.data.youName,
        collageUserInfo.collage = this.data.collage,
        collageUserInfo.professional = this.data.professional,
        collageUserInfo.phone = this.data.phone,
        collageUserInfo.index = this.data.index,
        collageUserInfo.userInfo = this.data.userInfo,
        collageUserInfo.grade = this.data.grade
        console.log("collageUserInfo 本地缓存",collageUserInfo);
        wx.setStorage({
            key: "collageUserInfo",
            encrypt: true, // 若开启加密存储，setStorage 和 getStorage 需要同时声明 encrypt 的值为 true
            data: JSON.stringify(collageUserInfo),
          }).then(res => {
            console.log("信息已经存储到本地", res);
            getApp().globalData.collageUserInfo = collageUserInfo;
            resolve(res)
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
                url: '/pages/login/login',
            })
        }
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
                url: '/pages/login/login',
            })
        }
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