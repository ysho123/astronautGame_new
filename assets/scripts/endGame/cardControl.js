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

cc.Class({
    extends: cc.Component,

    properties: {
        frontSpriteFrame : {
            default : null,
            type : cc.SpriteFrame
        },
        backSpriteFrame : {
            default : null,
            type : cc.SpriteFrame
        },
        defaultCardSpriteFrame : {
            default : null,
            type : cc.SpriteFrame  
        },
        level : 0 ,
    },


    // onLoad () {
    // },

    paiclick(){
        this.backSpriteFrame = this.cardSpriteMap.get(this.level) || this.defaultCardSpriteFrame ;

        let scaleSeq ;

        if(this.clickNum % 2 == 0){
            //为偶数时 翻到背面
            let callFuc1 = cc.callFunc(()=>{
                this.node.getComponent(cc.Sprite).spriteFrame = this.backSpriteFrame;
            }, this);
            let callFuc2 = cc.callFunc(()=>{
                this.clickNum ++ ;
            }, this);
            scaleSeq = cc.sequence(cc.scaleTo(0.5, 0, 1),callFuc1,cc.scaleTo(0.5, -1, 1),callFuc2);
        }else{
            //从背面翻到正面
            let callFuc1 = cc.callFunc(()=>{
                this.node.getComponent(cc.Sprite).spriteFrame = this.frontSpriteFrame;
            }, this);
            let callFuc2 = cc.callFunc(()=>{
                this.clickNum ++ ;
            }, this);
            scaleSeq = cc.sequence(cc.scaleTo(0.5, 0, 1),callFuc1,cc.scaleTo(0.5, 1, 1),callFuc2);
        }

        this.node.runAction(scaleSeq);
    },

    update(dt) {

    },

    loadSource(){
        this.cardSpriteMap = new Map();
        this.loadCardBigImg();
    },

    loadCardBigImg(){
        for( let i=0; i<10 ; i++ ){
            util.loadRemoteImageArr('cardBigImage',i,(spriteFrame)=>{
                this.cardSpriteMap.set(i,spriteFrame);
            });
        }
    },

    onEnable(){
        this.clickNum = 0 ;        
    },

    start () {

    },

});
