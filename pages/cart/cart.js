let app = getApp();
let util = require("../../utils/util.js");

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
        user_Info: undefined,
        showList: true,
        mycreate_cards: [], //类型是对象数组
        myreceive_cards: [],
        currentTab: 0,
        isRequesting: true,
        request_state_c: ["未请求", "请求中", "已接收", "已完成"]
    },

    onLoad: function (options) {
        wx.setNavigationBarTitle({ title: "我的订单记录" });
        this.loadCards();
    },

    // 加载卡片
    loadCards: function () {
        let that = this;
        // 获取用户信息缓存
        that.setData({
            user_Info: wx.getStorageSync("user_Info")
        });
        console.log(that.data.user_Info.openId);
        const query = Bmob.Query("express_Info");
        query.equalTo("openId", "===", that.data.user_Info.openId);
        query.find().then(res => {
            console.log(res);
            that.setData({
                mycreate_cards: res,
                isRequesting: false
            })
        }).catch(err => {
            console.log(err);
        });
        // 获取寄出快递记录
        const send = Bmob.Query("send_Info");
        send.equalTo("openId", "===", that.data.user_Info.openId);
        send.find().then(res => {
            console.log("send_Info:")
            console.log(res);
            that.setData({
                myreceive_cards: res,
                isRequesting: false
            });
        }).catch(err => {
            console.log(err);
        });
    },

    // 处理获取的数据
    dealSongs: function (songs) {
        let song1 = [],
            song2 = [];
        let that = this;
        songs.forEach((item, index) => {
            item.theme = "img/icon_" + item.themeId + ".png";
            if (item.isQRCode == "true") {
                item.isQR = "二维码分享";
            } else {
                item.isQR = "微信消息";
            }
            // 我创建的
            if (item.source == 0) {
                song1.push(item);
                //我收到的
            } else if (item.source == 1) {
                song2.push(item);
            }
        });
        // 处理完毕,加载出来
        let createCards = song1.reverse();
        let receivedCards = song2.reverse();
        that.setData({
            mycreate_cards: createCards,
            myreceive_cards: receivedCards,
            isRequesting: false
        });
    },

    // 点击卡片,获取绑定的url,跳转到该卡片
    cardSkip: function (e) {
        let url = undefined;
        let songId = e.target.dataset.songid;
        let source = e.target.dataset.source;
        if (songId != null) {
            //我收到的
            if (source == "1") {
                url = "/pages/musicCard/musicCard?id=" + songId + "/1&type=receive";
            } else {
                url = "/pages/musicCard/musicCard?id=" + songId + "&type=create";
            }
            wx.navigateTo({
                url: url
            });
        }
    },

    // 导航栏切换
    navChange: function (e) {
        let that = this;
        let getId = e.target.dataset.id.toString();
        if (getId == "mycreate") {
            that.setData({
                showList: true
            });
        } else {
            that.setData({
                showList: false
            });
        }
    },

    // 滑动切换tab
    bindChange: function (e) {
        let that = this;
        that.setData({
            currentTab: e.detail.current
        });
    },

    // 点击切换tab
    switchNav: function (e) {
        let that = this;
        if (that.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            });
        }
    },
    cancel: function (e) {
        //   console.log("cancel！");
        // console.log(e.target);
        let that = this;
        console.log(e.currentTarget.dataset);
        let config = {
            title: "确定取消？",
            content: "",
            cancelText: "返回",
            showCancel: true,
            successFn: function () {
                console.log("取消成功！");
                const query = Bmob.Query("express_Info");
                query.get(e.currentTarget.dataset.objectid).then(res => {
                    res.set("request_state", "0");
                    res.save();
                    query.equalTo("openId", "===", that.data.user_Info.openId);
                    // 重新加载,注意异步操作
                    query.find().then(res => {
                        if (res.length != 0) {
                            that.setData({
                                mycreate_cards: res,
                                isRequesting: false
                            });
                        };
                    }).catch(err => {
                        console.log(err);
                    });
                }).catch(err => {
                    console.log(err);
                });

                // that.loadCards();
            },
            failFn: function () {
                console.log("fail");
            }
        };

        util.dialog(config);
    },

    request: function (e) {
        console.log(e.currentTarget.dataset.objectid);
        let url = "../NewOrder/NewOrder?objectid=" + e.currentTarget.dataset.objectid;
        wx.navigateTo({
            url: url
        });
    },

    send_ex: function () {
        wx.navigateTo({
            url: "../send_ex/send_ex"
        })
    }
});
