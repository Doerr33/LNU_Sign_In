// pages/add/add.js
const db = wx.cloud.database().collection("activity");
const checkUserInfo = require("../../utils/checkUserInfo");
const checkCollageUserInfo = require("../../utils/checkCollageUserInfo");
const js_date_time = require("../../utils/js_date_time")
var that = this;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null,
        checkCollageUserInfo: null,
        activity: []
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
            console.log("detailUserInfo", collageUserInfo);
            if (collageUserInfo != null) {
                this.setData({
                    checkCollageUserInfo: collageUserInfo
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
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.judgeAbleToSignIn();
        // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
        console.log("携带参数为", decodeURIComponent(options.scene));
        let createID = decodeURIComponent(options.scene);
        createID = Number(createID)
        await this.checkUserInfo();
        await this.checkCollageUser();
        await this.getData(createID);
        await this.dealDate();

    },
    async getData(createID) {
        return new Promise((resolve, reject) => {
            db.where({
                    creatId: createID
                })
                .get()
                .then(res => {
                    resolve("get success")
                    console.log("获取createID", res);
                    this.setData({
                        activity: res.data[0]
                    })
                })
        })
    },
    async dealDate(createID) {

        return new Promise((resolve, reject) => {
            let members = this.data.activity.members;
            let youName = '';
            console.log("this.data.members", members);
            let flat = false;
            console.log("before update", members);
            // 判断是否已经签到，通过openid
            for (let i = 0; i < this.data.activity.members.length; i++) {
                if (this.data.userInfo.openid == members[i].userInfo.openid) {
                    flat = true;
                }
            }
    
            if (!flat) {
                resolve("更新")
                for(let j = 0; j < this.data.activity.membersPre.length; j++){
                    console.log("我进来比对了")
                    let youName = this.data.checkCollageUserInfo.youName;
                    console.log("你的名字",youName)
                    if(youName == this.data.activity.membersPre[j].name){
                        this.data.activity.membersPre.splice(j,1);
                        console.log("找到了，删除")
                    }
                }
                this.updateMembers(createID)
            } else {
                reject("你已经签到过了")
                wx.showToast({
                    title: '你已经签过到了',
                })
            }
        })

    },
    judgeAbleToSignIn(){
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const hour = date.getHours();
        const minute = date.getMinutes();
        
    },
    async updateMembers(createID) {
        return new Promise((resolve, reject) => {
            let members = this.data.activity.members;
            let membersPre = this.data.activity.membersPre;
            console.log("members更新中", members);
            console.log("membersPre新中", membersPre);
            members.push(this.data.checkCollageUserInfo);
            console.log("members push后", members);
            console.log("membersPre push后", membersPre);
            db.where({
                    _id: this.data.activity._id
                }).update({
                    data: {
                        members: members,
                        membersPre: membersPre
                    }
                })
                .then(res => {
                    console.log("members update", res);
                })
        })
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
        // this.getData(createID);
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