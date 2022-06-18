// pages/check/check.js
const db = wx.cloud.database()
var fsm = wx.getFileSystemManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_list: [],
    search: '',
  },
  GetSearchInput: function (e) {
    this.setData({
      search: e.detail.value
    })
  },
  ToSearch: function (e) {
    if (this.data.search == '') {
      wx.showToast({
        title: '请输入',
        icon: 'none'
      })
      return
    }
    db.collection("img_infor").where({
      conten_char: db.RegExp({
        regexp: this.data.search,
        options: 'i',
      }),
    }).get().then(res => {
      console.log(res.data)
      if (res.data.length != 0) {
        var temp_list = []
        for (var i = 0; i < res.data.length; i++) {
          temp_list[i] = res.data[i].img_path
        }
        this.setData({
          img_list: temp_list
        })
      } else {
        wx.showToast({
          title: '未找到',
          icon: 'none'
        })
      }
    })
  },

  show_content: function (e) {
    db.collection("img_infor").where({
      img_path: e.currentTarget.id
    }).get().then(res => {
      var infor = res.data[0].conten_char
      wx.showModal({
        title: '图片内容',
        content: infor,
        confirmText: '下载图片',
        cancelText:'复制内容',
        success: function (res) {
          if (res.confirm) {
            console.log(e.currentTarget.id)
            wx.cloud.downloadFile({
              fileID: e.currentTarget.id, //这个地方的fileID就是云存储文件的fileID
              success: function (res) {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath, //图片文件路径
                  success: function (data) {
                      wx.showModal({
                          title: '提示',
                          content: '保存成功',
                          modalType: false,
                      })
                  },
                  // 接口调用失败的回调函数
                  fail: function (err) {
                      if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
                          wx.showModal({
                              title: '提示',
                              content: '需要您授权保存相册',
                              modalType: false,
                              success: modalSuccess => {
                                  wx.openSetting({
                                      success(settingdata) {
                                          console.log("settingdata", settingdata)
                                          if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                              wx.showModal({
                                                  title: '提示',
                                                  content: '获取权限成功,再次点击图片即可保存',
                                                  modalType: false,
                                              })
                                          } else {
                                              wx.showModal({
                                                  title: '提示',
                                                  content: '获取权限失败，将无法保存到相册哦~',
                                                  modalType: false,
                                              })
                                          }
                                      },
                                      fail(failData) {
                                          console.log("failData", failData)
                                      },
                                      complete(finishData) {
                                          console.log("finishData", finishData)
                                      }
                                  })
                              }
                          })
                      }
                  },
                  complete(res) {
                      wx.hideLoading(); //隐藏 loading 提示框
                  }
              })
              }
            })
          } else {
            wx.setClipboardData({
              data: infor, //data为点击后所复制内容
              success: function (res) {
                wx.getClipboardData({
                  // 这个api是把拿到的数据放到电脑系统中的
                  success: function (res) {
                    console.log(res.data) // 打印复制后的内容
                  }
                })
              }
            })
          }
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    var temp_list = []
    db.collection("img_infor").get({
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          temp_list[i] = res.data[i].img_path
        }
        that.setData({
          img_list: temp_list
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})