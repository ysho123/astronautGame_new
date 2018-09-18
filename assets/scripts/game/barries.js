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
        generateFlag : false , //越过生产线是否被检测
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.ScreenWidth = common.sysInfo.ScreenWidth ||  750 ;
        this.ScreenHeight = common.sysInfo.ScreenHeight ||  1334 ;
    },

    init(){
        this.generateFlag = false;
        
        let yposition =  common.sysInfo.ScreenHeight / 2 + this.node.height ;
        this.node.y = yposition;
    },

    start () {

    },

    // update (dt) {},
});
