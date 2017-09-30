import {Base} from 'base.js';

class Collection extends Base{
    constructor(){
        super();
    }
    changeCollected(goods_id,collected,callback){
        var param = {
            url:'collection',
            data:{
                id:goods_id,
                collected:collected
            },
            method:'POST',
            sCallback:function(res){
                callback && callback(res)
            }
        };
        console.log('param')
        console.log(param);
        this.request(param);
    }
}

export {Collection};