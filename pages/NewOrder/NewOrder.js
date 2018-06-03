// pages/NewOrder/NewOrder.js

const util = require("../../utils/util");

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
        last_order:undefined,
        user_Info:undefined,
        user_name:"user_name",
        user_phone:"user_phone",
        user_address:"user_address",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let last_order = wx.getStorageSync("last_order");
        let user_Info = {};
        this.setData({
            last_order : last_order,
            user_Info : wx.getStorageSync("user_Info")
        });
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

    },
    submit_form: function(e) {
        let that = this;
        console.log("提交按钮");
        let config = {
            title : "提交成功",
            successFn: function() {
                // console.log("执行回调函数!"); 
                //查询记录,获取objectId
                const query = Bmob.Query("express_Info");
                const query_user = Bmob.Query("user_Info");
                query.equalTo("logistics_num","===",that.data.last_order.order);
                query_user.equalTo("openId","===",that.data.user_Info.openId);
                query.find().then(res => {
                    query.get(res[0].objectId).then(res => {
                        res.set("request_state","1");   //修改订单状态
                        res.set("name",e.detail.value.name);
                        res.set("phone_number",e.detail.value.phone_number);
                        res.set("address",e.detail.value.address);
                        res.save();
                    }).catch(err => {
                        console.log(err);
                    });
                }).catch(err => {
                    console.log(err);
                });
                query_user.find().then(res => {  //存入本次用户信息
                    query_user.get(res[0].objectId).then(res => {
                        res.set("name",e.detail.value.name);
                        res.set("phone_number",e.detail.value.phone_number);
                        res.set("address",e.detail.value.address);
                        res.save();
                    }).catch(err => {
                        console.log(err);
                    });
                }).catch(err => {

                });
                setTimeout(function() {
                    wx.reLaunch({ //redirectTo
                        url:"../cart/cart" //提交成功返回到
                    });
                },500);
            }
        };
        if( e.detail.value.name == "" || e.detail.value.phone_number == "" || e.detail.value.address == "") {
            wx.showModal({
                title: '提示',
                content: '请填写完整信息',
                success: function (res) {
                }
            });
        } else {
            util.alert(config);
        };
    }
})