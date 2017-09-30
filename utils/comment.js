import {Base} from 'base.js';

class Comment extends Base {
    constructor(){
        super();
    }
    /**
     * 发起评论
     * @param {*} comment 
     * @param {*} goods_id 
     */
    submitComment(comment,goods_id,callback){
        var param = {
            url:'comment',
            method:'POST',
            data:{
                content:comment,
                goods_id:goods_id
            },
            sCallback:function(res){
                wx.showToast({
                    title:'评论成功',
                    duration:1200
                })
                callback && callback(res);
            },
            eCallback:function(res){
                wx.showToast({
                    title:'评论失败',
                    image:'/imgs/icon/fail.png'
                })
            }
        };
        this.request(param);
    }
    /**
     * 分页获得评论
     * @param {*} goods_id 
     * @param {*} page 
     * @param {*} size 
     * @param {*} callback 
     */
    getCommentsByPaginate(goods_id,page,size,callback){
        var param = {
            url:'comment/paginate',
            method:'GET',
            data:{
                goods_id:goods_id,
                page:page,
                size:size
            },
            sCallback:function(res){
                callback && callback(res)
            }
        }
        this.request(param);
    }
}

export {Comment}