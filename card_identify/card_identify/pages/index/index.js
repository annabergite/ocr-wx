// index.js
//index.js
//获取应用实例
const db = wx.cloud.database().collection("img_infor")
var app = getApp()
Page({
  data: {
    tempFilePaths: '',
    have_img: false,
    infor: []
  },
  onLoad: function () {},
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths)
        var img_path = res.tempFilePaths[0]
        var fileName = res.tempFilePaths[0].slice(11)
        that.setData({
          tempFilePaths: img_path,
        })
        wx.uploadFile({
          url: 'http://127.0.0.1:5000/', //
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: null,
          success: function (res) {
            var reponse_data
            reponse_data = JSON.parse(res.data)
            console.log(JSON.parse(res.data))
            that.setData({
              infor: reponse_data.content,
              have_img: true
            })
            console.log(fileName)
            wx.cloud.uploadFile({
              cloudPath: 'img/'+ fileName, // 上传至云端的路径
              filePath: img_path,
              success: res => {
                // 返回文件 ID
                console.log(res.fileID)
                // 添加到数据库
                db.add({
                  data: {
                    "img_path": res.fileID,
                    "conten_char": reponse_data.content,
                  },
                  success: function (res) {
                    console.log(res)
                  }
                })
              },
              fail: console.error
            })
          }
        })
      }
    })
  }
})