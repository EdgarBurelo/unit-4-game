var characterS = {
    "healthPoints": 0,
    "attackPower": 0,
    "counterAttackPower": 0,
    "characterName":"",
    "characterType": "", // CPU, Player1
    "characterStatus":"", //dead, defend, attack
    "attackFunction": function(charaterAttacked) {
        charaterAttacked.healthPoints = charaterAttacked.healthPoints - this.attackPower;
        $("#gameStatus").html("You attacked "+charaterAttacked.characterName + " for "+ this.attackPower+" damage.<br>");
        this.attackPower = this.attackPower + 10;
        //show healthpoints in dom
        //console.log("#health"+charaterAttacked.characterName);
        $("#health"+charaterAttacked.characterName).html(charaterAttacked.healthPoints);
        
        
    },
    "dieFunction": function(player) {
        if(player.healthPoints <= 0) {
            player.characterStatus = "dead";
        }
    },
    "counterAttackFunction": function(dff,att) {
        if(dff.characterStatus != "dead") {
            att.healthPoints = att.healthPoints - dff.counterAttackPower;
            //Show Healthpoints in dom
            $("#health"+att.characterName).html(att.healthPoints);
            $("#gameStatus2").text(dff.characterName + " attacked yo back with "+ dff.counterAttackPower+" damage");
        }
    }
};

var gameStWrs = {
    "characterSelFlag":false,
    "characterGenFlag":false,
    "defenderFalg": false,
    "winFlag": false,
    "loseFlag": false,
    "characters": [
        {"name":"Obi","healh":120,"attack":8},
        {"name":"Luke","healh":100,"attack":5},
        {"name":"dSidious","healh":150,"attack":20},
        {"name":"Maul","healh":180,"attack":25}
    ],
    "characterGeneration": function() {
        if (!this.characterGenFlag) {
            $(gameStWrs.characters).each(function(index, element) {
                var charac = jQuery.extend(true, {}, characterS);
                charac.attackPower = element.attack;
                charac.counterAttackPower = element.attack;
                charac.healthPoints = element.healh;
                charac.characterName = element.name
                var name1 = element.name;
                gameStWrs[name1] = charac;
                //generate divs
                var target = "characterDivSel";
                gameStWrs.divGenerator(name1,target);
                

            });
            gameStWrs.characterGenFlag = true;
        }
    },
    "characterSelection": function(selected) {
        if (!gameStWrs.characterSelFlag && this.characterGenFlag) {
            selected.characterType = "Player1";
            selected.characterStatus = "attack";
            $("#characterDivSel").html("");
            $("#algo").html("");
            $("#player1name").html("<div class='col-12'><h4>Your Character</h4></div>");
            gameStWrs.divGenerator(selected.characterName,"player1");
            
            $(gameStWrs.characters).each(function(index, element) {
                var name1 = element.name;
                if(name1 != selected.characterName) {
                    gameStWrs[name1].characterType = "CPU";
                    //asign class="enemies"
                    //move divs enemies to "Enemies Available to attack area"
                    gameStWrs.divGenerator(name1,"characterDivAtt")
                    $("#"+gameStWrs[name1].characterName).attr("class","col-2 imgContainer enemies");
                    
                }
                
            });
            
            gameStWrs.characterSelFlag = true;
        } 
    },
    "characterDefend": function(defender) {
        if(!gameStWrs.defenderFalg && gameStWrs.characterSelFlag && defender.characterStatus != "dead" && defender.characterType != "Player1") {
            $("#gameStatus").html("");
            $("#gameStatus2").html("");
            defender.characterStatus = "defend";
            gameStWrs.defenderFalg = true;
            $("#"+defender.characterName).remove();
            gameStWrs.divGenerator(defender.characterName,"characterDivDef");
            $("#"+defender.characterName).attr("class","col-2 imgContainer defender");

        }
    },
    "attackbtn": function() {
        var attacker;
        var defender;
        $("#gameStatus").html("");
        $("#gameStatus2").html("");
        if (gameStWrs.defenderFalg && !gameStWrs.winFlag && !gameStWrs.loseFlag) {
            $(gameStWrs.characters).each(function(index, element) {
                attacker = element.name;
                if(gameStWrs[attacker].characterStatus == "attack") {
                    $(gameStWrs.characters).each(function(index1,element1) {
                        defender = element1.name;
                        if(gameStWrs[defender].characterStatus == "defend") {
                            gameStWrs[attacker].attackFunction(gameStWrs[defender]);
                            gameStWrs[defender].dieFunction(gameStWrs[defender]);
                            gameStWrs[defender].counterAttackFunction(gameStWrs[defender],gameStWrs[attacker]);
                            gameStWrs[attacker].dieFunction(gameStWrs[attacker]);
                            gameStWrs.isDead(attacker,defender);
                            gameStWrs.winningFunc();
                        }
                    });   
                }
            });
            
        } else {
            //Put it in DOM
            //console.log("there is no Character defending area");
            $("#gameStatus").html("there is no Character defending area");
        }

        
    },
    "isDead": function(att,dff) {
        if(gameStWrs[att].characterStatus == "dead") {
            gameStWrs.loseFlag = true;
            console.log("You been Defeated...GAME OVER!!!");
            $("#gameStatus").html("You been Defeated...game over!!!");
            $("#restarBTN").attr("style","display: block;")
        }
        if(gameStWrs[dff].characterStatus == "dead") {
            gameStWrs.defenderFalg = false;
            //desaparecer Div
            $("#"+gameStWrs[dff].characterName).remove();
            $("#gameStatus").html("You have Defeated " + gameStWrs[dff].characterName + " ,you can choose to fight another enemy");
            //console.log("You have Defeated " + gameStWrs[dff].characterName + " ,you can choose to fight another enemy");
        }

    },
    "winningFunc": function() {
        var counter=0;
        $(gameStWrs.characters).each(function(index,element){
            var name2 = element.name
            
            if(gameStWrs[name2].characterStatus == "dead" && gameStWrs[name2].characterType == "CPU") {
                counter++;
                //console.log(counter);
                if(counter == gameStWrs.characters.length-1) {
                    console.log("You Win");
                    $("#gameStatus").html("You Win!!!");
                    $("#restarBTN").attr("style","display: block;")
                }
            }
        });

    },
    "restartGame": function() {
        location.reload();
    },
    "divGenerator": function(charac1,divTar) {
        var chardiv = $("<div>");
        chardiv.attr("class", "col-2 imgContainer");
        chardiv.attr("id", charac1);

        var charSpanName = $("<span>")
        charSpanName.html(charac1);

        var charSpanHealth = $("<span>")
        charSpanHealth.attr("id", "health"+charac1);
        charSpanHealth.html(gameStWrs[charac1].healthPoints);

        var charimg = $("<img>");
        charimg.attr("class","img");
        charimg.attr("src","./assets/images/"+charac1+".jpg");


        $("#"+divTar).append(chardiv);
        $("#"+charac1).append(charSpanName);
        $("#"+charac1).append(charimg);
        $("#"+charac1).append(charSpanHealth);
    }
};



$(document).ready(function() {
    gameStWrs.characterGeneration();
    //gameStWrs.characterSelection(gameStWrs["Obi"]);
    $(document).delegate('.imgContainer','click',function(event){
        //console.log(event.currentTarget.id);
        var objSel = event.currentTarget.id;
        if(!gameStWrs.characterSelFlag){
            //console.log("sel1");
            gameStWrs.characterSelection(gameStWrs[objSel]);
        } else if (!gameStWrs.defenderFalg) {
            //console.log("def");
            gameStWrs.characterDefend(gameStWrs[objSel]);
        }
    });
    $(document).delegate('#attackBTN','click',function(event){
        //console.log(event);
        gameStWrs.attackbtn();
    });
    
    $(document).delegate('#restarBTN','click',function(event){
        //console.log(event);
        gameStWrs.restartGame();
    });
    
});

