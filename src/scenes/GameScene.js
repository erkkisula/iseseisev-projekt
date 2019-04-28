/* jshint esversion:6*/
import { CST } from "../CST";

export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.GAME
        });

        this.score = 0;
        this.playerHealth = 0;
        this.level = 1;
    }

    init(){
        console.log("Game starting...");
    }

    preload(){
        let healthbar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        });
    }

    create(){
        this.info = this.add.text(10,10, "Score: " + this.score, { font: '48px Arial', fill: '#000000' }).setDepth(2);
        //this.player = this.physics.add.sprite(200, 200, 'player').setDepth(1);
        this.add.existing(new Player(this, 600, 300)).setDepth(1);
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0);

    }

    update(){
        //punktid
        this.score += 0.1;
        this.info.setText('Score: ' + Math.round(this.score));
    }

}

class Player extends Phaser.GameObjects.Sprite{
    constructor (scene, x, y){
        super(scene, x, y);

        this.setTexture('player');
        this.setPosition(x, y);
    }
}
