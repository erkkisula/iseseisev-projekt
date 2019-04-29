/* jshint esversion:6*/
import { CST } from "../CST";

export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LOAD
        });
    }
    init(){
        
    }

    preload(){
        //UI
        this.load.image("title_bg", "./assets/img/game_bg.png");
        this.load.image("options_button", "./assets/img/options_button.png");
        this.load.image("options_buttonh", "./assets/img/options_button_hover.png");
        this.load.image("play_button", "./assets/img/play_button.png");
        this.load.image("play_buttonh", "./assets/img/play_button_hover.png");
        this.load.image("logo", "./assets/img/logo.png");
        this.load.image("credits_button", "./assets/img/credits_button.png");
        this.load.image("credits_buttonh", "./assets/img/credits_button_hover.png");

        //Enemies and player
        this.load.image("basic_enemy", "./assets/img/enemy1.png");
        this.load.image("player", "./assets/sprites/player.png");

        
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