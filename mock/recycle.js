export default {
    getRecycle(req, res) {
        res.json({
            data: [
                {
                    id: 1,
                    brandId: 1,
                    name: "huawei p9",
                    status: 1,
                    picUrl: "www.chuangshouji.com:8089/phone/1508241525481.1.jpg",
                    totalPrice: 1000,
                    isHot: 1
                },
                {
                    id: 31,
                    brandId: 1,
                    name: "huawei p10",
                    status: 1,
                    picUrl: "www.chuangshouji.com:8089/phone/1508241525481.1.jpg",
                    totalPrice: 1999,
                    isHot: 1
                },
                {
                    id: 33,
                    brandId: 1,
                    name: "huawei p10",
                    status: 1,
                    picUrl: "www.chuangshouji.com:8089/phone/1508241525481.1.jpg",
                    totalPrice: 1999,
                    isHot: 0
                },
                {
                    id: 35,
                    brandId: 1,
                    name: "huawei p10",
                    status: 1,
                    picUrl: "www.chuangshouji.com:8089/phone/1508241525481.1.jpg",
                    totalPrice: 1999,
                    isHot: 0
                },
                {
                    id: 37,
                    brandId: 1,
                    name: "huawei p10",
                    status: 1,
                    picUrl: "www.chuangshouji.com:8089/phone/1508241525481.1.jpg",
                    totalPrice: 1999,
                    isHot: 0
                }
            ],
            errorCode: "101002",
            errorInfo: "操作成功！"
        })
    }
}