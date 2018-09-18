// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let common = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        rocketNode : {
            default : null,
            type : cc.Node
        },
        vedioNode : {
            default : null,
            type : cc.Node
        },
        textNode : {
            default : null,
            type : cc.Node
        },
        sp1Node : {
            default : null,
            type : cc.Node
        },
        text2Node : {
            default : null,
            type : cc.Node
        },
        rocketLabel : {
            default : null,
            type : cc.Label
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

    },

    onEnable(){
        let coin = common.userInfo.coin ; 
        this.rocketLabel.string = 'X ' + coin;
    },

    showMyself(rocketRevival,vedioRevival){
        if( rocketRevival && !vedioRevival ){
            this.rocketNode.active = false ;
            this.vedioNode.x = 0 ;
            this.node.active = true ;

            this.textNode.y = -15 ;
            this.sp1Node.active = false ;
            this.text2Node.active = false ;
            return;
        }
        
        if( !rocketRevival && vedioRevival ){
            this.vedioNode.active = false ;
            this.rocketNode.x = 0 ;
            this.node.active = true ;
            return;
        }

        this.node.active = true ;
    },

    reset(){
        this.rocketNode.x = -136 ; 
        this.rocketNode.active = true ;
        this.vedioNode.x = 136 ;
        this.vedioNode.active = true ;

        this.textNode.y =  30 ;
        this.sp1Node.active = true ;
        this.text2Node.active = true ;
    }

    // update (dt) {},
});
