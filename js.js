// 3*3 = 9шт
const PUZZLE_DIFFICULTY = 7;
const PUZZLE_HOVER_TINT = '#009900';

var _stage;
var _canvas;

var _img;

// элементы картинки
var _pieces;
// размеры картинки
var _puzzleWidth;
var _puzzleHeight;
// размеры элеметов
var _pieceWidth;
var _pieceHeight;

// содержит ссылку на кусок, который в настоящее время перетаскивается.
var _currentPiece;
// содержит ссылку на кусок, который в настоящее время находится на месте. (В демонстрации эта часть выделена зеленым цветом.)
var _currentDropPiece;  

var _mouse;

function init() {
    _img = new Image();
    _img.addEventListener('load', onImage, false);
    _img.src = "mclaren-720s.jpg";
    
    // при загрузке имг запуститься onImage() 
}
function onImage(e) {
    _pieceWidth = Math.floor(_img.width / PUZZLE_DIFFICULTY)
    _pieceHeight = Math.floor(_img.height / PUZZLE_DIFFICULTY)
    _puzzleWidth = _pieceWidth * PUZZLE_DIFFICULTY;
    _puzzleHeight = _pieceHeight * PUZZLE_DIFFICULTY;
    setCanvas();
    initPuzzle();
}
function setCanvas() {
    // формируем канвас
    _canvas = document.getElementById('canvas');
    _stage = _canvas.getContext('2d');
    _canvas.width = _puzzleWidth;
    _canvas.height = _puzzleHeight;
    _canvas.style.border = "1px solid black";
}
function initPuzzle() {
    // инициализируем пазлы
    _pieces = [];
    _mouse = {x: 0, y: 0};
    _currentPiece = null;
    _currentDropPiece = null;
    _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
    createTitle("Click to Start Puzzle");
    buildPieces();
}
function createTitle(msg){
    // сообщение при клики на который, запускается игра
    _stage.fillStyle = "#000000";
    _stage.globalAlpha = .4;
    _stage.fillRect(100, _puzzleHeight - 40, _puzzleWidth - 200, 40);
    _stage.fillStyle = "#FFFFFF";
    _stage.globalAlpha = 1;
    _stage.textAlign = "center";
    _stage.textBaseline = "middle";
    _stage.font = "20px Arial";
    _stage.fillText(msg, _puzzleWidth / 2, _puzzleHeight - 20);
}
function buildPieces(){
    // строим пазлы
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    // через цикл записываем элементы картинки в объект
    for (i = 0; i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY; i++) {
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        _pieces.push(piece);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    console.log(piece, 'piece')
    document.onmousedown = shufflePuzzle;
}
function shufflePuzzle() {
    // перетасовываем массив
    _pieces = shuffleArray(_pieces);
    // очищаем канвас
    _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    
    for(i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        // Затем используйте кусочные объекты sxи syсвойства вместе с _pieceWidthи _pieceHeight, чтобы заполнить параметры, объявляющие область изображения, на которой можно рисовать. 
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        // рисуем границы элементов
        _stage.strokeRect(xPos, yPos, _pieceWidth, _pieceHeight);
        xPos += _pieceWidth;
        
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    document.onmousedown = onPuzzleClick;
}
function onPuzzleClick(e) {
    if (e.layerX || e.layerX == 0) {
        _mouse.x = e.layerX - _canvas.offsetLeft;
        _mouse.y = e.layerY - _canvas.offsetTop;
    }
    else if (e.offsetX || e.offsetX == 0) {
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    
    _currentPiece = checkPieceClicked();
    
    if (_currentPiece != null) {
        _stage.clearRect(_currentPiece.xPos, _currentPiece.yPos, _pieceWidth, _pieceHeight);
        _stage.clearRect(_currentPiece.xPos, _currentPiece.yPos, _pieceWidth, _pieceHeight);
        _stage.save();
        _stage.globalAlpha = .9;
        _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
        _stage.restore();
        document.onmousemove = updatePuzzle;
        document.onmouseup = pieceDropped;
    }
}
function checkPieceClicked() {
    // возвращает элеменнт на место где взяли другой элементи, а его заменяем. - ??
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
            //PIECE NOT HIT
        }
        else{
            return piece;
        }
    }
    return null;
}
function updatePuzzle(e) {
    // Начните с установки _currentDropPieceна null. Нам нужно вернуть его обратно nullна обновление из-за того, что наша часть была перетащена обратно в свой дом. Мы не хотим, чтобы предыдущее _currentDropPieceзначение зависало. Затем мы устанавливаем _mouseобъект таким же образом, как и при нажатии.
    _currentDropPiece = null;
    if (e.layerX || e.layerX == 0){
        _mouse.x = e.layerX - _canvas.offsetLeft;
        _mouse.y = e.layerY - _canvas.offsetTop;
    }
    else if (e.offsetX || e.offsetX == 0) {
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    
    _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
    
    var i;
    var piece;
    
    for (i = 0; i < _pieces.length; i++) {
        // Создайте нашу pieceссылку, как обычно. Затем проверьте, соответствует ли часть, которую мы сейчас ссылаем, как часть, которую мы перетаскиваем. Если да, продолжайте цикл. Это приведет к тому, что домашний слот перетасованной детали будет пустым.
        piece = _pieces[i];
        if (piece == _currentPiece) {
            continue;
        }
        
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        
        // Двигаясь дальше, перерисовывайте кусочек головоломки, используя его свойства точно так же, как мы это делали, когда их сначала рисовали. Вам также нужно будет нарисовать границу.
        if(_currentDropPiece == null) {
            if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)) {
                //NOT OVER
            }
            else {
                _currentDropPiece = piece;
                _stage.save();
                _stage.globalAlpha = .4;
                _stage.fillStyle = PUZZLE_HOVER_TINT;
                _stage.fillRect(_currentDropPiece.xPos,_currentDropPiece.yPos,_pieceWidth, _pieceHeight);
                _stage.restore();
            }
        }
    }
    _stage.save();
    _stage.globalAlpha = .6;
    _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
    _stage.restore();
    _stage.strokeRect( _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth,_pieceHeight);
}
function pieceDropped(e) {
    // удалим слушателей, так как ничего не тянет.
    document.onmousemove = null;
    document.onmouseup = null;
    
    
    if(_currentDropPiece != null) {
        var tmp = {
            xPos: _currentPiece.xPos, 
            yPos: _currentPiece.yPos
        };
        _currentPiece.xPos = _currentDropPiece.xPos;
        _currentPiece.yPos = _currentDropPiece.yPos;
        _currentDropPiece.xPos = tmp.xPos;
        _currentDropPiece.yPos = tmp.yPos;
    }
    resetPuzzleAndCheckWin();
}
function resetPuzzleAndCheckWin() {
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var gameWin = true;
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        if(piece.xPos != piece.sx || piece.yPos != piece.sy){
            gameWin = false;
        }
    }
    if(gameWin){
        setTimeout(gameOver,500);
    }
}
function gameOver(){
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    initPuzzle();
}
function shuffleArray(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
