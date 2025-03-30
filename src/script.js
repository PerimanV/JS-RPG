let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
    {
        name: "Stick",
        power:  5,
    },
    {
        name: "Dagger",
        power:  30,
    },
    {
        name: "Hammer",
        power:  50,
    },
    {
        name: "Sword",
        power:  100,
    },
];

const locations = [
    {
        name: "town square",
        "button text": ["Go to store","Go to cave","Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square you see a sign that says \"The Store\"."
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)","Buy weapon (30 gold)","Back to Town Square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You entered the store."
    },
    {
        name: "cave",
        "button text": ["Fight slime","Fight beast","Back to Town Square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You entered the cave and see some monsters."
    },
    {
        name: "fight",
        "button text": ["Attack","Dodge","Run"],
        "button functions": [Attack,Dodge,goTown],
        text: "You are fighting a monster!"
    },
    {
        name: "kill monster",
        "button text": ["Back to Town Square","Back to Town Square","Back to Town Square"],
        "button functions": [goTown,goTown,goTown],
        text: "The monster screams as it dies. You gain XP and find gold."
    },
    {
        name: "lose",
        "button text": ["REPLAY?","REPLAY?","REPLAY?"],
        "button functions": [restart,restart,restart],
        text: "YOU DIED ☠️"
    },
    {
        name: "win",
        "button text": ["REPLAY?","REPLAY?","REPLAY?"],
        "button functions": [restart,restart,restart],
        text: "YOU KILLED THE DRAGON. YOU WIN !"
    }
];

const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
    {
        name: "beast",
        level: 8,
        health: 60
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];

//button functions

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(locations) {

    monsterStats.style.display = "none";

    button1.innerText = locations["button text"][0];
    button2.innerText = locations["button text"][1];
    button3.innerText = locations["button text"][2];

    button1.onclick = locations["button functions"][0];
    button2.onclick = locations["button functions"][1];
    button3.onclick = locations["button functions"][2];

    text.innerText = " " + locations.text;
}

function goTown() {
   update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health +=  10;
        goldText.innerText = gold;
        healthText.innerText = health;
    }
    else {
        text.innerText = "Not enough gold to buy health."

    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You have bought a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " In your inventory you now have: " + inventory + ".";
        }
        else {
            text.innerText = "You do not have enough gold to buy a weapon";
        }
    }
    else {
        text.innerText = "You already have the best weapon!";
        button2.innerText = "Sell previous weapon (15 gold)"
        button2.onclick = sellWeapon;
    }
   
}

function sellWeapon() {
    if (inventory.length < 1)
    {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon  = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText = "In your inventory you have: " + inventory;
    }
    else {
        text.innerText = "You cant sell your only weapon!";
    }
}


function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function Attack() {
    text.innerText = "The " + monsters[fighting].name + "attacks!";
    text.innerText = "You attack it with your " + weapons[currentWeapon].name + "!";
    if (isMonsterHit())
    {
        health -= getMonsterAttackValue(monsters[fighting].level);
    }
    else {
        text.innerText += "You missed.";
    }
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1 ;
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;

    if(health <= 0) {
        lose();
    }
    else if (monsterHealth <= 0) {
        if (fighting === 2) {
                winGame();
            }
            else {
                defeatMonster();
            }
    }

    //change for weapon to break, unless player has only 1 weapon
    if (Math.random() <= 0.1 && inventory.length !== 1) {
        text.innerText = "Your " + inventory.pop() + " breaks."
        currentWeapon --;
    }

}

function getMonsterAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit;
}

//20% change to miss, if health < 20 player never misses
function isMonsterHit() {
    return Math.random() > 0.2 || health < 20;
}

function Dodge() {
    text.innerText = "You dodged " + monsters[fighting].name + " attack."
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    let xp = 0;
    let health = 100;
    let gold = 50;
    let currentWeapon = 0;
    let inventory = ["stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
}
