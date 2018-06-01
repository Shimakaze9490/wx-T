
let Bmob = require("./utils/Bmob/Bmob-1.4.2.min.js");
Bmob.initialize("4f72a4304ec8c4312944b3ed80302138", "078a4c3e99f4e72d0bd6369df9943b8c");
Bmob.User.login('shimakaze', '123456').then(res => {
    console.log("Bmob登陆成功");
}).catch(err => {
    console.log(err)
});


App({
    onLaunch: function () {
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                this.transfer();
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            };
                            let res_log = res;
                            let openId = res_log.userInfo.avatarUrl;
                            let user_Info = {};  //用户信息对象
                            user_Info.openId = res_log.userInfo.avatarUrl;

                            const query = Bmob.Query("user_Info");
                            query.equalTo("openId", "===", openId); //条件查询
                            query.find().then(res => {
                                //用户曾经登陆过则读取，否则存入新用户
                                if (res.length > 0) {
                                    console.log("获取用户信息：");
                                    query.get(res[0].objectId).then(res => {  //此处异步
                                        user_Info = res;  //读取用户信息
                                        wx.setStorageSync("user_Info", user_Info);  //存入用户新消息
                                    }).catch(err => {
                                        console.log(err);
                                    });
                                } else {
                                    //新用户，存储该用户信息
                                    // const query = Bmob.Query('user_Info');
                                    query.set("openId", res_log)
                                    console.log("添加新用户");
                                    query.save().then(res => {
                                        console.log(res);
                                        wx.setStorageSync("user_Info", user_Info);  //存入用户新消息
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                };
                                // console.log("user_Info:");
                                // console.log(user_Info);
                            });
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null
    },
    transfer: function () {

    }
})