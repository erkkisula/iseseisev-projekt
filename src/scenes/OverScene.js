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
    }

    create(){
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0);    
        this.add.text(this.game.renderer.width / 2,210, "Your score: " + Math.round(this.finalScore), { font: '48px Arial', fill: '#000000' }).setDepth(2).setOrigin(0.5);
        this.add.text(this.game.renderer.width / 2,270, "Level you reached: " + this.finalLevel, { font: '48px Arial', fill: '#000000' }).setDepth(2).setOrigin(0.5);
    }
}