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
        send_Info:{
            name:"",
            phone_number:"",
            address:""
        },
        // user_name:"user_name",
        // user_phone:"user_phone",
        // user_address:"user_address",
        // send_name:"send_name"
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
    submit: function() {
        let that = this;
        console.log("提交按钮");
        let config = {
            title : "提交成功",
            successFn: function() {
                console.log("执行回调函数!");

                //查询记录,获取objectId
                const insert = Bmob.Query("send_Info");
                insert.set("name","");
                insert.set("receive_name","");
                insert.set("phone_number","");
                insert.set("receive_phone_number","");
                insert.set("address","");
                insert.set("receive_address","");


                setTimeout(function() {
                    wx.reLaunch({ //redirectTo
                        url:"../cart/cart" //提交成功返回到
                    });
                },500);
            }
        };
        util.alert(config);
    },
    submit_form: function(e) {
        console.log(e.detail);
        let that = this;
        let config = {
            title : "提交成功",
            successFn : function() {
                //直接将该订单添加入send_Info数据表中
                console.log(e.detail.value);
                const insert = Bmob.Query("send_Info");
                insert.set("name",e.detail.value.name);
                insert.set("receive_name",e.detail.value.receive_name);
                insert.set("phone_number",e.detail.value.phone_number);
                insert.set("receive_phone_number",e.detail.value.receive_phone_number);
                insert.set("address",e.detail.value.address);
                insert.set("receive_address",e.detail.value.receive_address);
                //openId等信息
                insert.set("openId",wx.getStorageSync("user_Info").openId);
                insert.set("request_state","1");
                insert.save().then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
                setTimeout(function() {
                    wx.reLaunch({ //redirectTo
                        url:"../cart/cart" //提交成功返回到
                    });
                },500);
            }
        };
        util.alert(config);
    }
})