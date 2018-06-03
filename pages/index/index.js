let util = require("../../utils/util");
const app = getApp()

Page({
  data: {
    motto: '欢迎来到“校园快递通”',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    //如果为空
    if(!userInfo) {
        this.userLogin(options);
      }
    }
  },
  userLogin: function(options) {
    let that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          // 发起网络请求
          that.getUserInfo(res.code, options);
        } else {
          util.loadingToast(true, {
            title: res.errMsg
          });
        }
      }
    })
  },
  // 调用微信getUserInfo api
  getUserInfo: function(code, options) {
    let that = this;
    util.loadingToast(true, {title: "正在获取用户资料"});
    // 此处需要用户授权,造成异步
    wx.getUserInfo({
      lang: "zh_CN",
      encryptedData: true,
      success: function(res) {
        // eslint-disable-next-line
        that.setData({
          userInfo : res.userInfo,
          isLoaded: true
        });
        util.loadingToast(false);
      },
      // 获取失败或者用户拒绝
      fail: function() {
        util.loadingToast(false);
        util.dialog({
          content: "您没有授权,无法获取信息",
          showCancel: false
        });
        that.setData({
          isLoaded: true
        });
        that.userLogin(options);
      },
      complete: function() {

      }
    });
  },
  bindGetUserInfo: function() {
    let that = this;
    console.log("bindGetUserInfo");
    wx.getUserInfo({
      lang: "zh_CN",
      encryptedData: true,
      success: function(res) {
        // eslint-disable-next-line
        that.setData({
          userInfo : res.userInfo,
          isLoaded: true
        });
        util.loadingToast(false);
      }
    });
  },
  bindViewTap: function() {

  },
  exD: function() {
    wx.navigateTo({
      url: "../searchOrder/searchOrder"
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    let that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          // 发起网络请求
          that.getUserInfo(res.code, e);
        } else {
          util.loadingToast(true, {
            title: res.errMsg
          });
        }
      }
    })
  }
})
