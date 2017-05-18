/*function move(e){
	var x_old,y_old,move=true;
		$('.window').mousemove(function(e) { 
			alert(2);
			var ev=e||window.event;
			var x =ev.clientX;
			var y=ev.clientY;
			if(move){
				x_old=x;y_old=y;
				move=false;
			}
			var w=$('.window').width();
			var h=$('.window').height();
			var offst = $(".window").offset();
			var ps=$(this).offset();// 或者var ps=$(".window").position();
			var l=ps.left;
			var t=ps.top;
			//alert(t+""+l);
			
			//alert(height);
			$('.window').css({"left":l+l+w-x+"px","top":t+t+h-y+"px"});
			alert(left+""+top);
			
		}); 
}*/
/*************************************************************************************************/
/***
 * 
 * 窗口拖动效果，淡入淡出，鼠标形状，窗口高低层次
 * 
 * 根据类名判断窗口
 */
var _z=99;

$(document).ready(function(){

	var _move=false;//移动标记
	var _x,_y;//鼠标离控件左上角的相对位置
	var wd;//窗口
    $(".window").click(function(){
        //alert("click");//点击（松开后触发）
    	//this.style.cursor = "default";//鼠标形状
    	//this.style.zIndex = 999;
        }).mousedown(function(e){
        
        _move=true;
        wd=$(this);
        //this.style.cursor = "move";//鼠标形状
        
        //窗口层次,每级别递增，方法一
        this.style.zIndex = _z;
        _z++;
        //窗口层次，只保证点击的窗口在最上，方法二
        $(".window").attr("focused","false");
        $(this).attr("focused","true");//窗口层次
        
        _x=e.pageX-parseInt(wd.css("left"));
        _y=e.pageY-parseInt(wd.css("top"));
        //wd.fadeTo(20, 0.5);//点击后开始拖动并透明显示
    });
    $(document).mousemove(function(e){
        if(_move){
            var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
            var y=e.pageY-_y;
            wd.css({top:y,left:x});//控件新位置
        }
    }).mouseup(function(){
    _move=false;
    //wd.fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
  });
    
  //改变窗口大小
    //o.style.zIndex = window.vWinZIndex;
	//window.vWinZIndex++;
	//var winSelf = o.childNodes[0];
    var minW =300,minH = 300;
    var mus=getMouseCoords(wd);
	var newW = (wd.startW +(mus.x-wd.startX));
	var newH = (wd.startH +(mus.y-wd.startY));
    function resizeWin(newW,newH){
    		newW = newW < minW?minW:newW;
    		newH = newH < minH?minH:newH;
    		wd.style.width = newW+"px";
    		wd.style.height = newH+"px";
    		//winTitle.style.width = isIE?newW+"px":(newW-4)+"px";
    		//winContent.style.width = (newW-wX)+"px";
    		//winContent.style.height = (newH-wH)+"px";
    }
    {
    	resizeWin(intW,intH);
    	vDrag(o,winTitle);
    }
    
  //禁止拖动页面图片在新窗口打开
	   
});
window.isIE = window.Event?false:true;
window.getMouseCoords=function(e){
    return {
        x:isIE?e.clientX+Math.max(document.body.scrollLeft, document.documentElement.scrollLeft):e.pageX,
        y:isIE?e.clientY+Math.max(document.body.scrollTop, document.documentElement.scrollTop):e.pageY};
};
function imgdragstart(){return false;}
window.onload=function(){
	for(i in document.images)document.images[i].ondragstart=imgdragstart;
}

/*************************************************************************************************/
/***
 * 窗口缩放效果
 * 
 */
/*window.$ = function(obj){
	return (document.getElementById)?document.getElementById(obj):(document.all)?document.all[obj]:obj;
};
window.isIE = window.Event?false:true;
window.getMouseCoords=function(e){
	return {
		x:isIE?e.clientX+Math.max(document.body.scrollLeft, document.documentElement.scrollLeft):e.pageX,
		y:isIE?e.clientY+Math.max(document.body.scrollTop, document.documentElement.scrollTop):e.pageY};
	};
window.vWinZIndex = 1;

//拖动窗口
function vDrag(o,ho,initArr){
	ho=ho||o;
	o.style.position="absolute";
	if(!isIE){ho.firstChild.onmousedown=function(){return false;};};
	ho.onmousedown=function(a){
		o.style.zIndex = window.vWinZIndex;
		window.vWinZIndex++;
		var d=document;if(!a)a=window.event;
		var x=a.layerX?a.layerX:a.offsetX,y=a.layerY?a.layerY:a.offsetY;
		if(ho.setCapture)
			ho.setCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		d.onmousemove=function(a){
			if(!a)a=window.event;
			var mus=getMouseCoords(a);
			if(!a.pageX)a.pageX=mus.x;
			if(!a.pageY)a.pageY=mus.y;
			var tx=a.pageX-x,ty=a.pageY-y;
			if(initArr){
				o.style.left=(tx<initArr[0]?initArr[0]:tx>initArr[2]?initArr[2]:tx)+"px";
				o.style.top=(ty<initArr[1]?initArr[1]:ty>initArr[3]?initArr[3]:ty)+"px";
			}else{
				o.style.left = tx+"px";
				o.style.top = ty+"px";
			}
		};
		d.onmouseup=function(){
			if(ho.releaseCapture)
				ho.releaseCapture();
			else if(window.captureEvents)
				window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
			d.onmousemove=null;
			d.onmouseup=null;
		};
	};
}

//创建窗口
function createWebWindow(o,intW,intH){
	o.style.zIndex = window.vWinZIndex;
	window.vWinZIndex++;
	var winSelf = o.childNodes[0];
	var winTitle = o.childNodes[0].childNodes[0];
	var winContent = o.childNodes[0].childNodes[1];
	var winDbox = o.childNodes[0].childNodes[2];
	var minW =50,minH = 40;
	var _self = this;
	var wX = winSelf.offsetWidth-winContent.offsetWidth;
	var wH = winSelf.offsetHeight-winContent.offsetHeight;
	winDbox.onmousedown = function(e){
		o.style.zIndex = window.vWinZIndex;
		window.vWinZIndex++;
		var d=document;if(!e)e=window.event;
		var x=e.layerX?e.layerX:e.offsetX,y=e.layerY?e.layerY:e.offsetY;
		var MCD=window.getMouseCoords(e);
		winSelf.startX=MCD.x;
		winSelf.startY=MCD.y;
		winSelf.startW=winSelf.offsetWidth;
		winSelf.startH=winSelf.offsetHeight;
		if(winDbox.setCapture)
			winDbox.setCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		d.onmousemove =function(e){
			if(!e)e=window.event;
			var mus=getMouseCoords(e);
			var newW = (winSelf.startW +(mus.x-winSelf.startX));
			var newH = (winSelf.startH +(mus.y-winSelf.startY));
			resizeWin(newW,newH);
		};
		d.onmouseup=function(){
			if(winDbox.releaseCapture)
				winDbox.releaseCapture();
			else if(window.captureEvents)
				window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
			d.onmousemove=null;
			d.onmouseup=null;
		};
	};
	
	//改变窗口大小
	function resizeWin(newW,newH){
			newW = newW < minW?minW:newW;
			newH = newH < minH?minH:newH;
			winSelf.style.width = newW+"px";
			winSelf.style.height = newH+"px";
			winTitle.style.width = isIE?newW+"px":(newW-4)+"px";
			winContent.style.width = (newW-wX)+"px";
			winContent.style.height = (newH-wH)+"px";
	}
	{
		resizeWin(intW,intH);
		vDrag(o,winTitle);
	}
}

createWebWindow($("testWinA"),300,75);
createWebWindow($("testWinB"),300,100);
*/