/*jshint esversion:6*/
import { CST } from "../CST";

export class HelpScene extends Phaser.Scene{
    constructor(){
        super({
            key: "help"
        });
    }

    init(){
    }

    create(){
        let help = this.add.image(0,0, "help1").setOrigin(0).setDepth(0);

        //buttons
        let backButton = this.add.image(10, 620, "back_button").setOrigin(0).setDepth(1);

        backButton.setInteractive();

        backButton.on("pointerover", ()=>{
            backButton.setTexture("back_buttonh");
        });
        backButton.on("pointerout", ()=>{
            backButton.setTexture("back_button");
        });
        backButton.on("pointerdown", ()=>{
            this.scene.start(CST.SCENES.MENU);
        });

    }
}