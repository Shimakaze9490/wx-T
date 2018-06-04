Page({
    data: {
        region_start: ['广东省', '广州市', '海珠区'],
        region_end: ['广东省', '广州市', '海珠区'],
        customItem: '全部',
        price: [6, 7, 8, 9, 10, 6, 7, 9, 9, 10],
        weight: 0,  //总重量
        price_totle: 0, //总价格
        first_weight: 0,  //首重价格
        s_weight: 0,    //剩余重量价格
        random : undefined,  
        user_Info :undefined
    },
    onShow: function () {
        let random = Math.floor(Math.random() * 10);
        this.setData({
            first_weight: this.data.price[random] + 3,
            s_weight: this.data.price[random]
        });
        this.setData({
            user_Info : wx.getStorageSync("user_Info")
        })
    },





    bindRegionChange_start: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region_start: e.detail.value
        })
    },
    bindRegionChange_end: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region_end: e.detail.value
        });
        let random = Math.floor(Math.random() * 10);
        // console.log("random:");
        // console.log(random);
        this.setData({
            random : random,
            first_weight: this.data.price[random] + 3,
            s_weight: this.data.price[random]
        });
        this.compute_price();
        // console.log("调整的价格：")
        // console.log(this.data.first_weight);
        // console.log(this.data.s_weight);
    },

    compute_price: function () {
        // let random = Math.floor(Math.random() * 10);
        this.setData({
            price_totle: this.data.s_weight * (this.data.weight - 1) + this.data.first_weight
        })
        // console.log(this.data.price_totle);
    },

    add: function () {
        this.setData({
            weight: this.data.weight + 1
        }, () => {
            this.compute_price();
            // this.setData({
            //     price_totle: (this.data.weight - 1) * this.data.price[0] + this.data.price[3]
            // })
        });
    },
    sub: function () {
        if (this.data.weight > 1) {
            this.setData({
                weight: this.data.weight - 1
            }, () => {
                this.compute_price();
                // this.setData({
                //     price_totle: (this.data.weight - 1) * this.data.price[0] + this.data.price[3]
                // })
            })
        }
    }
})