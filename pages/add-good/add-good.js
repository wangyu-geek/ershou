// add-good.js
import {Base} from '../../utils/base.js';
import {Image} from '../../utils/image.js';
import {Number} from '../../utils/number.js';
import {Good} from 'good-model.js';

var base = new Base();
var image = new Image();
var number = new Number();
var good = new Good();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canBeKnife:false,
    postageFree:false,
    uploadUrl: "",
    contacts: ["手机", "微信", "QQ"],
    contactKey:0,
    selectedImgs: [],
    selectingImgCount: 4, //可选数量,
    wantSellPrice: null,
    originalPrice: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function (options) {
  },

  onUnload: function () {
    image.init();
  },
  /**
   * 添加图片
   */
  onChooseImgTap: function (res) {
    image.chooseImg((selectingImgCount, selectedImgs) => {
      if (res == false) {
        return;
      }
      this.setData({
        selectedImgs: selectedImgs,
        selectingImgCount: selectingImgCount
      })
    })
  },
  /**
   * 想卖
   */
  onWantSellInput: function (event) {
    var input_num = base.getEventValue(event);
    var before_input_num = this.data.wantSellPrice;
    number.setInput(input_num,before_input_num, (number) => {
      this.setData({
        wantSellPrice: number
      })
    });
  },
  /**
   * 原价
   */
  onOriginalPriceInput: function (event) {
    var input_num = base.getEventValue(event);
    var before_input_num = this.data.originalPrice;
    number.setInput(input_num,before_input_num, (number) => {
      this.setData({
        originalPrice: number
      })
    });
  },
  /**
   * 联系方式
   */
  onContactWayChange: function(event) {
    var key = base.getEventValue(event);
    this.setData({
      contactKey: key
    })
  },
  /**
   * 可小刀
   */
  onKnifeChange: function(event) {
    var values = base.getEventValue(event);
    var checked = values[0] == "false"? true:false;
    this.setData({
      canBeKnife: checked
    })
  },
  // 包邮
  onSwitchChange: function(event) {
    var value = base.getEventValue(event);
    this.setData({
      postageFree:value
    })
  },
  //表单提交
  formSubmit: function (e) {
    var formValue = base.getEventValue(e);
    var is_pass = good.checkFormData(formValue,this.showToast)
    if(!is_pass){
      return;
    }

    var send_data = good.formatGoodInfo(formValue);

    good.saveGoodOnServer(send_data,(res)=>{
      wx.setStorageSync('goodsRefresh', true);
      wx.switchTab({
        url: '../goods/goods',
      })
    });
    
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  
  showToast(title){
    wx.showToast({
      title:title,
      icon:'loading'
    })
  }
})