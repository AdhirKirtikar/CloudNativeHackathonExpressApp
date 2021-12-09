/***
Main Script
***/
var IE = document.all ? true : false;
if (!IE) document.captureEvents(Event.MOUSEMOVE);
var tempX = 100;
var tempY = 100;
var posX = 0;
var posY = 0;
var Width = 0;
var Height = 0;
var Size = 0;
var Type = "???";
var Name = "???";
var mouseOverCanvas = false;
var transparency = false;
var bnw = false;
var backupImg;
var backupFlag = false;
document.onmousemove = getMouseXY;

/***
Mouse Move Function
***/
function getMouseXY(e) {
  if (IE) {
    // grab the x-y pos.s if browser is IE
    tempX = event.clientX + document.body.scrollLeft;
    tempY = event.clientY + document.body.scrollTop;
  } else {
    // grab the x-y pos.s if browser is NS
    tempX = e.pageX;
    tempY = e.pageY;
  }
  // catch possible negative values in NS4

  if (tempX < 0) {
    tempX = 0;
  }
  if (tempY < 0) {
    tempY = 0;
  }

  var pos = document.getElementById("pos");
  if (transparency && mouseOverCanvas) {
    pos.innerHTML = "Click on a color to make it transparent...";
    pos.style.left = tempX + 20 + "px";
    pos.style.top = tempY + 20 + "px";
  }

  if (!mouseOverCanvas) {
    pos.innerHTML = "";
    pos.style.left = "-80px";
    pos.style.top = "-80px";
  }

  document.onmousemove = getMouseXY;
  document.onmousedown = getMouseClickXY;
}

/***
Mouse Click Function
***/
function getMouseClickXY(e) {
  if (IE) {
    // grab the x-y pos.s if browser is IE
    tempX = event.clientX + document.body.scrollLeft;
    tempY = event.clientY + document.body.scrollTop;
  } else {
    // grab the x-y pos.s if browser is NS
    tempX = e.pageX;
    tempY = e.pageY;
  }
  // catch possible negative values in NS4

  if (tempX < 0) {
    tempX = 0;
  }
  if (tempY < 0) {
    tempY = 0;
  }

  posX = tempX - 9;
  posY = tempY - 9;

  if (transparency && mouseOverCanvas) {
    transparent(posX, posY);
  }

  document.onmousemove = getMouseXY;
  document.onmousedown = getMouseClickXY;
}

/***
DISPLAY THE STATUS OF PROCESSING
***/

function displayStatus(pc) {
  var status = document.getElementById("status");
  status.innerHTML = "Processing... (" + pc + "%)";
  status.style.left = "10px";
  status.style.top = "10px";
}

/***
DISPLAY THE FILTER NAME APPLIED TO THE IMAGE
***/

function displayFilterName(filter) {
  var fa = document.getElementById("fa");
  if (fa.innerHTML == "Filters Applied: ") fa.innerHTML = fa.innerHTML + filter;
  else fa.innerHTML = fa.innerHTML + ", " + filter;
  histogram();
}

/***
OVERLAY COLORS
***/

function overlay(intensity) {
  intensity = intensity / 255;
  var cvsColorLayer = document.createElement("canvas");
  cvsColorLayer.height = document.getElementById("canvas").height;
  cvsColorLayer.width = document.getElementById("canvas").width;
  cvsColorLayer.style.visibility = "hidden";
  ctxColorLayer = cvsColorLayer.getContext("2d");
  if (document.getElementById("chR").checked)
    color = "rgba(255,0,0," + intensity + ")";
  if (document.getElementById("chG").checked)
    color = "rgba(0,255,0," + intensity + ")";
  if (document.getElementById("chB").checked)
    color = "rgba(0,0,255," + intensity + ")";
  ctxColorLayer.fillStyle = color;
  ctxColorLayer.fillRect(0, 0, Width, Height);

  var ctxS = document.getElementById("canvas").getContext("2d");
  ctxS.putImageData(backupImg, 0, 0);

  ctxS.globalCompositeOperation = "lighter";
  ctxS.drawImage(cvsColorLayer, 0, 0, Width, Height);

  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
EXTRACT COLORS
***/

function extract() {
  backup();
  var canvas1 = document.getElementById("canvas");
  var ctx1 = canvas1.getContext("2d");
  newimg = ctx1.getImageData(0, 0, Width, Height);
  h1 = (posX + Width * posY) * 4;
  var color = "";
  for (h = 0; h < Width * Height * 4; h = h + 4) {
    if (document.getElementById("chExR").checked) {
      color = "Red";
      newimg.data[h + 0] = newimg.data[h + 0];
      newimg.data[h + 1] = newimg.data[h + 0];
      newimg.data[h + 2] = newimg.data[h + 0];
    }
    if (document.getElementById("chExG").checked) {
      color = "Green";
      newimg.data[h + 0] = newimg.data[h + 1];
      newimg.data[h + 1] = newimg.data[h + 1];
      newimg.data[h + 2] = newimg.data[h + 1];
    }
    if (document.getElementById("chExB").checked) {
      color = "Blue";
      newimg.data[h + 0] = newimg.data[h + 2];
      newimg.data[h + 1] = newimg.data[h + 2];
      newimg.data[h + 2] = newimg.data[h + 2];
    }
  }
  ctx1.putImageData(newimg, 0, 0);
  displayFilterName("Extract (" + color + ")");
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
RESIZE IMAGE
***/
/*
function resize()
{
var canvas = document.getElementById("canvas");
var xRes = document.getElementById("xRes").value;
var yRes = document.getElementById("yRes").value;
canvas.style.webkitTransform="scale("+xRes/Width+","+yRes/Height+")";
canvas.style.MozTransform="scale("+xRes/Width+","+yRes/Height+")";
}
*/

/***
BACKUP IMAGE
***/

function backup() {
  backupImg = document
    .getElementById("canvas")
    .getContext("2d")
    .getImageData(0, 0, Width, Height);
  backupFlag = true;
  document.getElementById("undo").disabled = false;
}

/***
UNDO
***/

function undo() {
  if (backupFlag) {
    document
      .getElementById("canvas")
      .getContext("2d")
      .putImageData(backupImg, 0, 0);
    var fa = document.getElementById("fa");
    if (fa.innerHTML.lastIndexOf(",") == -1) fa.innerHTML = "Filters Applied: ";
    else
      fa.innerHTML = fa.innerHTML.substring(0, fa.innerHTML.lastIndexOf(","));
    backupFlag = false;
  }
  document.getElementById("undo").disabled = true;
}

/***
EXPAND IMAGE BY 1 PX ON ALL SIDES
***/

function expandImage(img) {
  var canvasNew = document.createElement("canvas");
  var ctxINew = canvasNew.getContext("2d");
  canvasNew.width = Width + 2;
  canvasNew.height = Height + 2;
  ctxINew.putImageData(img, 1, 1);
  newimg = ctxINew.getImageData(0, 0, Width + 2, Height + 2);

  for (j = 0; j <= Width - 1; j++) {
    i = 0; //add First Row
    newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 0] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 0];
    newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 1] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 1];
    newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 2] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 2];
    newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 3] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 3];
    i = Height - 1; //add Last Row
    newimg.data[4 * ((Width + 2) * (i + 2) + (j + 1)) + 0] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 0];
    newimg.data[4 * ((Width + 2) * (i + 2) + (j + 1)) + 1] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 1];
    newimg.data[4 * ((Width + 2) * (i + 2) + (j + 1)) + 2] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 2];
    newimg.data[4 * ((Width + 2) * (i + 2) + (j + 1)) + 3] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 3];
  }

  for (i = 0; i <= Height - 1; i++) {
    j = 0; //add First Column
    newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 0] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 0];
    newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 1] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 1];
    newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 2] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 2];
    newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 3] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 3];
    j = Width - 1; //add Last Column
    newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 0] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 0];
    newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 1] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 1];
    newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 2] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 2];
    newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 3] =
      img.data[4 * (Width * (i + 0) + (j + 0)) + 3];
  }

  //Add Top Left Pixel
  newimg.data[0] = img.data[0];
  newimg.data[1] = img.data[1];
  newimg.data[2] = img.data[2];
  newimg.data[3] = img.data[3];

  //Add Top Right Pixel
  newimg.data[4 * (Width + 2 - 1) + 0] = img.data[4 * (Width - 1) + 0];
  newimg.data[4 * (Width + 2 - 1) + 1] = img.data[4 * (Width - 1) + 1];
  newimg.data[4 * (Width + 2 - 1) + 2] = img.data[4 * (Width - 1) + 2];
  newimg.data[4 * (Width + 2 - 1) + 3] = img.data[4 * (Width - 1) + 3];

  //Add Bottom Left Pixel
  newimg.data[4 * ((Width + 2) * (Height - 1 + 2)) + 0] =
    img.data[4 * (Width * (Height - 1)) + 0];
  newimg.data[4 * ((Width + 2) * (Height - 1 + 2)) + 1] =
    img.data[4 * (Width * (Height - 1)) + 1];
  newimg.data[4 * ((Width + 2) * (Height - 1 + 2)) + 2] =
    img.data[4 * (Width * (Height - 1)) + 2];
  newimg.data[4 * ((Width + 2) * (Height - 1 + 2)) + 3] =
    img.data[4 * (Width * (Height - 1)) + 3];

  //Add Bottom Right Pixel
  newimg.data[4 * ((Width + 2) * (Height - 1 + 2) + (Width + 2 - 1)) + 0] =
    img.data[4 * (Width * (Height - 1) + (Width - 1)) + 0];
  newimg.data[4 * ((Width + 2) * (Height - 1 + 2) + (Width + 2 - 1)) + 1] =
    img.data[4 * (Width * (Height - 1) + (Width - 1)) + 1];
  newimg.data[4 * ((Width + 2) * (Height - 1 + 2) + (Width + 2 - 1)) + 2] =
    img.data[4 * (Width * (Height - 1) + (Width - 1)) + 2];
  newimg.data[4 * ((Width + 2) * (Height - 1 + 2) + (Width + 2 - 1)) + 3] =
    img.data[4 * (Width * (Height - 1) + (Width - 1)) + 3];

  return newimg;
}

/***
FLIP HORIZONTALLY/VERTICALLY
***/

function flip(a) {
  var ctxI = document.getElementById("canvas").getContext("2d");
  var img = ctxI.getImageData(0, 0, Width, Height);
  var newimg = ctxI.getImageData(0, 0, Width, Height);
  console.log("H:" + Height + "; W:" + Width);
  console.log(
    "H:" +
      document.getElementById("canvas").getAttribute("height") +
      "; W:" +
      document.getElementById("canvas").getAttribute("width")
  );
  Height_RS = document.getElementById("canvas").getAttribute("height");
  Width_RS = document.getElementById("canvas").getAttribute("width");
  if (a == "h") {
    for (i = 0; i < Height; i++) {
      for (j = 0; j < Width; j++) {
        k = Width * i + (Width - 1 - j);
        newimg.data[4 * (Width * i + j) + 0] = img.data[4 * k + 0];
        newimg.data[4 * (Width * i + j) + 1] = img.data[4 * k + 1];
        newimg.data[4 * (Width * i + j) + 2] = img.data[4 * k + 2];
        newimg.data[4 * (Width * i + j) + 3] = img.data[4 * k + 3];
      }
    }
    if (Height_RS != Height) ctxI.putImageData(newimg, Width_RS - Width, 0);
    else ctxI.putImageData(newimg, 0, 0);
  }

  if (a == "v") {
    for (i = 0; i < Width; i++) {
      for (j = 0; j < Height; j++) {
        k = Width * (Height - 1 - j) + i;
        newimg.data[4 * (Width * j + i) + 0] = img.data[4 * k + 0];
        newimg.data[4 * (Width * j + i) + 1] = img.data[4 * k + 1];
        newimg.data[4 * (Width * j + i) + 2] = img.data[4 * k + 2];
        newimg.data[4 * (Width * j + i) + 3] = img.data[4 * k + 3];
      }
    }
    if (Height_RS != Height) ctxI.putImageData(newimg, 0, Height_RS - Height);
    else ctxI.putImageData(newimg, 0, 0);
  }
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
TRANSPARENCY
***/

function transparent(posX, posY) {
  backup();
  var canvas1 = document.getElementById("canvas");
  var ctx1 = canvas1.getContext("2d");
  newimg = ctx1.getImageData(0, 0, Width, Height);
  var threshold = 20;
  h1 = (posX + Width * posY) * 4;

  r = newimg.data[h1];
  g = newimg.data[h1 + 1];
  b = newimg.data[h1 + 2];
  a = newimg.data[h1 + 3];

  for (h = 0; h < Width * Height * 4; h = h + 4) {
    if (
      newimg.data[h] > r - threshold &&
      newimg.data[h] < r + threshold &&
      newimg.data[h + 1] > g - threshold &&
      newimg.data[h + 1] < g + threshold &&
      newimg.data[h + 2] > b - threshold &&
      newimg.data[h + 2] < b + threshold
    ) {
      newimg.data[h + 3] = 0;
    }
  }
  ctx1.putImageData(newimg, 0, 0);
  displayFilterName("Transparency");
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
CLEAR
***/

function clearAll() {
  document.getElementById("canvas").width = "300";
  document.getElementById("canvas").height = "150";
  document.getElementById("histGray").width =
    document.getElementById("histGray").width;
  document.getElementById("histRGB").width =
    document.getElementById("histRGB").width;
  document.getElementById("wid").innerHTML = "Width: x Pixel";
  document.getElementById("hgt").innerHTML = "Height: y Pixel";
  document.getElementById("nm").innerHTML = "Name: ???";
  document.getElementById("tp").innerHTML = "Type: ???";
  document.getElementById("sz").innerHTML = "Size: ### bytes";
  document.getElementById("fa").innerHTML = "Filters Applied: ";
  document.getElementById("display").value = "Display";
  document.getElementById("display").title = "Click to load the image...";
  document.getElementById("output").innerHTML = "";
  document.getElementById("clear").disabled = true;
  document.getElementById("undo").disabled = true;
  backupFlag = false;
}

/***
GRAYSCALE
***/

function grayscale() {
  var ctxI = document.getElementById("canvas").getContext("2d");
  newimg = ctxI.getImageData(0, 0, Width, Height);
  for (h = 0; h < Width * Height * 4; h = h + 4) {
    r = newimg.data[h];
    g = newimg.data[h + 1];
    b = newimg.data[h + 2];
    var brightness = 0.3086 * r + 0.6094 * g + 0.082 * b;
    newimg.data[h] = brightness;
    newimg.data[h + 1] = brightness;
    newimg.data[h + 2] = brightness;
  }
  ctxI.putImageData(newimg, 0, 0);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
BLACK AND WHITE
***/

function blacknwhite() {
  var ctxI = document.getElementById("canvas").getContext("2d");
  newimg = ctxI.getImageData(0, 0, Width, Height);
  var bnwR = document.getElementById("chBnWRVal").value / 10;
  var bnwG = document.getElementById("chBnWGVal").value / 10;
  var bnwB = document.getElementById("chBnWBVal").value / 10;
  if (bnwR + bnwG + bnwB == 0) x = 0;
  else var x = 1 / (bnwR + bnwG + bnwB);
  bnwR *= x;
  bnwG *= x;
  bnwB *= x;
  for (h = 0; h < Width * Height * 4; h = h + 4) {
    r = newimg.data[h];
    g = newimg.data[h + 1];
    b = newimg.data[h + 2];
    var brightness = bnwR * r + bnwG * g + bnwB * b;
    newimg.data[h] = brightness;
    newimg.data[h + 1] = brightness;
    newimg.data[h + 2] = brightness;
  }
  ctxI.putImageData(newimg, 0, 0);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

function setColor(col) {
  var bnwR = document.getElementById("chBnWRVal").value / 10;
  var bnwG = document.getElementById("chBnWGVal").value / 10;
  var bnwB = document.getElementById("chBnWBVal").value / 10;
  if (bnwR + bnwG + bnwB == 0) x = 0;
  else var x = 1 / (bnwR + bnwG + bnwB);
  bnwR *= x;
  bnwG *= x;
  bnwB *= x;
  document.getElementById("colR").innerHTML = Math.round(bnwR * 100) / 100;
  document.getElementById("colG").innerHTML = Math.round(bnwG * 100) / 100;
  document.getElementById("colB").innerHTML = Math.round(bnwB * 100) / 100;
}

/***
SHARPEN (UNSHARP FILTER)
***/

function sharpen() {
  var ctxI = document.getElementById("canvas").getContext("2d");
  img = ctxI.getImageData(0, 0, Width, Height);
  var divisor = 8;
  var multiplier = 16;
  newimg = expandImage(img);

  for (i = 1; i <= Height + 2 - 2; i++) {
    for (j = 0; j < Width + 2 - 2; j++) {
      avgR =
        (multiplier * newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 0] -
          (newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 0] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 0] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 0])) /
        divisor;
      avgG =
        (multiplier * newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 1] -
          (newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 1] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 1] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 1])) /
        divisor;
      avgB =
        (multiplier * newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 2] -
          (newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 2] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 2] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 2])) /
        divisor;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 0] = avgR;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 1] = avgG;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 2] = avgB;
    }
  }

  ctxI.putImageData(newimg, -1, -1);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
EDGE DETECTION
***/

function edges() {
  var ctxS = document.getElementById("canvas").getContext("2d");
  imgS = ctxS.getImageData(0, 0, Width, Height);
  sharpen();
  var ctxD = document.getElementById("canvas").getContext("2d");
  imgD = ctxD.getImageData(0, 0, Width, Height);

  for (h = 0; h < Width * Height * 4; h = h + 4) {
    imgS.data[h + 0] -= imgD.data[h + 0];
    imgS.data[h + 1] -= imgD.data[h + 1];
    imgS.data[h + 2] -= imgD.data[h + 2];
    imgS.data[h + 0] += 128;
    imgS.data[h + 1] += 128;
    imgS.data[h + 2] += 128;
  }

  ctxS.putImageData(imgS, 0, 0);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
DREAMY
***/

function dreamy() {
  var ctxS = document.getElementById("canvas").getContext("2d");
  imgS = ctxS.getImageData(0, 0, Width, Height);
  ctxS.fillStyle = "grey";
  ctxS.fillRect(0, 0, Width, Height);
  var ctxD = document.getElementById("canvas").getContext("2d");
  imgD = ctxD.getImageData(0, 0, Width, Height);

  for (h = 0; h < Width * Height * 4; h = h + 4) {
    imgS.data[h + 0] -= imgD.data[h + 0];
    imgS.data[h + 1] -= imgD.data[h + 1];
    imgS.data[h + 2] -= imgD.data[h + 2];
  }

  ctxS.putImageData(imgS, 0, 0);
  brightness(2);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
CONTRASTY
***/

function contrasty() {
  backupImgNewer = document
    .getElementById("canvas")
    .getContext("2d")
    .getImageData(0, 0, Width, Height);
  var cvsBkp = document.createElement("canvas");
  cvsBkp.height = document.getElementById("canvas").height;
  cvsBkp.width = document.getElementById("canvas").width;
  cvsBkp.style.visibility = "hidden";
  cvsBkp.getContext("2d").putImageData(backupImgNewer, 0, 0);

  var ctxS = document.getElementById("canvas").getContext("2d");
  imgS = ctxS.getImageData(0, 0, Width, Height);
  ctxS.fillStyle = "grey";
  ctxS.fillRect(0, 0, Width, Height);
  var ctxD = document.getElementById("canvas").getContext("2d");
  imgD = ctxD.getImageData(0, 0, Width, Height);

  for (h = 0; h < Width * Height * 4; h = h + 4) {
    imgS.data[h + 0] -= imgD.data[h + 0];
    imgS.data[h + 1] -= imgD.data[h + 1];
    imgS.data[h + 2] -= imgD.data[h + 2];
  }

  ctxS.putImageData(imgS, 0, 0);
  ctxS.globalAlpha = 0.7;
  ctxS.globalCompositeOperation = "lighter";
  ctxS.drawImage(cvsBkp, 0, 0, Width, Height);

  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
VIGNETTE
***/

function vignette() {
  var ctxS = document.getElementById("canvas").getContext("2d");
  imgS = ctxS.getImageData(0, 0, Width, Height);

  var grd = ctxS.createRadialGradient(
    Width / 2,
    Height / 2,
    Height / 2,
    Width / 2,
    Height / 2,
    Width
  );
  grd.addColorStop(0, "black");
  grd.addColorStop(1, "grey");
  ctxS.fillStyle = grd;
  ctxS.fillRect(0, 0, Width, Height);
  var ctxD = document.getElementById("canvas").getContext("2d");
  imgD = ctxD.getImageData(0, 0, Width, Height);

  for (h = 0; h < Width * Height * 4; h = h + 4) {
    imgS.data[h + 0] -= imgD.data[h + 0];
    imgS.data[h + 1] -= imgD.data[h + 1];
    imgS.data[h + 2] -= imgD.data[h + 2];
  }

  ctxS.putImageData(imgS, 0, 0);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
GAUSSIAN BLUR (AVERAGING WITH HIGHER WEIGHTED CENTER PIXELS)
***/

function gausblur() {
  var ctxI = document.getElementById("canvas").getContext("2d");
  img = ctxI.getImageData(0, 0, Width, Height);
  var divisor = 12;
  var multiplier = 4;
  newimg = expandImage(img);

  for (i = 1; i <= Height + 2 - 2; i++) {
    for (j = 0; j < Width + 2 - 2; j++) {
      avgR =
        (multiplier * newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 0] +
          (newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 0] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 0] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 0])) /
        divisor;
      avgG =
        (multiplier * newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 1] +
          (newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 1] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 1] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 1])) /
        divisor;
      avgB =
        (multiplier * newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 2] +
          (newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 2] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 2] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 2])) /
        divisor;

      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 0] = avgR;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 1] = avgG;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 2] = avgB;
    }
  }

  ctxI.putImageData(newimg, -1, -1);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
AVERAGING (GAUSSIAN BLUR WITH EQUAL WEIGHTAGE TO ALL PIXELS)
***/

function averaging() {
  var ctxI = document.getElementById("canvas").getContext("2d");
  img = ctxI.getImageData(0, 0, Width, Height);
  var divisor = 9;
  var multiplier = 1;
  newimg = expandImage(img);

  for (i = 1; i <= Height + 2 - 2; i++) {
    for (j = 0; j < Width + 2 - 2; j++) {
      avgR =
        (multiplier * newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 0] +
          (newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 0] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 0] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 0] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 0])) /
        divisor;
      avgG =
        (multiplier * newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 1] +
          (newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 1] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 1] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 1] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 1])) /
        divisor;
      avgB =
        (multiplier * newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 2] +
          (newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 2] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 2] +
            newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 2] +
            newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 2])) /
        divisor;

      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 0] = avgR;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 1] = avgG;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 2] = avgB;
    }
  }

  ctxI.putImageData(newimg, -1, -1);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
MEDIAN FILTER (AVERAGING WITH MEDIAN OF ALL PIXELS)
***/

function median() {
  var ctxI = document.getElementById("canvas").getContext("2d");
  img = ctxI.getImageData(0, 0, Width, Height);
  var divisor = 9;
  var multiplier = 1;
  newimg = expandImage(img);

  for (i = 1; i <= Height + 2 - 2; i++) {
    for (j = 0; j < Width + 2 - 2; j++) {
      var avgRarr = new Array(
        newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 0],
        newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 0],
        newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 0],
        newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 0],
        newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 0],
        newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 0],
        newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 0],
        newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 0],
        newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 0]
      );
      var avgGarr = new Array(
        newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 1],
        newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 1],
        newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 1],
        newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 1],
        newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 1],
        newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 1],
        newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 1],
        newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 1],
        newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 1]
      );
      var avgBarr = new Array(
        newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 2],
        newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 2],
        newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 2],
        newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 2],
        newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 2],
        newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 2],
        newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 2],
        newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 2],
        newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 2]
      );

      avgRarr.sort(function (a, b) {
        return a - b;
      });
      avgGarr.sort(function (a, b) {
        return a - b;
      });
      avgBarr.sort(function (a, b) {
        return a - b;
      });

      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 0] = avgRarr[4];
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 1] = avgGarr[4];
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 2] = avgBarr[4];
    }
  }

  ctxI.putImageData(newimg, -1, -1);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
EMBOSS
***/

function emboss() {
  var ctxI = document.getElementById("canvas").getContext("2d");
  img = ctxI.getImageData(0, 0, Width, Height);
  newimg = ctxI.getImageData(0, 0, Width, Height);
  var divisor = 1;
  var multiplier = 1;

  for (i = 1; i <= Height - 2; i++) {
    for (j = 0; j < Width - 2; j++) {
      avgR =
        (multiplier * img.data[4 * (Width * (i + 0) + (j + 1)) + 0] +
          (-2 * img.data[4 * (Width * (i - 1) + (j + 0)) + 0] +
            2 * img.data[4 * (Width * (i + 1) + (j + 2)) + 0])) /
        divisor;
      avgG =
        (multiplier * img.data[4 * (Width * (i + 0) + (j + 1)) + 1] +
          (-2 * img.data[4 * (Width * (i - 1) + (j + 0)) + 1] +
            2 * img.data[4 * (Width * (i + 1) + (j + 2)) + 1])) /
        divisor;
      avgB =
        (multiplier * img.data[4 * (Width * (i + 0) + (j + 1)) + 2] +
          (-2 * img.data[4 * (Width * (i - 1) + (j + 0)) + 2] +
            2 * img.data[4 * (Width * (i + 1) + (j + 2)) + 2])) /
        divisor;
      newimg.data[4 * (Width * (i + 0) + (j + 1)) + 0] = avgR;
      newimg.data[4 * (Width * (i + 0) + (j + 1)) + 1] = avgG;
      newimg.data[4 * (Width * (i + 0) + (j + 1)) + 2] = avgB;
    }
  }

  ctxI.putImageData(newimg, 0, 0);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
SEPIA
***/

function sepia() {
  var r = [
    0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9,
    9, 9, 9, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15,
    16, 16, 17, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 49, 52, 54,
    55, 57, 59, 60, 62, 65, 67, 69, 70, 72, 74, 77, 79, 81, 83, 86, 88, 90, 92,
    94, 97, 99, 101, 103, 107, 109, 111, 112, 116, 118, 120, 124, 126, 127, 129,
    133, 135, 136, 140, 142, 143, 145, 149, 150, 152, 155, 157, 159, 162, 163,
    165, 167, 170, 171, 173, 176, 177, 178, 180, 183, 184, 185, 188, 189, 190,
    192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 211,
    212, 213, 214, 215, 216, 218, 219, 219, 220, 221, 222, 223, 224, 225, 226,
    227, 227, 228, 229, 229, 230, 231, 232, 232, 233, 234, 234, 235, 236, 236,
    237, 238, 238, 239, 239, 240, 241, 241, 242, 242, 243, 244, 244, 245, 245,
    245, 246, 247, 247, 248, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252,
    253, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255,
  ];
  var g = [
    0, 0, 1, 2, 2, 3, 5, 5, 6, 7, 8, 8, 10, 11, 11, 12, 13, 15, 15, 16, 17, 18,
    18, 19, 21, 22, 22, 23, 24, 26, 26, 27, 28, 29, 31, 31, 32, 33, 34, 35, 35,
    37, 38, 39, 40, 41, 43, 44, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 56, 57,
    58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79,
    80, 81, 83, 84, 85, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 100, 101, 102,
    103, 105, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 119, 120, 122,
    123, 124, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 141,
    142, 144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160,
    162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178,
    179, 181, 182, 183, 184, 186, 186, 187, 188, 189, 190, 192, 193, 194, 195,
    195, 196, 197, 199, 200, 201, 202, 202, 203, 204, 205, 206, 207, 208, 208,
    209, 210, 211, 212, 213, 214, 214, 215, 216, 217, 218, 219, 219, 220, 221,
    222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 231, 232, 232,
    232, 233, 234, 235, 235, 236, 236, 237, 238, 238, 239, 239, 240, 240, 241,
    242, 242, 242, 243, 244, 245, 245, 246, 246, 247, 247, 248, 249, 249, 249,
    250, 251, 251, 252, 252, 252, 253, 254, 255,
  ];
  var b = [
    53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59,
    60, 61, 61, 61, 62, 62, 63, 63, 63, 64, 65, 65, 65, 66, 66, 67, 67, 67, 68,
    69, 69, 69, 70, 70, 71, 71, 72, 73, 73, 73, 74, 74, 75, 75, 76, 77, 77, 78,
    78, 79, 79, 80, 81, 81, 82, 82, 83, 83, 84, 85, 85, 86, 86, 87, 87, 88, 89,
    89, 90, 90, 91, 91, 93, 93, 94, 94, 95, 95, 96, 97, 98, 98, 99, 99, 100,
    101, 102, 102, 103, 104, 105, 105, 106, 106, 107, 108, 109, 109, 110, 111,
    111, 112, 113, 114, 114, 115, 116, 117, 117, 118, 119, 119, 121, 121, 122,
    122, 123, 124, 125, 126, 126, 127, 128, 129, 129, 130, 131, 132, 132, 133,
    134, 134, 135, 136, 137, 137, 138, 139, 140, 140, 141, 142, 142, 143, 144,
    145, 145, 146, 146, 148, 148, 149, 149, 150, 151, 152, 152, 153, 153, 154,
    155, 156, 156, 157, 157, 158, 159, 160, 160, 161, 161, 162, 162, 163, 164,
    164, 165, 165, 166, 166, 167, 168, 168, 169, 169, 170, 170, 171, 172, 172,
    173, 173, 174, 174, 175, 176, 176, 177, 177, 177, 178, 178, 179, 180, 180,
    181, 181, 181, 182, 182, 183, 184, 184, 184, 185, 185, 186, 186, 186, 187,
    188, 188, 188, 189, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 193,
    194, 194, 194, 195, 196, 196, 196, 197, 197, 197, 198, 199,
  ];

  var ctxI = document.getElementById("canvas").getContext("2d");
  img = ctxI.getImageData(0, 0, Width, Height);
  for (var i = 0; i < img.data.length; i += 4) {
    img.data[i] = r[img.data[i]];
    img.data[i + 1] = g[img.data[i + 1]];
    img.data[i + 2] = b[img.data[i + 2]];
  }

  ctxI.putImageData(img, 0, 0);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
ALPHA
***/

function alpha(alpha) {
  var ctxI = document.getElementById("canvas").getContext("2d");
  newimg = ctxI.getImageData(0, 0, Width, Height);
  for (h = 0; h < Width * Height * 4; h = h + 4) {
    if (
      newimg.data[h + 3] + alpha * 10 > 10 &&
      newimg.data[h + 3] + alpha * 10 <= 255
    )
      newimg.data[h + 3] = newimg.data[h + 3] + alpha * 10;
  }
  ctxI.putImageData(newimg, 0, 0);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
BRIGHTNESS
***/

function brightness(b) {
  var ctxI = document.getElementById("canvas").getContext("2d");
  newimg = ctxI.getImageData(0, 0, Width, Height);
  for (h = 0; h < Width * Height * 4; h = h + 4) {
    if (newimg.data[h + 0] == 0) newimg.data[h + 0] = 1;
    if (newimg.data[h + 1] == 0) newimg.data[h + 1] = 1;
    if (newimg.data[h + 2] == 0) newimg.data[h + 2] = 1;
    newimg.data[h + 0] = newimg.data[h + 0] * b;
    newimg.data[h + 1] = newimg.data[h + 1] * b;
    newimg.data[h + 2] = newimg.data[h + 2] * b;
  }
  ctxI.putImageData(newimg, 0, 0);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
CONTRAST
***/

function contrast(val) {
  var ctxI = document.getElementById("canvas").getContext("2d");
  newimg = ctxI.getImageData(0, 0, Width, Height);
  for (h = 0; h < Width * Height * 4; h = h + 4) {
    r = newimg.data[h];
    g = newimg.data[h + 1];
    b = newimg.data[h + 2];
    if (r > 128) r += val;
    else r -= val;
    if (g > 128) g += val;
    else g -= val;
    if (b > 128) b += val;
    else b -= val;
    newimg.data[h] = r;
    newimg.data[h + 1] = g;
    newimg.data[h + 2] = b;
  }
  ctxI.putImageData(newimg, 0, 0);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
INVERT COLORS
***/

function invert() {
  var ctxI = document.getElementById("canvas").getContext("2d");
  newimg = ctxI.getImageData(0, 0, Width, Height);
  for (h = 0; h < Width * Height * 4; h = h + 4) {
    newimg.data[h + 0] = 255 - newimg.data[h + 0];
    newimg.data[h + 1] = 255 - newimg.data[h + 1];
    newimg.data[h + 2] = 255 - newimg.data[h + 2];
  }
  ctxI.putImageData(newimg, 0, 0);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
CARTOON
***/

function cartoon() {
  backup();
  median();
  medianImage = document
    .getElementById("canvas")
    .getContext("2d")
    .getImageData(0, 0, Width, Height);
  edges();
  emboss();
  invert();
  brightness(1.1);
  brightness(1.1);
  brightness(1.1);
  brightness(1.1);
  brightness(1.1);
  brightness(1.1);
  contrasty(10);
  grayscale();
  borderImage = document
    .getElementById("canvas")
    .getContext("2d")
    .getImageData(0, 0, Width, Height);
  threshold = 244;
  for (h = 0; h < Width * Height * 4; h = h + 4) {
    if (
      borderImage.data[h + 0] < threshold &&
      borderImage.data[h + 1] < threshold &&
      borderImage.data[h + 2] < threshold
    ) {
      medianImage.data[h + 0] = Math.floor(borderImage.data[h + 0] / 10);
      medianImage.data[h + 1] = Math.floor(borderImage.data[h + 1] / 10);
      medianImage.data[h + 2] = Math.floor(borderImage.data[h + 2] / 10);
    }
  }
  document
    .getElementById("canvas")
    .getContext("2d")
    .putImageData(medianImage, 0, 0);
  median();
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
  displayFilterName("Cartoon");
}

/***
SKETCH
***/

function sketch() {
  backup();
  gausblur();
  sharpen();
  edges();
  medianImage = document
    .getElementById("canvas")
    .getContext("2d")
    .getImageData(0, 0, Width, Height);

  borderImage = document
    .getElementById("canvas")
    .getContext("2d")
    .getImageData(0, 0, Width, Height);
  threshold = 128;
  for (h = 0; h < Width * Height * 4; h = h + 4) {
    if (
      borderImage.data[h + 0] > threshold &&
      borderImage.data[h + 1] > threshold &&
      borderImage.data[h + 2] > threshold
    ) {
      medianImage.data[h + 0] = Math.round(borderImage.data[h + 0] / 10);
      medianImage.data[h + 1] = Math.round(borderImage.data[h + 1] / 10);
      medianImage.data[h + 2] = Math.round(borderImage.data[h + 2] / 10);
    }

    if (
      borderImage.data[h + 0] <= threshold &&
      borderImage.data[h + 1] <= threshold &&
      borderImage.data[h + 2] <= threshold
    ) {
      medianImage.data[h + 0] = 255;
      medianImage.data[h + 1] = 255;
      medianImage.data[h + 2] = 255;
    }
  }
  document
    .getElementById("canvas")
    .getContext("2d")
    .putImageData(medianImage, 0, 0);
  median();
  brightness(1.1);
  brightness(1.1);
  brightness(1.1);
  brightness(1.1);
  brightness(1.1);
  brightness(1.1);
  brightness(1.1);
  brightness(1.1);

  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
  displayFilterName("Sketch");
}

/***
MOSAIC
***/

function mosaic(grain) {
  var ctxI = document.getElementById("canvas").getContext("2d");
  img = ctxI.getImageData(0, 0, Width, Height);
  var divisor = 9;
  newimg = expandImage(img);

  for (i = 1; i <= Height + 2 - 2; i = i + grain) {
    for (j = 0; j < Width + 2 - 2; j = j + grain) {
      avgR =
        (newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 0] +
          newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 0] +
          newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 0] +
          newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 0] +
          newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 0] +
          newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 0] +
          newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 0] +
          newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 0] +
          newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 0]) /
        divisor;
      avgG =
        (newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 1] +
          newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 1] +
          newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 1] +
          newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 1] +
          newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 1] +
          newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 1] +
          newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 1] +
          newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 1] +
          newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 1]) /
        divisor;
      avgB =
        (newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 2] +
          newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 2] +
          newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 2] +
          newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 2] +
          newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 2] +
          newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 2] +
          newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 2] +
          newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 2] +
          newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 2]) /
        divisor;

      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 0] = avgR;
      newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 0] = avgR;
      newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 0] = avgR;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 0] = avgR;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 0] = avgR;
      newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 0] = avgR;
      newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 0] = avgR;
      newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 0] = avgR;
      newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 0] = avgR;

      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 1] = avgG;
      newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 1] = avgG;
      newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 1] = avgG;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 1] = avgG;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 1] = avgG;
      newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 1] = avgG;
      newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 1] = avgG;
      newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 1] = avgG;
      newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 1] = avgG;

      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 1)) + 2] = avgB;
      newimg.data[4 * ((Width + 2) * (i - 1) + (j + 1)) + 2] = avgB;
      newimg.data[4 * ((Width + 2) * (i + 1) + (j + 1)) + 2] = avgB;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 0)) + 2] = avgB;
      newimg.data[4 * ((Width + 2) * (i + 0) + (j + 2)) + 2] = avgB;
      newimg.data[4 * ((Width + 2) * (i - 1) + (j + 0)) + 2] = avgB;
      newimg.data[4 * ((Width + 2) * (i + 1) + (j + 0)) + 2] = avgB;
      newimg.data[4 * ((Width + 2) * (i - 1) + (j + 2)) + 2] = avgB;
      newimg.data[4 * ((Width + 2) * (i + 1) + (j + 2)) + 2] = avgB;
    }
  }

  ctxI.putImageData(newimg, -1, -1);
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
Resize
***/

function resize() {
  var ctxI = document.getElementById("canvas").getContext("2d");
  var imageData = ctxI.getImageData(0, 0, 100, 100);
  var newCanvas = document.createElement("CANVAS");
  newCanvas.width = imageData.width;
  newCanvas.height = imageData.height;

  newCanvas.getContext("2d").putImageData(imageData, 0, 0);

  ctxI.scale(0.5, 0.5);
  ctxI.drawImage(newCanvas, 10, 10);

  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

function scaleImageDatasss(imageData, scale) {
  var newCanvas = document.createElement("CANVAS");
  var ctx = newCanvas.getContext("2d");
  var scaled = ctx.createImageData(
    imageData.width * scale,
    imageData.height * scale
  );
  var subLine = ctx.createImageData(scale, 1).data;
  for (var row = 0; row < imageData.height; row++) {
    for (var col = 0; col < imageData.width; col++) {
      var sourcePixel = imageData.data.subarray(
        (row * imageData.width + col) * 4,
        (row * imageData.width + col) * 4 + 4
      );
      for (var x = 0; x < scale; x++) subLine.set(sourcePixel, x * 4);
      for (var y = 0; y < scale; y++) {
        var destRow = row * scale + y;
        var destCol = col * scale;
        scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4);
      }
    }
  }

  return scaled;
}

function scaleImageData(imageData, scale) {
  var newCanvas = document.createElement("CANVAS");
  var c = newCanvas.getContext("2d");
  var scaled = c.createImageData(
    imageData.width * scale,
    imageData.height * scale
  );

  for (var row = 0; row < imageData.height; row++) {
    for (var col = 0; col < imageData.width; col++) {
      var sourcePixel = [
        imageData.data[(row * imageData.width + col) * 4 + 0],
        imageData.data[(row * imageData.width + col) * 4 + 1],
        imageData.data[(row * imageData.width + col) * 4 + 2],
        imageData.data[(row * imageData.width + col) * 4 + 3],
      ];
      for (var y = 0; y < scale; y++) {
        var destRow = row * scale + y;
        for (var x = 0; x < scale; x++) {
          var destCol = col * scale + x;
          for (var i = 0; i < 4; i++) {
            scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
              sourcePixel[i];
          }
        }
      }
    }
  }

  return scaled;
}

/***
ASCIIfy
***/

function ASCIIfy() {
  var ctxI = document.getElementById("canvas").getContext("2d");
  var imageData = ctxI.getImageData(0, 0, Width, Height);
  var newCanvas = document.createElement("CANVAS");
  newCanvas.width = imageData.width;
  newCanvas.height = imageData.height;
  console.log(newCanvas.width, " - ", newCanvas.height);
  var ctxN = newCanvas.getContext("2d");
  ctxN.putImageData(imageData, 0, 0);
  var scale = 0.8;
  ctxN.scale(scale, scale);
  ctxN.drawImage(newCanvas, 0, 0);
  var widthN = Math.round(newCanvas.width * scale);
  var heightN = Math.round(newCanvas.height * scale);
  console.log(widthN, " - ", heightN);

  newimg = ctxN.getImageData(0, 0, widthN, heightN);
  for (h = 0; h < widthN * heightN * 4; h = h + 4) {
    r = newimg.data[h];
    g = newimg.data[h + 1];
    b = newimg.data[h + 2];
    if (h % (widthN * 4) == 0) {
      document.getElementById("asciidiv").innerHTML =
        document.getElementById("asciidiv").innerHTML +
        "<br><span style='color:rgb(" +
        r +
        "," +
        g +
        "," +
        b +
        ");'>*</span>";
    } else {
      document.getElementById("asciidiv").innerHTML =
        document.getElementById("asciidiv").innerHTML +
        "<span style='color:rgb(" +
        r +
        "," +
        g +
        "," +
        b +
        ");'>*</span>";
    }
  }
  if (document.getElementById("display").value == "Reset")
    displayCanvasImageLink();
}

/***
RGB HISTOGRAM
***/

function histogram() {
  document.getElementById("histRGB").width =
    document.getElementById("histRGB").width;
  document.getElementById("histGray").width =
    document.getElementById("histGray").width;

  var ctxI = document.getElementById("canvas").getContext("2d");
  var ctxRGB = document.getElementById("histRGB").getContext("2d");
  var ctxGray = document.getElementById("histGray").getContext("2d");

  newimg = ctxI.getImageData(0, 0, Width, Height);
  var iR = new Array(255);
  var iG = new Array(255);
  var iB = new Array(255);
  var iRGB = new Array(255);
  for (a = 0; a <= 255; a++) {
    iR[a] = 0;
    iG[a] = 0;
    iB[a] = 0;
    iRGB[a] = 0;
  }
  for (h = 0; h < Width * Height * 4; h = h + 4) {
    r = newimg.data[h];
    g = newimg.data[h + 1];
    b = newimg.data[h + 2];
    iR[r]++;
    iG[g]++;
    iB[b]++;
    var brightness = Math.round((r + g + b) / 3);
    iRGB[brightness]++;
  }
  var max = 0;
  var maxBr = 0;
  for (a = 1; a < 255; a++) {
    if (iR[a] > max) max = iR[a];
    if (iG[a] > max) max = iG[a];
    if (iB[a] > max) max = iB[a];
    if (iRGB[a] > maxBr) maxBr = iRGB[a];
  }

  ctxRGB.globalAlpha = 0.5;
  ctxRGB.globalCompositeOperation = "destination-over";
  for (a = 0; a <= 255; a++) {
    ctxGray.strokeStyle = "Black";
    ctxGray.lineWidth = 1;
    ctxGray.moveTo(a, 100);
    ctxGray.lineTo(a, 100 - (100 * iRGB[a]) / maxBr);
    ctxGray.closePath();
    ctxGray.stroke();
    ctxRGB.strokeStyle = "rgba(255,0,0,30)";
    ctxRGB.lineWidth = 1;
    ctxRGB.moveTo(a, 100);
    ctxRGB.lineTo(a, 100 - (100 * iR[a]) / max);
    ctxRGB.closePath();
    ctxRGB.stroke();
    ctxRGB.strokeStyle = "rgba(0,255,0,30)";
    ctxRGB.lineWidth = 1;
    ctxRGB.moveTo(a, 100);
    ctxRGB.lineTo(a, 100 - (100 * iG[a]) / max);
    ctxRGB.closePath();
    ctxRGB.stroke();
    ctxRGB.strokeStyle = "rgba(0,0,255,30)";
    ctxRGB.lineWidth = 1;
    ctxRGB.moveTo(a, 100);
    ctxRGB.lineTo(a, 100 - (100 * iB[a]) / max);
    ctxRGB.closePath();
    ctxRGB.stroke();
  }
}

/***
SAVE FILE LINK
***/

function displayCanvasImageLink() {
  document.getElementById("output").innerHTML = "";
  var cvs = document.getElementById("canvas");
  //cvslink = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); //This works in Chrome but not in FireFox
  var cvslink = cvs.toDataURL("image/png"); //This works both in FireFox and Chrome
  var inner =
    "<A target='_blank' HREF='" +
    cvslink +
    "' DOWNLOAD='" +
    Name +
    "'>Download '" +
    Name +
    "'</A>";
  //For Chrome you can designate the file name/extension by adding a download attribute to your anchor tag. But this attribute does not work in FireFox
  document.getElementById("output").innerHTML = inner;
}

/***
FUNCTION TO READ IMAGE FILES
***/

(oFReader = new FileReader()),
  (rFilter =
    /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i);

oFReader.onload = function (oFREvent) {
  var img = new Image();
  img.onload = function () {
    Width = img.width;
    Height = img.height;

    var canvas = document.getElementById("canvas");
    if (Width > Height && Width > 600) {
      aspectRatio = Width / Height;
      scale = 600 / Width;
      canvas.setAttribute("width", 600);
      canvas.setAttribute("height", 600 / aspectRatio);
      canvas.getContext("2d").scale(scale, scale);
    } else if (Width < Height && Height > 400) {
      aspectRatio = Height / Width;
      scale = 400 / Height;
      canvas.setAttribute("height", 400);
      canvas.setAttribute("width", 400 / aspectRatio);
      canvas.getContext("2d").scale(scale, scale);
    } else {
      canvas.setAttribute("width", Width);
      canvas.setAttribute("height", Height);
    }
    document.getElementById("wid").innerHTML = "Width: " + Width + " Pixel";
    document.getElementById("hgt").innerHTML = "Height: " + Height + " Pixel";
    document.getElementById("nm").innerHTML = "Name: " + Name;
    document.getElementById("tp").innerHTML = "Type: " + Type;
    document.getElementById("sz").innerHTML = "Size: " + Size;
    document.getElementById("fa").innerHTML = "Filters Applied: ";
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    backup();
    displayCanvasImageLink();
    document.getElementById("display").value = "Reset";
    document.getElementById("display").title =
      "Click to reset to the original image...";
    document.getElementById("clear").disabled = false;
    document.onmousemove = getMouseXY;
    displayFilterName("Loaded");
  };
  img.src = oFREvent.target.result;
};

function loadImageFile() {
  if (transparency) {
    document.getElementById("tr").title = "Click to toggle transparency...";
    document.getElementById("canvas").style.cursor = "auto";
    transparency = false;
  }

  if (document.getElementById("files").files.length === 0) {
    return;
  }
  var oFile = document.getElementById("files").files[0];
  if (!rFilter.test(oFile.type)) {
    alert("You must select a valid image file!");
    return;
  }
  Name = oFile.name;
  Size = oFile.size;
  if (Size > 1024) {
    if (Size > 1024 * 1024) {
      Size = Math.round((Size / (1024 * 1024)) * 100) / 100 + " MB";
    } else {
      Size = Math.round(Size / 1024) + " KB";
    }
  } else {
    Size = Size + " bytes";
  }
  Type = oFile.type.replace("image/", "").toUpperCase();
  oFReader.readAsDataURL(oFile);
}

function loadImageFileBG() {
  if (transparency) {
    document.getElementById("tr").title = "Click to toggle transparency...";
    document.getElementById("canvas").style.cursor = "auto";
    transparency = false;
  }

  if (document.getElementById("filesBG").files.length === 0) {
    return;
  }
  var oFile = document.getElementById("filesBG").files[0];
  if (!rFilter.test(oFile.type)) {
    alert("You must select a valid image file!");
    return;
  }
  Name = oFile.name;
  Size = oFile.size;
  if (Size > 1024) {
    if (Size > 1024 * 1024) {
      Size = Math.round((Size / (1024 * 1024)) * 100) / 100 + " MB";
    } else {
      Size = Math.round(Size / 1024) + " KB";
    }
  } else {
    Size = Size + " bytes";
  }
  Type = oFile.type.replace("image/", "").toUpperCase();
  oFReader.readAsDataURL(oFile);
}
