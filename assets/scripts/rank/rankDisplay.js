let common  = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
       indexScript : Object,
       display: cc.Sprite
    },

    onLoad () {
        
    },

    start () {
        this.tex = new cc.Texture2D();
    },

    _updateSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    update () {
        this._updateSubDomainCanvas();
    },
     onDisable(){
        this.indexScript.activeButtons();
    },

    onEnable(){
        this.indexScript.stopButtons();
    }
});
