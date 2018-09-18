let util = require('util');
let common = require('common');
cc.Class({
    extends: cc.Component,

    properties: {
        playerControl :{
            default : null,
            type : cc.Node
        },
        inviteBtn: {
            default : null,
            type: cc.Node
        },
        inviteNum : {
            default : null,
            type: cc.Label
        },
        hasInviteFrame : {
            default : null,
            type : cc.SpriteFrame
        },
        noInviteFrame : {
            default : null,
            type : cc.SpriteFrame
        },
        hasInviteFrame1 : {
            default : null,
            type : cc.SpriteFrame
        },
        noInviteFrame1 : {
            default : null,
            type : cc.SpriteFrame
        },
       indexScript: Object
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 拿openid
        this.openid = common.userInfo.openid;
        this.shareData = util.getShareContent();
        console.log('shareDara:',this.shareData);
    },

    start () {

    },

    // 关闭邀请
    closeInvite(){
        this.node.getChildByName('invite_bk').runAction(util.zoomOutAction(()=>{
                this.node.active = false;
        }));
    },

    // 邀请用户
    addInvite(){
        // let shareData = util.getShareContent();
        wx.shareAppMessage({
            title : this.shareData.word,
            imageUrl : this.shareData.pic,
            query : 'invite_openid=' + this.openid
        })
    },

    // 获取用户邀请记录
    getInvite(openid){
        util.pullRequest('getUserInviteLog',{openid},(res)=>{
            console.log('用户邀请记录',res)
            if(res.code == 1){
                this.indexScript.coinNum.string = res.score;
                if(res.data){
                    // 给当前邀请人数赋值
                    this.inviteNum.string = res.data.num || 0;

                    let player = this.playerControl.children;
                    player.forEach((item,key)=>{
                        // console.log('item:',item);
                        // console.log('key:',key);
                        if(key < res.data.num){
                            item.getComponent('cc.Sprite').spriteFrame = this.hasInviteFrame;
                            item.getChildByName('no_invite').getComponent('cc.Sprite').spriteFrame = this.hasInviteFrame1;
                        }else{
                            item.getComponent('cc.Sprite').spriteFrame = this.noInviteFrame;
                            item.getChildByName('no_invite').getComponent('cc.Sprite').spriteFrame = this.noInviteFrame1;
                        }
                    });

                    // 当邀请已经满6人 按钮点击无效
                    if(res.data.num > 6){
                        this.inviteBtn.interactable = false;
                    }else{
                        this.inviteBtn.interactable = true;
                    }


                }
            }
        })
    },

    onEnable(){
        this.getInvite(this.openid);
         
        this.indexScript.stopButtons();
    },

    onDisable(){
        this.indexScript.activeButtons();
    }

    // update (dt) {},
});
