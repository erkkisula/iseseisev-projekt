/* jshint esversion:6*/
import { CST } from "../CST";

export class MenuScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.MENU
        });
    }
    init(data){
        console.log(data);
        console.log("Ready!");
    }
    create(){
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0);
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, "logo").setDepth(1);

        //Menu Buttons
        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "play_button").setDepth(1);
        let optionsButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 +100, "options_button").setDepth(1);
        let creditsButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 +200, "credits_button").setDepth(1);

        playButton.setInteractive();

        playButton.on("pointerover", ()=>{
            playButton.setTexture("play_buttonh");
        });
        playButton.on("pointerout", ()=>{
            playButton.setTexture("play_button");
        });

        optionsButton.setInteractive();

        optionsButton.on("pointerover", ()=>{
            optionsButton.setTexture("options_buttonh");
        });
        optionsButton.on("pointerout", ()=>{
            optionsButton.setTexture("options_button");
        });
        optionsButton.on("pointerdown", ()=>{
            console.log("DEBUG: click!");
        });

        creditsButton.setInteractive();

        creditsButton.on("pointerover", ()=>{
            creditsButton.setTexture("credits_buttonh");
        });
        creditsButton.on("pointerout", ()=>{
            creditsButton.setTexture("credits_button");
        });
    }
}