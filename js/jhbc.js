/*
JSON Fighter Creator | A Javascript Tool by William Starkovich

This tool allows you to create animations with positioned frames, and hitboxes with ease.

Imports and exports JSON.

Do not host this tool online. I have not added any security to make sure there's no way to inject anything, nor do I plan to.
This is a offline only tool.
*/


var ctx;

var imgBnk = [];
var jsonData = { name: "Test", gravity: 1, anims: [] };
var frameData = [];

var frameNum = 0;
var animNum = 0;
var writeMode = false;

var imgPos = { x: 320 , y: 240 }
var blankFrame = function(){ return { img: 0, offx: 0, offy: 0, velox: 0, veloy: 0, frameTime: 5, hitboxes: []}; }

var blankHitbox = function(){ return { type: 0, offx: 0, offy: 0, width: 0, height: 0, priority: 0, damage: 0, hitStun: 0 }; }
var blankAnim = function(){ return { name: "new anim", speed: 1, move: true, frames: [new blankFrame()]}; }

var jsonStr = "";
var animToShow = 0;
var frametoShow = 0;

function makeImage(str){
	var img = new Image();
	img.src = str;
	
	return img;
}

//you'll have to mess wit this code to change any images, sorry.
 [0] = makeImage("imgs/stick_idle1.png");
imgBnk[1] = makeImage("imgs/stick_idle2.png");
imgBnk[2] = makeImage("imgs/stick_idle3.png");

imgBnk[3] = makeImage("imgs/stick_punch1.png");
imgBnk[4] = makeImage("imgs/stick_punch2.png");




function showAnim(){
	var guiStr = '<div class="sbtn" id="jsonbtn" onclick="addnewanim();" ><small>Add new Animation</small></div>';
	if(jsonData.anims != undefined){
		if(jsonData.anims[animNum] != undefined){
			guiStr += '<div class="anim"><div class="animInfo">';
			guiStr += `
						<span>A: ` + animNum + ` F: ` + frameNum + `</span>
						<label>Name </label>
						<input type = "text" id = "name" value = "`+jsonData.anims[animNum].name+`" />
						<label>Speed </label>
						<input type = "text" id = "speed" value = "`+jsonData.anims[animNum].speed+`" />
						<label>Move </label>
						<input type = "text" id = "move" value = "`+jsonData.anims[animNum].move+`" />
						<div class="sbtn" id="jsonbtn" onclick="addnewframe();" ><small>Add new Frame</small></div>
						<div class="sbtn" id="jsonbtn" onclick="delanim();" ><small>Delete Animation</small></div></div><br />
						<br />
						<br />
						`;
					
			if(jsonData.anims[animNum].frames[frameNum] != undefined){
					var fd = jsonData.anims[animNum].frames[frameNum];
					guiStr += `
						<label>img </label>
						<input type = "text" id = "img" value = "`+fd.img+`" />
						<label>offx </label>
						<input type = "text" id = "offx" value = "`+fd.offx+`" />
						<label>offy </label>
						<input type = "text" id = "offy" value = "`+fd.offy+`" />`;
						
					if(fd.velox != undefined && fd.veloy != undefined){
						guiStr += `<label>velox </label>
						<input type = "text" id = "velox" value = "`+fd.velox+`" />
						<label>veloy </label>
						<input type = "text" id = "veloy" value = "`+fd.veloy+`" />`;
					}
					
					else{
						guiStr += `<label>velox </label>
						<input type = "text" id = "velox" value = "0" />
						<label>veloy </label>
						<input type = "text" id = "veloy" value = "0" />`;
					}
					
					guiStr += `
						<label>frameTime </label>
						<input type = "text" id = "frameTime" value = "`+fd.frameTime+`" />
						<div class="sbtn" id="jsonbtn" onclick="delframe();" ><small>Delete Frame</small></div>
						<br />
						<br />
						<br />
					`;
					
					
					
					//add hitboxes here.
					guiStr += '<div class="sbtn" id="jsonbtn" onclick="addnewhitbox();" ><small>Add new Hitbox</small></div><div class="hitboxes">';
					if(fd.hitboxes != undefined){
						for(var h = 0; h < fd.hitboxes.length; h++){
							if(fd.hitboxes[h] != undefined){
								var hb = fd.hitboxes[h];
								
								if(hb.type != 1){
									guiStr += `
										<label>type </label>
										<input type = "text" id = "type`+h+`" value = "`+hb.type+`" />
										<label>offx </label>
										<input type = "text" id = "offx`+h+`" value = "`+hb.offx+`" />
										<label>offy </label>
										<input type = "text" id = "offy`+h+`" value = "`+hb.offy+`" />
										<label>width </label>
										<input type = "text" id = "width`+h+`" value = "`+hb.width+`" />
										<label>height </label>
										<input type = "text" id = "height`+h+`" value = "`+hb.height+`" />
										<div class="sbtn" id="jsonbtn" onclick="delhitbox(`+h+`);" ><small>Delete Hitbox</small></div>
										<br />
										<br />
										<br />
										`;
								}
								
								if(hb.type == 1){
									guiStr += `
										<label>type </label>
										<input type = "text" id = "type`+h+`" value = "`+hb.type+`" />
										<label>offx </label>
										<input type = "text" id = "offx`+h+`" value = "`+hb.offx+`" />
										<label>offy </label>
										<input type = "text" id = "offy`+h+`" value = "`+hb.offy+`" />
										<label>width </label>
										<input type = "text" id = "width`+h+`" value = "`+hb.width+`" />
										<label>height </label>
										<input type = "text" id = "height`+h+`" value = "`+hb.height+`" />
										<label>priority </label>
										<input type = "text" id = "priority`+h+`" value = "`+hb.priority+`" />
										<label>damage </label>
										<input type = "text" id = "damage`+h+`" value = "`+hb.damage+`" />
										<label>hitStun </label>
										<input type = "text" id = "hitStun`+h+`" value = "`+hb.hitStun+`" />
										<div class="sbtn" id="jsonbtn" onclick="delhitbox(`+h+`);" ><small>Delete Hitbox</small></div>
										<br />
										<br />
										<br />
										`;
								}
								
							}
						}
					}
					guiStr += '</div>';
					
				}

			guiStr += '</div>';
		}
	}
			
		
	$("#frameGUI").html(guiStr);
}

function addnewframe(){
	jsonData.anims[animNum].frames.push(new blankFrame());
	showAnim();
}

function addnewanim(){
	jsonData.anims.push(new blankAnim());
	showAnim();
}

function addnewhitbox(){
	jsonData.anims[animNum].frames[frameNum].hitboxes.push(new blankHitbox());
	showAnim();
}

function delframe(){
	jsonData.anims[animNum].frames.splice(frameNum, 1);
	showAnim();
}

function delanim(){
	jsonData.anims.splice(animNum, 1);
	showAnim();
}

function delhitbox(h){
	jsonData.anims[animNum].frames[frameNum].hitboxes.splice(h, 1);
	showAnim();
}

function parseJson(){
	console.log("parse json");
	if($("#jsoninput").val() != jsonStr){
		console.log("$(\"#jsoninput\").val() != jsonStr");
		jsonStr = $("#jsoninput").val();
		jsonData = JSON.parse(jsonStr);
				
		frameNum = 0;
		animNum = 0;
		showAnim();
	}
}


function update(){
	if(jsonData.anims != undefined){
		if(jsonData.anims[animNum] != undefined){
			if(jsonData.anims[animNum].frames[frameNum] != undefined){
				frameData = jsonData.anims[animNum].frames[frameNum];
			}
		}
	}
	
	if(ctx){
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,640,480);
		
		//console.log(this.frameData);
		if(frameData.img !== undefined){
			if(imgBnk[frameData.img] !== undefined){
				ctx.drawImage(imgBnk[frameData.img], 
					imgPos.x - frameData.offx, 
					imgPos.y - frameData.offy
				);
			}
		}

		if(frameData.hitboxes !== undefined){
			for(var i = 0; i < frameData.hitboxes.length; i++){
				var hitbox = frameData.hitboxes[i];
				ctx.fillStyle = "rgba(0,255,0,0.4)";
				if(hitbox.type == 1) ctx.fillStyle = "rgba(255,0,0,0.4)";
				ctx.fillRect(imgPos.x + hitbox.offx, imgPos.y + hitbox.offy, hitbox.width, hitbox.height);
			}
		}
	}
}

function addAnim(){
	frameNum = 0;
	animNum++;
	if(animNum >= jsonData.anims.length) animNum = jsonData.anims.length - 1;
	showAnim();
}

function subAnim(){
	frameNum = 0;
	animNum--;
	if(animNum < 0) animNum = 0;
	showAnim();
}

function addFrame(){
	frameNum++;
	if(frameNum >= jsonData.anims[animNum].frames.length - 1) frameNum = jsonData.anims[animNum].frames.length -1;
	showAnim();
}

function subFrame(){
	frameNum--;
	if(frameNum <= 0) frameNum = 0;
	showAnim();
}

function setJSON(){
	outputData = {};
	outputData.img = parseInt($("#img").val());
	outputData.offx = parseInt($("#offx").val());
	outputData.offy = parseInt($("#offy").val());
	outputData.velox = parseInt($("#velox").val());
	outputData.veloy = parseInt($("#veloy").val());
	outputData.frameTime = parseInt($("#frameTime").val());
	var fd = jsonData.anims[animNum].frames[frameNum];
	
	outputData.hitboxes = [];
		if(fd.hitboxes != undefined){
		for(var h = 0; h < fd.hitboxes.length; h++){
			var temp = {}
			//if(fd.hitboxes[h] != undefined){
				temp.type = parseInt($("#type" + h).val());
				temp.offx = parseInt($("#offx" + h).val());
				temp.offy = parseInt($("#offy" + h).val());
				temp.width = parseInt($("#width" + h).val());
				temp.height = parseInt($("#height" + h).val());
				if(temp.type == 1){
					temp.priority = parseInt($("#priority" + h).val());
					temp.damage = parseInt($("#damage" + h).val());
					temp.hitStun = parseInt($("#hitStun" + h).val());
				}
				outputData.hitboxes.push(temp);
			//}
		}
	}
	/*if($("#hitboxes").val() != ""){
		outputData.hitboxes = JSON.parse($("#hitboxes").val());
	}*/
	
	jsonData.anims[animNum].name = $("#name").val();
	jsonData.anims[animNum].speed = parseInt($("#speed").val());
	jsonData.anims[animNum].move = $("#move").val();
	
	jsonData.anims[animNum].frames[frameNum] = outputData;
	showAnim();
}

function writeJSONOutput(){
	//var str = "";
	//var hitboxStr = "[]";
	//if(outputData.hitboxes != "") hitboxStr = JSON.stringify(jsonData);
	
	//str += '{ "img": ' + outputData.img + ' "offx": ' + outputData.offx + ' "offy": ' + outputData.offy + ' "velox": ' + outputData.velox + ' "veloy": '+  outputData.veloy + ' "frameTime": ' + outputData.frameTime + ' "hitboxes": '+  hitboxStr + ' }, ';
	console.log(jsonData);
	$("#jsonoutput").val(JSON.stringify(jsonData));
};

/*$( document ).ready(function() {
	console.log( "ready!" );

	ctx = $("#screen")[0].getContext('2d');
	
	setInterval(update, 1000/60);
	
	showAnim();
});*/