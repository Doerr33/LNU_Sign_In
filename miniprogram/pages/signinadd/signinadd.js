// packageA/pages/signinadd/signinadd.js
const db = wx.cloud.database().collection("activity");
const js_date_time = require('../../utils/js_date_time');
const checkUserInfo = require("../../utils/checkUserInfo.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        startTime: '00:01',
        endTime: '23:59',
        date: '2022-01-01',
        location: {
            "address": "",
            "errMsg": "",
            "latitude": 41.833902854,
            "longitude": 123.405549427,
            "name": ""
        },
        title: '签到活动',
        distance: '50米',
        index: 0,
        buttonDisable:true,
        picker: ['50m', '100m', '150m', '200m', '300m', '500m'],
        userInfo: null,
        creator:'',
        members:[]
    },
    InputTitle(e) {
        this.setData({
            title: e.detail.value,
            buttonDisable:false
        })
        if(e.detail.value == ''){
            this.setData({
                buttonDisable:true
            })
        }
    },
    PickerChange(e) {
        console.log(e);
        this.setData({
            index: e.detail.value,
           
        })
        this.setData({
            distance:this.data.picker[this.data.index]
        })
    },
    TimeChangeStart(e) {
        this.setData({
            startTime: e.detail.value
        })
    },
    TimeChangeEnd(e) {
        this.setData({
            endTime: e.detail.value
        })
    },
    DateChange(e) {
        this.setData({
            date: e.detail.value
        })
    },
    chooseLocation(e) {
        console.log(e);
        wx.chooseLocation({

        }).then(res => {
            console.log(res);
            this.setData({
                location: res
            })
        })
    },
    publish(e) {
        wx.showLoading({
            title: '创建中···',
          })
        db.add({
            data: {
                creatId:Date.parse(new Date()),
                creator:this.data.userInfo.nickName,
                startTime: this.data.startTime,
                endTime: this.data.endTime,
                date: this.data.date,
                location: this.data.location,
                title: this.data.title,
                distance: this.data.distance,
                index: this.data.index,
                time: js_date_time.js_date_time(new Date()),
                members:[],
                userInfo: this.data.userInfo
            }
        }).then(res=>{
            console.log("创建成功",res);
            wx.showToast({
              title: '创建成功',
            })
            wx.navigateBack({
              delta: 1,
            })
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