// pages/user/user.js
let Bmob = require("../../utils/Bmob/Bmob-1.4.2.min.js");
Bmob.initialize("4f72a4304ec8c4312944b3ed80302138", "078a4c3e99f4e72d0bd6369df9943b8c");
Bmob.User.login('shimakaze', '123456').then(res => {
    console.log("Bmob登陆成功");
}).catch(err => {
    console.log(err)
});


Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_Info : "",
        name : "",
        phone_number : "",
        address : "",
        name_j : false,
        phone_j : false,
        address_j : false,
    },

    name_j: function() {
        let that = this;
        console.log("name_j");
        that.setData({
            name_j : true
        });
    },
    phone_j: function() {
        let that = this;
        console.log("phone_j");
        that.setData({
            phone_j : true
        });
    },
    address_j: function() {
        let that = this;
        console.log("address_j");
        that.setData({
            address_j : true
        });
    },
    save_name: function() {
        let that = this;
        that.setData({
            name_j :false,
            "user_Info.name" : this.data.name
        },() => {
            //更新本地和数据库的用户信息
            wx.setStorageSync("user_Info",that.data.user_Info);
            const query = Bmob.Query("user_Info");
            query.get(that.data.user_Info.objectId).then(res => {
                res.set("name",that.data.user_Info.name);
                res.save();
            }).catch(err => {
                console.log(err);
            });
        });
    },
    save_address: function() {
        console.log("点击保存！");
        let that = this;
        that.setData({
            address_j :false,
            "user_Info.address" : this.data.address
        },() => {
            //更新本地和数据库的用户信息
            wx.setStorageSync("user_Info",that.data.user_Info);
            const query = Bmob.Query("user_Info");
            query.get(that.data.user_Info.objectId).then(res => {
                res.set("address",that.data.user_Info.address);
                res.save();
            }).catch(err => {
                console.log(err);
            });
        });
    },
    input_name: function(e) {
        // console.log(e.detail.value);
        this.setData({
            name : e.detail.value
        });
    },
    input_phone_number: function(e) {
        this.setData({
            phone_number : e.detail.value
        });
    },
    input_address: function(e) {
        this.setData({
            address : e.detail.value
        });
    },
    save_phone_number: function() {
        let that = this;
        that.setData({
            phone_j :false,
            "user_Info.phone_number" : this.data.phone_number
        },() => {
            //更新本地和数据库的用户信息
            wx.setStorageSync("user_Info",that.data.user_Info);
            const query = Bmob.Query("user_Info");
            query.get(that.data.user_Info.objectId).then(res => {
                res.set("phone_number",that.data.user_Info.phone_number);
                res.save();
            }).catch(err => {
                console.log(err);
            });
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            user_Info : wx.getStorageSync("user_Info")
        })
        console.log(this.data.user_Info);
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