window.onload = function() //ce qui permet d'afficher quelque chose lorsque la fenetre se charge.

// LE CANVAS EST UN ELEMENT DE HTML 5 PERMETTANT DE DESSINER DEDANS
{
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx; //context on doit creer cela pour pouvoir dessiner
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeOut;
    
    init();
    
    function init()
    {
        var canvas = document.createElement("canvas"); //pour pouvoir dessiner (former des choses) sur notre page.
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas); //Permet d'accrocher un tag canvas au body
        ctx = canvas.getContext("2d");
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }
    
    function refreshCanvas() //Donner l'impression de mouvement au serpent
    {
        snakee.advance();
        if(snakee.checkCollision())
            {
                gameOver();
            }
        else
            {
                if(snakee.isEatingApple(applee))
                    {
                        score++;
                        snakee.ateApple = true;
                        do
                            {
                                applee.setNewPosition();
                            }
                        while(applee.isOnSnake(snakee))
                    }
                ctx.clearRect(0,0,canvasWidth, canvasHeight);
                drawScore();
                snakee.draw();
                applee.draw();
                timeOut=setTimeout(refreshCanvas,delay); // permet de faire executer la fonction a chaque fois qu'un delai est passe.
            }
        
    }
    
    function gameOver()
        {
            ctx.save();
            ctx.font = "bold 70px sans-serif";
            ctx.fillStyle = "#000"; //le context a besoin de l'attribut fillStyle pour attribuer de la couleur ou du style
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            var centerX = canvasWidth / 2;
            var centerY = canvasHeight / 2;
            ctx.strokeText("Game Over", centerX, centerY - 180);
            ctx.fillText("Game Over", centerX, centerY - 180);
            ctx.font = "bold 30px sans-serif";
            ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centerX, centerY - 120);
            ctx.fillText("Appuyer sur la touche Espace pour rejouer", centerX, centerY - 120);
            ctx.restore();
        }
        
    function restart() // Pour faire repartir le jeux apres Game Over et avoir appuye sur Espace.
        {
            snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
            applee = new Apple([10,10]);
            score = 0;
            clearTimeout(timeOut); // Pour eviter que lorsqu'on appuie sur espace sans Game Over.
            refreshCanvas();
        }
        
    function drawScore()
        {
            ctx.save();
            ctx.font = "bold 200px sans-serif";
            ctx.fillStyle = "gray";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var centerX = canvasWidth / 2;
            var centerY = canvasHeight / 2;
            ctx.fillText(score.toString(), centerX, centerY);
            ctx.restore();
        }
    
    function drawBlock(ctx, position) //Dessiner le serpent.
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x ,y , blockSize, blockSize); //Pour creer le rectangle (x=distance horizontale et y=distance veticale en s'imaginant un cadrillage dans le cadre(canvas))
    }
    
    function Snake(body, direction) // Faire avancer le serpent et lui donner differentes directions.
    {
        this.body = body;
        this.direction = direction;
        this.ateApple = false; // Si le serpent a mange la pomme (voir ligne 148 a 151).
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++)
                {
                    drawBlock(ctx, this.body[i]);
                }
            ctx.restore();
        };
        this.advance = function()
        {
            var nextPosition = this.body[0].slice();
            switch(this.direction) //analyse la direction qui englobera les cas suivant ci-dessous : soit a gauche, soit a droite, etc...
                {
                    case "left":
                        nextPosition[0] -= 1;
                        break;
                    case "right":
                        nextPosition[0] += 1;
                        break;
                    case "down":
                        nextPosition[1] += 1;
                        break;
                    case "up":
                        nextPosition[1] -= 1;
                        break;
                    default:
                        throw("Invalid Direction");
                }
            this.body.unshift(nextPosition); //Permet de rajouter (nextPosition) a la 1ere place.
            if(!this.ateApple)
                this.body.pop(); // Supprime le dernier element d'un array. l'ajout devant et le retret a la fin donnera limpression que le rectangle avance alors que c'en est a chaque fois un nouveau qui est place a des endroits differents.
            else
                this.ateApple = false;
        };
    
    
            this.setDirection = function(newDirection)
        {
            var allowedDirections;
            switch(this.direction) // executer differentes conditions selon plusieurs cas differents
                {
                    case "left":
                    case "right":
                    allowedDirections = ["up", "down"];
                        break;
                    case "down":
                    case "up":
                        allowedDirections = ["left", "right"];
                        break;
                    default:
                        throw("Invalid Direction");
                }
            
            if(allowedDirections.indexOf(newDirection) > -1) //Pour savoir si down ou autre est dans allowed direction, son index s'affichera
                {
                    this.direction = newDirection;
                }
        };
        this.checkCollision = function()
        {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks -1;
            var maxY = heightInBlocks -1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                {
                    wallCollision = true;
                }
            
            for(var i = 0; i < rest.length ; i++)
                {
                    if(snakeX === rest[i][0] && snakeY === rest[i][1])
                        {
                            snakeCollision = true;
                        }
                }
                return wallCollision || snakeCollision;
            
        };
        this.isEatingApple = function(appleToEat)
        {
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                    return true;
            else
                return false;
        };
    }
    
    function Apple(position) // Creation de la pomme et la faire changer de places.
    {
        this.position = position;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true); //Dessine des arcs de cercles.
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function() // Pour que la pomme change de place a chaque fois qu'elle est mangee.
        {
            var newX = Math.round(Math.random() * (widthInBlocks - 1)); // Math.random place la pomme a des coordonnees aleatoires entre 0 et 1 donc on multiplie par le nombre de blocks ds la largeur - 1 et Math.round arrondit le chiffre de placement au chiffre en entier, non decimal.
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeToCheck) // Pour eviter que la pomme soit sur le serpent a un moment aleatoire
        {
            var isOnSnake = false;
            
            for(var i = 0 ; i < snakeToCheck.body.length; i++)
                {
                    if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
                        {
                            isOnSnake = true;
                        }
                }
                return isOnSnake;
        };
    }

    

    document.onkeydown = function handleKeyDown(e) // Quand l'utilisateur tape une touche du clavier
    {
        var key = e.keyCode; //Execute ce que l'on veut avec le code de la touche voulue
        var newDirection;
        switch(key)
            {
                case 37:
                    newDirection = "left";
                    break;
                case 38:
                    newDirection = "up";
                    break;
                case 39:
                    newDirection = "right";
                    break;
                case 40:
                    newDirection = "down";
                    break;
                case 32: // Code de la touche espace pour recommancer la partie.
                    restart();
                    return;
                default:
                    return;
            }
        snakee.setDirection(newDirection);
    
    }

}