var Base64 = require('../../utils/v_c2.0/base64.js').Base64;
var MD5 = require('../../utils/v_c2.0/md5.min.js');
var util = require('../../utils/v_c2.0/util.js');
var MockData = require('../../utils/v_c2.0/mockdata.js');


let Bmob = require("../../utils/Bmob/Bmob-1.4.2.min.js");
Bmob.initialize("4f72a4304ec8c4312944b3ed80302138", "078a4c3e99f4e72d0bd6369df9943b8c");
Bmob.User.login('shimakaze', '123456').then(res => {
    console.log("Bmob登陆成功");
}).catch(err => {
    console.log(err)
});


Page({
    data: {
        result: {},
        focus: false,
        historySearch: [],
        user_Info : undefined
    },

    onLoad: function () {
        wx.showLoading({
            title: '加载中',
        });
        this.setData({
            user_Info : wx.getStorageSync("user_Info")
        })
    },

    onShow: function () {
        setTimeout(function () {
            wx.hideLoading()
        }, 100);
        this.showHistory();
    },

    formSubmit: function (e) {
        //   获取点击事件传递的参数
        let eorder = util.trim(e.detail.value.expressorder);
        let self = this;
        if (!eorder) {
            wx.showModal({
                title: '提示',
                content: '快递单号不能为空！',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        self.setData({
                            focus: true
                        })
                    }
                }
            })
            return;
        }

        //正式调用查询函数
        this.searchExpress(eorder);
    },

    navigateTo: function() {
        console.log("navigateTo");
        wx.navigateTo({
            url:"../acceptRequest/acceptRequest"
        })
    },
    deleteHistory: function (e) {
        var self = this;
        try {
            let historySearchList = wx.getStorageSync('historySearchList');

            let newList = historySearchList.filter(function (val) {
                return (val.order != e.currentTarget.dataset.order);
            });

            wx.setStorage({
                key: "historySearchList",
                data: newList,
                success: function () {
                    self.showHistory();
                }
            })
        } catch (e) {
            console.log(e);
        }

    },

    showHistory: function () {
        var self = this;
        wx.getStorage({
            key: 'historySearchList',
            success: function (res) {
                self.setData({
                    historySearch: res.data
                });
            }
        })
    },

    scanCode: function () {
        let self = this;
        wx.scanCode({
            success: (res) => {
                if (res.result) {
                    self.searchExpress(util.trim(res.result));
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '快递单号不能为空！',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                self.setData({
                                    focus: true
                                })
                            }
                        }
                    })
                }
            }
        })
    },

    searchExpress: function (eorder) {
        let self = this;
        // wx.showModal({
        //     title: '提示',
        //     content: '暂时没有查到该单号',
        //     success: function (res) {
        //     }
        // });
        // return ;
        if (MockData.env == "mock") {       //mock环境下使用
            let res = MockData.getExpressName(eorder);  //获取快递  名字
            let resData = res.data;
            let LogisticCode = resData.LogisticCode;
            let ShipperName = "";
            let ShipperCode = "";

            if (resData.Shippers.length == 1) {
                ShipperName = resData.Shippers[0].ShipperName;
                ShipperCode = resData.Shippers[0].ShipperCode;

                try {
                    let historySearchList = wx.getStorageSync('historySearchList');
                    if (!historySearchList) {
                        historySearchList = [];
                    };

                    let newList = historySearchList.filter(function (val) {
                        return (val.order != LogisticCode);
                    });

                    //处理后的快递订单信息
                    newList.push({
                        "order": LogisticCode,  //订单号logistic_num
                        "name": ShipperName,    //快递公司名称
                        "code": ShipperCode,    //快递公司编号logistic_com_num
                        "openId": wx.getStorageSync("onepId"),
                        "logistic_state": 2,   //物流状态，2表示在路上
                        "staff_openId": "",
                        "request_state": "",
                        "deal_state": ""
                    })

                    //缓存处理 历史记录
                    wx.setStorage({
                        key: "historySearchList",
                        data: newList,
                        success: function () {
                            //跳转到具体页面
                            wx.navigateTo({
                                url: '../detail/detail?LogisticCode=' + LogisticCode + '&ShipperCode=' + ShipperCode + '&ShipperName=' + ShipperName
                            })
                        }
                    })
                } catch (e) {
                    console.log(e);
                }


            } else {

                let list = [];
                if (resData.Shippers.length >= 1 && resData.Shippers.length <= 6) {
                    for (let i = 0; i < resData.Shippers.length; i++) {
                        list.push(resData.Shippers[i].ShipperName)
                    }

                } else if (resData.Shippers.length > 6) {
                    for (let i = 0; i < 6; i++) {
                        list.push(resData.Shippers[i].ShipperName)
                    }

                } else {
                    wx.showModal({
                        title: '提示',
                        content: '暂时没有查到该单号',
                        success: function (res) {
                        }
                    })
                }

                wx.showActionSheet({
                    itemList: list,
                    success: function (res) {
                        ShipperName = resData.Shippers[res.tapIndex].ShipperName;
                        ShipperCode = resData.Shippers[res.tapIndex].ShipperCode;

                        try {
                            let historySearchList = wx.getStorageSync('historySearchList');
                            if (!historySearchList) {
                                historySearchList = [];
                            };

                            let newList = historySearchList.filter(function (val) {
                                return (val.order != LogisticCode);
                            });

                            let traces = MockData.getExpressDetail().data.Traces;
                            console.dir(traces);
                            //订单详细信息
                            newList.push({
                                "order": LogisticCode,//订单号logistic_num
                                "name": ShipperName,//快递公司名称
                                "code": ShipperCode,//快递公司编号logistic_com_num
                                "openId": wx.getStorageSync("user_Info").openId,
                                "logistic_state": "2",//物流状态，2表示在路上
                                "staff_openId": "",//小件员id
                                "traces": traces,
                                "request_state":"0"
                            })
                            console.log("last_order:");
                            //   console.log(newList);

                            
                            let last_order = newList[newList.length - 1];
                            console.log(last_order);
                            wx.setStorageSync("last_order",last_order);
                            //订单信息存入数据库,是否需要重新引入bmob？
                            const query = Bmob.Query("express_Info");
                            query.equalTo("logistics_num", "===", last_order.order);  //防止重复插入
                            query.find().then(res => {
                                console.log("订单查询结果：");
                                // console.log(res.length);
                                if(res.length === 0) {
                                    const insert = Bmob.Query("express_Info");
                                    insert.set("logistics_num", last_order.order);
                                    insert.set("logistics_com_name", last_order.name);
                                    insert.set("logistics_com_num", last_order.code);
                                    insert.set("logistics_state", last_order.logistic_state);
                                    insert.set("openId", last_order.openId);
                                    insert.set("staff_openId", last_order.staff_openId);
                                    insert.set("request_state", last_order.request_state);
                                    insert.set("Traces", last_order.traces);
                                    insert.save().then(res => {
                                        console.log(res);
                                    }).catch(err => {
                                        console.log(err);
                                    });
                                }
                            });

                            wx.setStorage({
                                key: "historySearchList",
                                data: newList,
                                success: function () {
                                    wx.navigateTo({
                                        url: '../detail/detail?LogisticCode=' + LogisticCode + '&ShipperCode=' + ShipperCode + '&ShipperName=' + ShipperName
                                    })
                                }
                            })
                        } catch (e) {
                            console.log(e);
                        }

                    },
                    fail: function (res) {
                        console.log(res.errMsg)
                    }
                })

            }

        } else {    //正式环境下请求数据

            let appKey = "";//更换成你申请的appkey
            let requestData = "{\"LogisticCode\":\"" + eorder + "\"}";
            let eBusinessID = "";//更换成你申请的商户id
            let requestType = "2002";
            let dataSign = Base64.encode(MD5(requestData + appKey));

            wx.request({
                url: 'http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx',
                data: {
                    RequestData: requestData,
                    EBusinessID: eBusinessID,
                    RequestType: requestType,
                    DataSign: dataSign,
                    DataType: "2"
                },
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                success: function (res) {
                    let resData = res.data;
                    console.info(resData);
                    let LogisticCode = resData.LogisticCode;
                    let ShipperName = "";
                    let ShipperCode = "";

                    if (resData.Shippers.length == 1) {
                        ShipperName = resData.Shippers[0].ShipperName;
                        ShipperCode = resData.Shippers[0].ShipperCode;

                        try {
                            let historySearchList = wx.getStorageSync('historySearchList');
                            if (!historySearchList) {
                                historySearchList = [];
                            };

                            let newList = historySearchList.filter(function (val) {
                                return (val.order != LogisticCode);
                            });

                            newList.push({
                                "order": LogisticCode,
                                "name": ShipperName,
                                "code": ShipperCode,
                            })

                            wx.setStorage({
                                key: "historySearchList",
                                data: newList,
                                success: function () {
                                    wx.navigateTo({
                                        url: '../detail/detail?LogisticCode=' + LogisticCode + '&ShipperCode=' + ShipperCode + '&ShipperName=' + ShipperName
                                    })
                                }
                            })
                        } catch (e) {
                            console.log(e);
                        }

                    } else {

                        let list = [];
                        if (resData.Shippers.length >= 1 && resData.Shippers.length <= 6) {
                            for (let i = 0; i < resData.Shippers.length; i++) {
                                list.push(resData.Shippers[i].ShipperName)
                            }

                        } else if (resData.Shippers.length > 6) {
                            for (let i = 0; i < 6; i++) {
                                list.push(resData.Shippers[i].ShipperName)
                            }

                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '暂时没有查到该单号',
                                success: function (res) {
                                }
                            })
                        }

                        wx.showActionSheet({
                            itemList: list,
                            success: function (res) {
                                ShipperName = resData.Shippers[res.tapIndex].ShipperName;
                                ShipperCode = resData.Shippers[res.tapIndex].ShipperCode;

                                try {
                                    let historySearchList = wx.getStorageSync('historySearchList');
                                    if (!historySearchList) {
                                        historySearchList = [];
                                    };

                                    let newList = historySearchList.filter(function (val) {
                                        return (val.order != LogisticCode);
                                    });

                                    newList.push({
                                        "order": LogisticCode,
                                        "name": ShipperName,
                                        "code": ShipperCode,
                                    })

                                    wx.setStorage({
                                        key: "historySearchList",
                                        data: newList,
                                        success: function () {
                                            wx.navigateTo({
                                                url: '../detail/detail?LogisticCode=' + LogisticCode + '&ShipperCode=' + ShipperCode + '&ShipperName=' + ShipperName
                                            })
                                        }
                                    })
                                } catch (e) {
                                    console.log(e);
                                }

                            },
                            fail: function (res) {
                                console.log(res.errMsg)
                            }
                        })

                    }
                }
            })

        }

    },

    showDetail: function (event) {
        wx.navigateTo({
            url: '../detail/detail?LogisticCode=' + event.currentTarget.dataset.order + '&ShipperCode=' + event.currentTarget.dataset.code + '&ShipperName=' + event.currentTarget.dataset.name
        })
    }
})
