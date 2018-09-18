// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        speedUpinterval : 10,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.breakFlag = false ;
    },

    /**
        控制关卡的切换
        第一关  100分    
        ...     200分
        1000分

    */
    addScore(score){
        //加速    极限速度350
        if( score % this.speedUpinterval == 0 && score <= 300 ){
            this.node.dispatchEvent( new cc.Event.EventCustom('speed-up', true) );
        }

        //过关
        this.breakLevelCheck(score);
        
    },

    breakLevelCheck(score){
        let event = new cc.Event.EventCustom('break-level', true) ;

        this.node.getComponent('cc.Label').string = score + '光年';

        if(score == 20){
            event.detail = { level : 1 };
        }else if(score == 45){
            event.detail = { level : 2 };
        }else if(score == 75){
            event.detail = { level : 3 };
        }else if(score == 110){
            event.detail = { level : 4 };
        }else if(score == 150){
            event.detail = { level : 5 }; 
        }else if(score == 195){
            event.detail = { level : 6 }; 
        }else if(score == 245){
            event.detail = { level : 7 }; 
        }else if(score == 300){
            event.detail = { level : 8 };
        }else if(score == 360){
            event.detail = { level : 9 };
        }else{
        // } if(score == 425){
        //     event.detail = { level : 9 };
        // }else{
            return ;
        }
        
        this.node.dispatchEvent(event);   
    },  

    start () {

    },

    // update (dt) {},
});
