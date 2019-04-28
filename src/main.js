/* jshint esversion:6*/

import {LoadScene} from "./scenes/LoadScene";
import {MenuScene} from "./scenes/MenuScene";
import {GameScene} from "./scenes/GameScene";

let config = {
    width:960,
    height:720,
    physics: {
        default: "arcade"
    },
    scene:[
        LoadScene, MenuScene, GameScene
    ]
};

let game = new Phaser.Game(config);