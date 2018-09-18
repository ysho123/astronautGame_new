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
        defaultCompass : {
            default : null,
            type : cc.SpriteFrame
        },
        defaultArrow_left : {
            default : null,
            type : cc.SpriteFrame
        },
        defaultArrow_right : {
            default : null,
            type : cc.SpriteFrame
        },
        defaultArrow_left_1 : {
            default : null,
            type : cc.SpriteFrame
        },
        defaultArrow_right_1 : {
            default : null,
            type : cc.SpriteFrame
        },
        spriteAtlas : {
            default : null,
            type : cc.SpriteAtlas
        },
        spriteAtlas1 : {
            default : null,
            type : cc.SpriteAtlas
        },
        compassSprite : {
            default : null,
            type : cc.Sprite
        },
        arrow_left : {
            default : null,
            type : cc.Sprite
        },
        arrow_right : {
            default : null,
            type : cc.Sprite
        },
        level : {
            set : function(value){
                let num = value;
                this.compassSprite.spriteFrame = this.spriteMap.get(num.toString()) || this.defaultCompass;
                this.arrow_left.spriteFrame = this.spriteMap.get( num + '_left') || this.defaultArrow_left;
                this.arrow_right.spriteFrame = this.spriteMap.get( num + '_right') || this.defaultArrow_right;

                this.curleftArrow = this.spriteMap.get(num + '_left') ;
                this.currightArrow = this.spriteMap.get(num + '_right') ;
                this.curleftArrow_1 = this.spriteMap.get(num + '_left_1') ;
                this.currightArrow_1 = this.spriteMap.get(num + '_right_1') ;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spriteMap = new Map();
        this.curleftArrow = null ;
        this.currightArrow = null ;
        this.curleftArrow_1 = null;
        this.currightArrow_1 = null;

        this.spriteAtlas.getSpriteFrames().forEach( (item,key)=>{
            this.spriteMap.set(item.name,item);
        } );
        this.spriteAtlas1.getSpriteFrames().forEach( (item,key)=>{
            this.spriteMap.set(item.name,item);
        } );
    },

    leftPress(){
        this.arrow_left.spriteFrame = this.curleftArrow_1 || this.defaultArrow_left_1 ;
    },

    leftUnPress(){
        this.arrow_left.spriteFrame = this.curleftArrow || this.defaultArrow_left ;
    },

    rightPress(){
        this.arrow_right.spriteFrame = this.currightArrow_1 || this.defaultArrow_right_1 ;
    },

    rightUnPress(){
        this.arrow_right.spriteFrame = this.currightArrow || this.defaultArrow_right ;
    },

    start () {

    },

    // update (dt) {},
});
