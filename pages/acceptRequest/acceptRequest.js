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
    user_Info : undefined,
    showList: true,
    mycreate_cards: [], //类型是对象数组
    myreceive_cards: [],
    currentTab: 0,
    isRequesting: true,
    request_state_c:["未请求","请求中","已接收","已完成"]
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({ title: "任务中心" });
    this.loadCards();
  },

  // 加载卡片
  loadCards: function() {
    let that = this;
    // 获取用户信息缓存
    that.setData({
        user_Info : wx.getStorageSync("user_Info")
    });
    const query = Bmob.Query("express_Info");
    query.find().then(res => {
        let rtList = [];
        res.forEach(element => {
            if(element.request_state === "1") {
                rtList.push(element);
            }
        });
        // console.log(rtList);
        this.setData({
            mycreate_cards : rtList
        });
    }).catch(err => {
        console.log(err);
    });

    const send = Bmob.Query("send_Info");
    send.find().then(res => {
        let stList = [];
        res.forEach(element => {
            if(element.request_state === "1") {
                stList.push(element);
                // console.log(stList);
            }
        });
        this.setData({
            myreceive_cards : stList
        });
    }).catch(err => {
        console.log(err);
    });
  },

  // 处理获取的数据
  dealSongs: function(songs) {
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
  cardSkip: function(e) {
        console.log(e.target);
      let that = this;
      let parameter = JSON.stringify(e.target.dataset.songid) ;
    //   console.log(parameter);
      let url ="../detailCard/detailCard?parameter=" + parameter;  //转换成小写
      console.log(url);
      wx.navigateTo({
          url : url
      })
    
    //   console.log(e.currentTarget);
    // let url = undefined;
    // let songId = e.target.dataset.songid;
    // let source = e.target.dataset.source;
    // if (songId != null) {
    //   //我收到的
    //   if (source == "1") {
    //     url = "/pages/musicCard/musicCard?id=" + songId + "/1&type=receive";
    //   } else {
    //     url = "/pages/musicCard/musicCard?id=" + songId + "&type=create";
    //   }
    //   wx.navigateTo({
    //     url: url
    //   });
    // }
  },

  // 导航栏切换
  navChange: function(e) {
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
  bindChange: function(e) {
    let that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  // 点击切换tab
  switchNav: function(e) {
    let that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      });
    }
  },
  cancel: function() {
      console.log("cancel！");
  },
  send_ex: function() {
      wx.navigateTo({
          url:"../send_ex/send_ex"
      })
  }
});
