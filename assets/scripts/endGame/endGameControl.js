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
        endGameSpriteNode : {
            default : null,
            type : cc.Node
        },
        endGameSprite : {
            default : null,
            type : cc.Sprite
        },
        textLabel : {
            default : null,
            type : cc.Label
        },
        level :  0,
        againBtn : {
            default : null,
            type : cc.Node
        },
        shareBtn : {
            default : null,
            type : cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.openid = common.userInfo.openid;

        if(common.ifHidden){
            this.againBtn.x = 0 ;
            this.shareBtn.active = false ;
        }     
    },

    loadSource(){
        this.engGameSpriteMap = new Map();
        this.loadEndGameBigImg();
        this.endGameSpriteNode.getComponent('cardControl').loadSource();
    },

    onEnable(){
        let title = '';
        let spriteIndex = 0 ;

        switch(this.level){
            case 0 : 
                title = '月球踏步';
                spriteIndex = 0 ;
                break;
            case 1 : 
                title = '走近地球';
                spriteIndex = 1 ;
                break;
            case 2 : 
                title = '水星观光者';
                spriteIndex = 2 ;
                break; 
            case 3 : 
                title = '金星穿越者';
                spriteIndex = 3 ;
                break; 
            case 4 : 
                title = '火星首批访客';
                spriteIndex = 4 ;
                break;
            case 5 : 
                title = '木星丘比特';
                spriteIndex = 5 ;
                break; 
            case 6 : 
                title = '土星原始人';
                spriteIndex = 6 ;
                break;  
            case 7 : 
                title = '天王星好远啊';
                spriteIndex = 7 ;
                break; 
            case 8 : 
                title = '海王星圣斗士';
                spriteIndex = 8 ;
                break; 
            case 9 : 
                title = '冥王星是行星吗';
                spriteIndex = 9 ;
                break; 
        }

        this.textLabel.string = title ;
        this.endGameSprite.spriteFrame = this.engGameSpriteMap.get(spriteIndex);

        //卡片界面
        this.endGameSpriteNode.getComponent('cardControl').frontSpriteFrame = this.endGameSprite.spriteFrame ;
        this.endGameSpriteNode.getComponent('cardControl').level = this.level ;

        if(this.openid){
            if(common.honorInfo.length < this.level+1){
                util.pullRequest('setHonor',{openid : this.openid,honor_lv : this.level+1},(res)=>{
                    if(res.code == 1){
                        common.honorInfo = res.honorInfo ;
                    }
                });
             }
        }
    },

    loadEndGameBigImg(){
        for( let i=0; i<10 ; i++ ){
            util.loadRemoteImageArr('endGameBigImage',i,(spriteFrame)=>{
                this.engGameSpriteMap.set(i,spriteFrame);
            });
        }
    },

    start () {

    },

    // update (dt) {},
});
