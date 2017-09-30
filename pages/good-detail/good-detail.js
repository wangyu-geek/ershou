import {GoodsDetail} from 'goods-detail-model.js';
import {Mobile} from '../../utils/mobile.js';
import {Comment} from '../../utils/comment.js';
import {Collection} from '../../utils/collection.js';
import { Number } from '../../utils/number.js';

var mobile = new Mobile();
var comment = new Comment();
var goodsDetail = new GoodsDetail();
var collect = new Collection();
var number = new Number();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:null,
    goodsId:-1,
    page:1,
    size:15,
    comments:[],
    isLoadingGoods:false,  //正在加载商品详情
    isLoadingComments:false,
    hasMore:true,  //还有更多评论,
    showModal: false, //弹窗
    decPrice:null,
    comment:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      goodsId:id,
    })
    this.getGoodsDetail(this.data.goodsId);
    this.getComments();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refreshPage();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('到底啦');
    this.getComments();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  onContactTap:function(event){
    var data = goodsDetail.getEventData(event);
    var contactWay = data['contactWay'];
    var contactNumber = data['contactNumber'];
    if(contactWay == "QQ" || contactWay == "微信"){
      goodsDetail.setClipboardData(contactNumber);
    }
    else if(contactWay == "手机") {
      mobile.call(contactNumber)
    }
    else{
      return;
    }
  },

  onCommentSubmit: function(event){
    var value = goodsDetail.getEventValue(event);
    var comment_text = value.comment;
    var goodsId = this.data.goodsId;
    if(comment_text == ""){
      goodsDetail.showToast('请添加内容','loading');
      return;
    }
    else{
      // 发起评论请求
      comment.submitComment(comment_text,goodsId,(res)=>{
        wx.startPullDownRefresh();
        this.setData({
          comment:''
        })
      })
    }
  },
  /**
   * 分页获得评论
   */
  getComments:function(){
    if(this.data.isLoadingComments){
      console.log('等一等')
      return;
    }
    else{
      this.setData({
        isLoadingComments:true
      })
    }
    if(!this.data.hasMore){ //如果有更多，继续继续加载，否则停止加载
      return;
    }
    else{
      wx.showNavigationBarLoading();  //加载
      comment.getCommentsByPaginate(this.data.goodsId,this.data.page,this.data.size,(res)=>{
        var comments = res.data.data;
        comments = this.data.comments.concat(comments); //合并数组
        this.data.page++;
        this.setData({
          comments:comments,
          isLoadingComments:false,
          page:this.data.page,
          hasMore:res.has_more?true:false
        })
        wx.hideNavigationBarLoading();
      });
    }
  },
  /**
   * 获得商品详情
   */
  getGoodsDetail:function(id){  
      if(this.data.isLoadingGoods){  //如果正在加载，
        return;
      }
      else{
        this.setData({
          isLoadingGoods:true
        })
      }
      wx.showNavigationBarLoading();  // 显示标题的加载栏
      goodsDetail.getDetail(id,(res) => {
      var data = res.data;
      var contact_number = data.contact_number;
      var substr_contact = goodsDetail.subString(contact_number);
      data['substr_contact'] = substr_contact;
      this.setData({
        goods:data,
        isLoadingGoods:false
      })
      wx.hideNavigationBarLoading();  //隐藏标题加载栏
      wx.stopPullDownRefresh();       // 停止页面下拉刷新
    })

  },
  /**
   * 刷新页面
   */
  refreshPage:function(){
    this.pageInit();
    this.getGoodsDetail(this.data.goodsId);
    this.getComments();
  },
  /**
   * 初始化页面
   */
  pageInit:function(){
    this.setData({
      hasMore:true,
      isLoadingComments:false,
      isLoadingGoods:false,
      page:1,
      comments:[],
    })
  },
    /**
   * 喜欢
   */
  onLikeTap:function(event){
    console.log('event')
    console.log(event);
    var data = goodsDetail.getEventData(event);
    var id = data['id']
    var collected = !data['collected'];
    collect.changeCollected(id,collected,(res)=>{
      this.data.goods['user_collect'][0] = {collected:collected};
      if(collected) // 改变喜欢的数量
      {
        this.data.goods['collect_count']++;
      }
      else{
        this.data.goods['collect_count']--;
      }
      this.setData({
        goods:this.data.goods
      })
    })
  },
  /**
   * 分享
   */
  onShareTap:function(event){
    console.log('nimei')
    // wx.showShareMenu();
    event['from'] = 'button';
    this.onShareAppMessage(event);
  },
  /**
   * 转发
   */
 onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '河工大淘二手',
      success: function(res) {
        // 转发成功
        console.log('转发成功')
        console.log(res)
      },
      fail: function(res) {
        // 转发失败
        console.log('转发失败');
        console.log(res)
      }
    }
  },
  /**
   * 标记出售
   */
  onSignSaledTap:function(event){
    goodsDetail.signSaled(this.data.goodsId,(res)=>{
      console.log(res)
    })
  },
  /**
 * 降价，弹窗
 */
  onDecPriceTap: function (event) {
    
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function (event) {
    console.log('别摸我')
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
    this.setData({
      decPrice:null
    });
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    // 把 goods_id 和 decPrice 发送到服务器
    goodsDetail.modifyGoodsPrice(this.data.goodsId,this.data.decPrice,(res)=>{
      this.data.goods['sale_price'] = this.data.decPrice;
      this.setData({
        goods:this.data.goods
      })
    })
  },
  /**
   * 价格输入
   */
  priceInputChange:function(event){
      var value = goodsDetail.getEventValue(event);
      var decPrice = this.data.decPrice;
      var max = this.data.goods.sale_price;

      number.setInput(value,decPrice,(number)=>{
        this.setData({
          decPrice:number
        })
      },max)
  }
})