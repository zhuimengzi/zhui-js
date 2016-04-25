/* ******************************* 追梦子个人库 2016 *************************** */
(function(w){
// 构造器
function Zm(){
}
Zm.prototype = {
	// 扩展对象
	extend:function(tar,source){
		for(var v in source){
			tar[v] = source[v];
		}
	}
};

// 创建实例
var zm = new Zm();

// 基本模块
zm.extend(zm,{
	// 比较最大的值
	max:function(arr){
		if(typeof arr==='object'){
			return Math.max.apply(null,arr);
		}else{
			return Math.max.apply(null,arguments);
		}
	},
	// 比较最小的值
	min:function(arr){
		if(typeof arr==='object'){
			return Math.min.apply(null,arr);
		}else{
			return Math.min.apply(null,arguments);
		}
	},
	// 判断值类型
	type:function(value){
		if((typeof value)==="object"){
			if(Object.prototype.constructor.name){
				return value.constructor.name;
			}else{
				var is = Object.prototype.toString.call(value);
				return is.match(/\[object (.*?)\]/)[1];
			}
		}else{
			return (typeof value);
		}
	},
	// 将伪数组转成真数组
	toArr:function(arr){
		return [].concat.apply([],arr);
	}
});

// 正则模块
zm.extend(zm,{
	// 去除左右两边的空格
	trim:function(str){
		// 如果空格在开始或结束的位置则替换成空
		return str.replace(/(^\s*)|(\s*$)/g,"");
	},
	// 去除全部空格
	trims:function(str,s){
		if(s){
			return str.replace(eval("/(^"+s+"*)|("+s+"*)|("+s+"*$)/g"),"");
		}
		return str.replace(/(^\s*)|(\s*)|(\s*$)/g,"");
	}
});

// 选择器模块
zm.extend(zm,{
	// id选择器
	id:function(dom){
		return document.getElementById(dom);
	},
	// 标签选择器
	tags:function(dom,parent){
		if(parent){
			// 如果有传第二个参数
			if(typeof parent==="string"){
				parent = zm.id(parent);
			}
			return parent.getElementsByTagName(dom);
		}else{
			// 没有传第二个参数
			return document.getElementsByTagName(dom);
		}
	},
	// class选择器
	classN:function(dom,parent){
		var tags = null;
		// 如果有第二个参数，父元素
		if(parent){
			// 判断是选择器，还是对象
			if((typeof parent)==="string"){
				parent = document.getElementById(parent);
			}
			// 判断是否支持getElementsByClassName
			tags = parent.getElementsByClassName?parent.getElementsByClassName(dom):parent.getElementsByTagName("*");
		}else{
			tags = document.getElementsByClassName?document.getElementsByClassName(dom):document.getElementsByTagName("*");
		}
		// 支持直接返回
		if(document.getElementsByClassName){
			return tags;
		}
		// 不支持class选择器的情况
		var i = 0,len = tags.length,arr = [];
		for(;i<len;i++){
			if(tags[i].className===dom){
				arr.push(tags[i]);
			}
		}
		return arr;
	},
	// 多组选择器
	list:function(dom){
		// 将字符串转数组
		var arr = dom.split(",");
		var doms = [];
		var lis = [];
		// 循环判断是什么选择器
		for(var i=0;i<arr.length;i++){
			// 获取字符串第一个字符
			var first = arr[i].charAt(0);
			// 截取第一个字符串以后的内容
			var sub = arr[i].substring(1);
			// id选择器
			if(first==="#"){
				doms.push(zm.id(sub));
			}else if(first==="."){
				// class选择器
				lis = zm.classN(sub);
				for(var j=0;j<lis.length;j++){
					doms.push(lis[j]);
				}
			}else{
				// 标签选择器
				lis = zm.tags(arr[i]);
				// 因为tags返回的是一个数组，所以需要遍历
				for(var k=0;k<lis.length;k++){
					doms.push(lis[k]);
				}
			}
		}
		return doms;
	},
	// 层次选择器
	cengci:function(dom){
		// 将字符串转数组
		var arr = dom.split(" ");
		// 定义一个临时数组和最终的数组，临时数组每次只保存最新一次的。
		var temp = [],result = [],list = [];
		for(var i=0;i<arr.length;i++){
			var first = arr[i].charAt(0);
			var sub = arr[i].substring(1);
			// 将上一次的保存的数据清空
			temp = [];
			if(first==="#"){
				temp.push(zm.id(sub));
				result = temp;
			}else if(first==="."){
				// 判断class是不是在第一个。
				if(result.length){
					for(var k=0;k<result.length;k++){
						// list返回的是一个数组
						list = zm.classN(sub,result[k]);
						for(var j=0;j<list.length;j++){
							temp.push(list[j]);
						}
					}
				}else{
					list = zm.classN(sub);
					for(var j=0;j<list.length;j++){
						temp.push(list[j]);
					}
				}
				result = temp;
			}else{
				// 判断标签选择器是否在第一个
				if(result.length){
					for(var k=0;k<result.length;k++){
						list = zm.tags(arr[i],result[k]);
						for(var j=0;j<list.length;j++){
							temp.push(list[j]);
						}
					}
				}else{
					list = zm.tags(arr[i]);
					for(var j=0;j<list.length;j++){
						temp.push(list[j]);
					}
				}
				result = temp;
			}
		}
		return result;
	},
	// query选择器
	all:function(dom,parent){
		if(parent){
			// 判断parent是否已经获取
			typeof parent==="string"?parent = zm.id(parent):parent;
		}
		// 判断是否需要过滤
		parent = parent || document;
		return parent.querySelectorAll(dom);
	}
});

// CSS模块
zm.extend(zm,{
	// 获取css样式
	getStyle:function(dom,key){
		var k = '';
		if(dom.currentStyle){
			// IE写法
			k = dom.currentStyle[key];
		}else{
			// 标准写法
			k = window.getComputedStyle(dom,null)[key];
		}
		return k;
	},
	// 设置css样式
	setStyle:function(dom,key,val){
		dom.style[key] = val;
	},
	// 获取或设置css样式
	css:function(dom,key,val){
		// 如果有val表示设置模式
		if(val){
			zm.setStyle(dom,key,val);
		}else{
			return zm.getStyle(dom,key);
		}
	},
	// 获取css集合的样式
	cssold:function(dom,key,val){
		var doms = typeof dom==="string"?zm.all(dom):dom;
		// 如果有val表示设置模式
		if(val){
			for(var i=0;i<doms.length;i++){
				zm.setStyle(doms[i],key,val);
			}
		}else{
			return zm.getStyle(doms[0],key);
		}
	},
	// hide
	hide:function(dom){
		doms = typeof dom==="string"?zm.all(dom):dom;
		for(var i=0;i<doms.length;i++){
			doms[i].style.display = "none";
		}

	},
	// show
	show:function(dom){
		doms = typeof dom==="string"?zm.all(dom):dom;
		for(var i=0;i<doms.length;i++){
			doms[i].style.display = "block";
		} 
	}
});

// 内容模块
zm.extend(zm,{
	// 获取元素内容
	html:function(dom,val){
		var doms = zm.all(dom);
		if(val){
			for(var i=0;i<doms.length;i++){
				doms[i].innerHTML = val;
			}
		}else{
			return doms[0].innerHTML;
		}
	},
	// 获取元素文本
	txt:function(dom,val){
		var doms = zm.all(dom);
		if(val){
			for(var i=0;i<doms.length;i++){
				doms[i].innerText = val;
			}
		}else{
			return doms[0].innerText;
		}
	}
});

// 属性模块
zm.extend(zm,{
	// 获取属性，或者设置属性
	attr:function(dom,key,val){
		// 获取元素
		var doms = zm.all(dom);
		// 判断是获取还是设置属性
		if(val){
			for(var i=0;i<doms.length;i++){
				doms[i].setAttribute(key,val);
			}
		}else{
			return doms[0].getAttribute(key);
		}
	},
	// 删除属性
	removeAttr:function(dom,key){
		var doms = zm.all(dom);
		// 循环删除所有元素属性
		for(var i=0;i<doms.length;i++){
			doms[i].removeAttribute(key);
		}
	},
	// 删除多个属性
	removeAttrAll:function(){
		// 实参
		var a = arguments;
		var doms = zm.all(a[0]);
		// 遍历元素
		for(var i=0;i<doms.length;i++){
			// 遍历属性
			for(var j=1;j<a.length;j++){
				doms[i].removeAttribute(a[j]);
			}
		}
	},
	// 添加一个class
	addClass:function(dom,className){
		// 给所有元素添加一个class
		var doms = zm.all(dom);
		for(var i=0;i<doms.length;i++){
			// 加上原来的，避免原来的class被替换
			doms[i].className+=" "+className;
		}
	},
	// 添加多个class
	addClassNames:function(){
		var a = arguments;
		var doms = zm.all(a[0]);
		for(var i=0;i<doms.length;i++){
			for(var j=1;j<a.length;j++){
				doms[i].className+=" "+a[j];
			}
		}
	},
	// 删除一个class
	removeClass:function(dom,className){
		var doms = zm.all(dom);
		for(var i=0;i<doms.length;i++){
			// replace返回一个替换后的字符串
			doms[i].className = doms[i].className.replace(className,"");
		}
	},
	// 删除多个class
	removeClassNames:function(){
		var a = arguments;
		var doms = zm.all(a[0]);
		for(var i=0;i<doms.length;i++){
			for(var j=1;j<a.length;j++){
				doms[i].className = doms[i].className.replace(a[j],"");
			}
		}
	}
});

// 事件模块
zm.extend(zm,{
	// 绑定事件
	on:function(obj,type,fn){
		// 如果是字符串则获取它的元素，否则使用它已获取的元素
		var o = typeof obj==='string'?document.getElementById(obj):obj;
		// 兼容浏览器
		if(document.addEventListener){
			o.addEventListener(type,fn,false);
		}else{
			if(o.attachEvent){
				o.attachEvent('on'+type,fn);
			}
		}
	},
	// 解除绑定事件
	un:function(obj,type,fn){
		// 如果是字符串则获取它的元素，否则使用它已获取的元素
		var o = typeof obj==='string'?document.getElementById(obj):obj;
		// 兼容浏览器
		if(o.removeEventListener){
			o.removeEventListener(type,fn,false);
		}else{
			if(o.detachEvent){
				o.detachEvent('on'+type,fn);
			}
		}
	},
	// 单击事件
	click:function(obj,fn){
		this.on(obj,'click',fn);
	},
	// 鼠标进入
	mouseover:function(obj,fn){
		this.on(obj,'mouseover',fn);
	},
	// 鼠标离开
	mouseout:function(obj,fn){
		this.on(obj,'mouseout',fn);
	}
});

// Event模块
zm.extend(zm,{
	// 获取目标元素
	target:function(e){
		var e = e || window.event;
		return e.target || e.srcElement;
	},
	// 阻止冒泡
	stopevent:function(e){
		var e = e || window.event;
		if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.cancelBubble = true;
        }
	}
});
	w.Z = w.Zm = zm;
})(window);
