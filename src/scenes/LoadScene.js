/* jshint esversion:6*/
import { CST } from "../CST";

export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LOAD
        });
    }
    init(){
        console.log("Loading...");
    }

    preload(){
        //UI
        this.load.image("title_bg", "./assets/img/game_bg.png");
        this.load.image("help1", "./assets/img/help1.png");
        this.load.image("help_button", "./assets/img/help_button.png");
        this.load.image("help_buttonh", "./assets/img/help_button_hover.png");
        this.load.image("back_button", "./assets/img/back_button.png");
        this.load.image("back_buttonh", "./assets/img/back_button_hover.png");
        this.load.image("play_button", "./assets/img/play_button.png");
        this.load.image("play_buttonh", "./assets/img/play_button_hover.png");
        this.load.image("logo", "./assets/img/logo.png");
        this.load.image("credits_button", "./assets/img/credits_button.png");
        this.load.image("credits_buttonh", "./assets/img/credits_button_hover.png");
        //Shop
        this.load.image("shop_button", "./assets/img/shop/shop_button.png");
        this.load.image("shop_buttonh", "./assets/img/shop/shop_button_hover.png");
        this.load.image("buy_button", "./assets/img/shop/buy_button.png");
        this.load.image("buy_buttonh", "./assets/img/shop/buy_button_hover.png");
        this.load.image("close_button", "./assets/img/shop/X_button.png");
        this.load.image("close_buttonh", "./assets/img/shop/X_button_hover.png");
        this.load.image("shop_back", "./assets/img/shop/ShopBack.png");
        //Enemies and player
        this.load.image("basic_enemy", "./assets/sprites/enemy1.png");
        this.load.image("homing_enemy", "./assets/sprites/enemy2.png");
        this.load.image("player", "./assets/sprites/player.png");
        this.load.image("wave1", "./assets/sprites/wave1.png");
        this.load.image("wave2", "./assets/sprites/wave2.png");
        this.load.image("wave3", "./assets/sprites/wave3.png");
        this.load.image("wave4", "./assets/sprites/wave4.png");
        this.load.image("rusher", "./assets/sprites/instagib.png");
        
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        });

        this.load.on("progress", (percent)=>{
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            console.log(percent);
        });

        this.load.on("complete", ()=>{
            console.log("Loading finished");
        });
    }
    

    create(){
        this.scene.start(CST.SCENES.MENU);
    }
}