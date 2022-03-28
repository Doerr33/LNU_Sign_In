// packageA/pages/sigindetail/signdetail.js
const checkUserInfo = require("../../utils/checkUserInfo");
const db = wx.cloud.database().collection("activity");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null,
        fileID: '',
        signInDetail:null,
        showModal: false,
        tabs: [{
            id: 0,
            isActive: true,
            name: "未签到"
        },
        {
            id: 1,
            isActive: false,
            name: "已签到"
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
    hideModal(e) {
        this.setData({
            showModal: false
        })
        this.getData(this.data.signInDetail.creatId);
    },
    async showModal(e) {
        this.setData({
            showModal: true
        })
    },
    async createQR(e) {
        await this.getQR('qr').then(res=>{
            this.showModal()
        })

    },
    async getMiniapp() {
        await this.getQR('miniapp').then(res=>{
            this.showModal()
        })
    },
    async getUnlimited() {
        wx.showLoading({
          title: '生成中···',
        })
        await this.getQR('unlimited').then(res=>{
            wx.hideLoading()
            this.showModal()
        })
    },

    async getQR(type) {
        return new Promise((resolve, reject) => {
            
            wx.cloud.callFunction({
                name: 'getQrcode',
                data: {
                    type,
                    createID:this.data.signInDetail.creatId
                }
            }).then(res => {
                console.log(res);
                let fileID = res.result;
                this.setData({
                    fileID
                })
                this.getData(this.data.signInDetail.creatId);
                resolve(res)
            })
        })
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
                        signInDetail: res.data[0]
                    })
                })
        })
    },
    inputData(){
        let that = this;
        wx.chooseMessageFile({
          count: 1,
          type:'file',
          success(res){
              let path = res.tempFiles[0].path;
              console.log("选择excel成功0",path);
              that.uploadExcel(path);
          }
        })
    },
    uploadExcel(path){
        let that = this;
        wx.cloud.uploadFile({
            cloudPath:'xlsData/' + new Date().getTime() + '.xls',
            filePath:path,
            success(res){
                console.log("上传成功",res.fileID);
                that.parsXls(res.fileID);

            },
            fail(err){
                console.error("上传失败",err);
            }
        })
    },
    parsXls(fileId){
        wx.cloud.callFunction({
            name:'parseExcel',
            data:{
                fileID:fileId,
                creatId:this.data.signInDetail.creatId
            },
            success(res){
                console.log("解析上传成功");
            },
            fail(err){
                console.error("解析失败",err);
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let signList = JSON.parse(decodeURIComponent(options.signList));
        this.setData({
            signInDetail:signList
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