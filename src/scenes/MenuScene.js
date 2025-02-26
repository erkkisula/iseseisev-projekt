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
        console.log("Menu Ready!");
    }
    create(){
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0);
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, "logo").setDepth(1);

        //Menu Buttons
        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "play_button").setDepth(1);
        let helpButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 +100, "help_button").setDepth(1);

        playButton.setInteractive();

        playButton.on("pointerover", ()=>{
            playButton.setTexture("play_buttonh");
        });
        playButton.on("pointerout", ()=>{
            playButton.setTexture("play_button");
        });
        playButton.on("pointerdown", ()=>{
            this.scene.start(CST.SCENES.GAME);
        });

        helpButton.setInteractive();

        helpButton.on("pointerover", ()=>{
            helpButton.setTexture("help_buttonh");
        });
        helpButton.on("pointerout", ()=>{
            helpButton.setTexture("help_button");
        });
        helpButton.on("pointerdown", ()=>{
            this.scene.start("help");
        });
    }
}