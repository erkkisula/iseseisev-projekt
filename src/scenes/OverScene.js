/* jshint esversion:6*/
import { CST } from "../CST";


export class OverScene extends Phaser.Scene{
    constructor(){
        super({
            key: "gameover"
        });
    }

    init(data){
        console.log('init', data);
        this.finalScore = data.score;
        this.finalLevel = data.level;
        this.hiscore = 0;
        if (localStorage.getItem("hiscore") === null) {
            localStorage.setItem("hiscore", this.finalScore);
            this.hiscore = localStorage.getItem("hiscore");
        }else{
            if(this.finalScore > localStorage.getItem("hiscore")){
                localStorage.setItem("hiscore", this.finalScore);
                this.hiscore = localStorage.getItem("hiscore");
            }else{
                this.hiscore = localStorage.getItem("hiscore");
            }
        }
    }

    create(){

        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0);
        this.add.text(this.game.renderer.width / 2, 150, "Hiscore: " + Math.round(this.hiscore), { font: '48px Roboto', fill: '#000000' }).setDepth(2).setOrigin(0.5);
        this.add.text(this.game.renderer.width / 2,210, "Your score: " + Math.round(this.finalScore), { font: '48px Roboto', fill: '#000000' }).setDepth(2).setOrigin(0.5);
        this.add.text(this.game.renderer.width / 2,270, "Level reached: " + this.finalLevel, { font: '48px Roboto', fill: '#000000' }).setDepth(2).setOrigin(0.5);

        //buttons
        let backButton = this.add.image(10, 620, "back_button").setOrigin(0).setDepth(100);

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