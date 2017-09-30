import {Base} from '../../utils/base.js';

class GoodsDetail extends Base{

    constructor(){
        super();
    }

    getDetail(id,callback) {
        var param = {
            url:'goods/' + id,
            method:'GET',
            sCallback:function(res){
                callback(res)
            }
        };
        this.request(param);
    }
    /**
     * 修改商品价格
     * @param {*} goods_id 
     * @param {*} sale_price 
     * @param {*} callback 
     */
    modifyGoodsPrice(goods_id,sale_price,callback){
        var param = {
            url:'goods/price',
            method:'POST',
            data:{
                id:goods_id,
                sale_price:sale_price
            },
            sCallback:function(res){
                callback && callback(res)
            }
        }
        this.request(param);
    }
    /**
     * 已售标记
     * @param {*} goods_id 
     * @param {*} callback 
     */
    signSaled(goods_id,callback){
        var param = {
            url:'goods/saled',
            method:'POST',
            data:{
                id:goods_id
            },
            sCallback:function(res){
                callback && callback(res)
            }
        }
        this.request(param);
    }
}

export {GoodsDetail};