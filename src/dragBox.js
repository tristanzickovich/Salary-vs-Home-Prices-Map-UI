window.onload = addListeners();
var offX;
var offY;

function addListeners(){
    document.getElementById('infobox').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

}

function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
	var div = document.getElementById('infobox');
	offY= e.clientY-parseInt(div.offsetTop);
	offX= e.clientX-parseInt(div.offsetLeft);
	window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
	var div = document.getElementById('infobox');
	div.style.position = 'absolute';
	div.style.top = (e.clientY-offY) + 'px';
	div.style.left = (e.clientX-offX) + 'px';
}

function hideBox(divID){
	var item = document.getElementById(divID);
	item.className = 'hidden';
}

function revealBox(divID){
	var item = document.getElementById(divID);
	item.className = 'revealed';
}