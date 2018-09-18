// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let util = require('util');
let common = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        player1 : {
            default : null,
            type : cc.Node
        },
        player2 : {
            default : null,
            type : cc.Node
        },
        compassNode : {
            default : null,
            type : cc.Node
        }
    },

    onLoad () {
        util.fiexScreenSize(null,[this.node]);//调整当前节点的尺寸，防止坐标不准确

        this.compassScript = this.compassNode.getComponent('compassControl');

        this.ScreenWidth = common.sysInfo.ScreenWidth ||  750 ;
        this.ScreenHeight = common.sysInfo.ScreenHeight ||  1334 ;
        this.play1positon1 = -parseInt(this.ScreenWidth/8 );
        this.play1positon2 = -parseInt(this.ScreenWidth*3/8 );
        this.play2positon1 = parseInt(this.ScreenWidth/8 );
        this.play2positon2 = parseInt(this.ScreenWidth*3/8 );

        this.adjustPlayerPosition();
        this.registerListener();
    },

    adjustPlayerPosition(){
        this.player1.x = - parseInt(this.ScreenWidth / 8 );
        this.player2.x =   parseInt(this.ScreenWidth / 8 );
    },

    play1Move(){
        let moveByAction = cc.moveTo(0.03, cc.v2(this.play1positon2, this.player1.y));
        this.player1.runAction(moveByAction);

        this.compassScript.leftPress();
    },

    play1Back(){
        let moveByAction = cc.moveTo(0.03, cc.v2(this.play1positon1, this.player1.y));
        this.player1.runAction(moveByAction);

        this.compassScript.leftUnPress();
    },

    play2Move(){
        let moveByAction = cc.moveTo(0.03, cc.v2(this.play2positon2,this.player2.y));
        this.player2.runAction(moveByAction);

        this.compassScript.rightPress();
    },

    play2Back(){
        let moveByAction = cc.moveTo(0.03, cc.v2(this.play2positon1, this.player2.y));
        this.player2.runAction(moveByAction);

        this.compassScript.rightUnPress();
    },

    registerListener(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchAction, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.endAction, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.moveAction, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.cancelAction, this);
    },

    touchAction(e){
        e.stopPropagation(); //停止冒泡

        let touchPosition = e.currentTouch['_point'].x;

        if(touchPosition <= this.ScreenWidth / 2){
            this.play1Move();
        }
        if(touchPosition > this.ScreenWidth / 2){
            this.play2Move();
        }
    },

    endAction(e){
        e.stopPropagation(); //停止冒泡

        let touchPosition = e.currentTouch['_point'].x;

        if(touchPosition <= this.ScreenWidth / 2){
             if(!this.play2through){
                this.play1Back();
            }else{
                this.play2Back();
                this.play2through = false;
            }
        }
        if(touchPosition > this.ScreenWidth / 2){
            if(!this.play1through){
                this.play2Back();
            }else{
                this.play1Back();
                this.play1through = false;
            }
        }
    },

    moveAction(e){
        e.stopPropagation(); //停止冒泡

        let startX = e.currentTouch['_startPoint'].x;
        let endX = e.currentTouch['_point'].x;

        if(startX <= this.ScreenWidth / 2 && endX > this.ScreenWidth / 2){
            //从左边开始，到右边才放手
            this.play1through = true;
        }

        if(startX >= this.ScreenWidth / 2 && endX < this.ScreenWidth / 2){
            //从右边开始，到左边才放手
            this.play2through = true;
        }
    },

    cancelAction(e){
        e.stopPropagation(); //停止冒泡
        //电话响或者其他事件发生导致触点失效
        this.adjustPlayerPosition();
    },

    cancelListener(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchAction, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.endAction, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.moveAction, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.cancelAction, this);
    },

    reset(){
        this.registerListener();
        this.play1through = false;
        this.play2through = false;
    },

    start () {

    },

    // update (dt) {},
});
