/* jshint esversion:6*/

import {LoadScene} from "./scenes/LoadScene";
import {MenuScene} from "./scenes/MenuScene";

let config = {
    width:960,
    height:720,
    scene:[
        LoadScene, MenuScene
    ]
};

let game = new Phaser.Game(config);