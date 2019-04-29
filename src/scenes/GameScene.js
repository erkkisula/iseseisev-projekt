/* jshint esversion:6*/
import { CST } from "../CST";

export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.GAME
        });

        this.score = 0;
        this.playerHealth = 100;
        this.playerImmune = 0;
        this.level = 1;
        
        this.lastBasic = 500;
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
        this.player = this.add.existing(new Player(this, 600, 300)).setDepth(1);
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0);    
        //Grupid
        this.basicenemies = this.add.group();
        this.physics.add.collider(this.player, this.basicenemies, this.playerHitBasic, null, this);
    }

    update(){
        //punktid
        this.score += 0.1;
        this.info.setText('Score: ' + Math.round(this.score));
        this.lastBasic += 1;
        this.spawnBasics();
        console.log(this.playerHealth);
    }

    playerHitBasic(){
        if(this.playerImmune == 0){
            this.playerHealth -= 25;
        }
        
    }

    spawnBasics(){
        if(this.lastBasic > Phaser.Math.Between(150,300)){
            this.bEnemy = this.add.existing(new BasicEnemy(this, Phaser.Math.Between(50, 900), Phaser.Math.Between(50, 680)).setDepth(1));
            this.physics.add.existing(this.bEnemy);
            this.basicenemies.add(this.bEnemy);
            this.lastBasic = 0;
        }
    }

    spawnWavesEasy(){

    }
}



class Player extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene, x, y);

        this.setTexture('player');
        this.setPosition(x, y);
        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.keys = this.scene.input.keyboard.createCursorKeys();
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        //Player movement
        if(this.keys.right.isDown){
            this.setVelocityX(250);
        }else if(this.keys.right.isUp){
            this.setVelocityX(0);
        } 
        //ainult üks on vaja olla up     
        if(this.keys.left.isDown){
            this.setVelocityX(-250);
        }

        if(this.keys.up.isDown){
            this.setVelocityY(-250);
        }else if(this.keys.up.isUp){
            this.setVelocityY(0);
        }
        if(this.keys.down.isDown){
            this.setVelocityY(250);
        }
    }
}

class BasicEnemy extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene, x, y);
        this.setTexture('basic_enemy');
        this.setPosition(x, y);
        this.timeAlive = 0;

        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.setVelocity(300,300);
        this.setBounce(1,1);
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        
        //movement
        this.timeAlive += 1;
        //this.setVelocityY(Phaser.Math.Between(-200,200), Phaser.Math.Between(-200,200));

        //time alive
        this.checkAlive();
    }

    checkAlive(){
        if(this.timeAlive > Phaser.Math.Between(400, 700)){
            this.destroy();
        }
    }
}
