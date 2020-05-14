var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1KO--qj4tmVaqSnxhbgHhlx_ttqviLBzct5e9sYgDBNU/edit?usp=sharing';
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcaCBt2SjGSZHUqV9TyDoV66FyYZCGr6SPNgYoyKCjpqcobDMl0ip7D9GZPpICXWqdrFM3l_tf8I_1/pub?output=csv';

function init() {
    console.log("version 0.15");
    Papa.parse(publicSpreadsheetUrl, {
      download: true,
      header: true,
      complete: showInfo
    })
}

function showInfo(data, tabletop) {
    console.log(data.data);
    $( ".spinner" ).remove();
    var parsed = "";			
    let lista = document.getElementById('lista');
    var i=0;
  	$.each( data.data, function( y, item ) {
  		parsed += "<div class='item'><div class='div-item-img'>";
  		if(item["Unidades en stock"] > 0){
  			parsed += "<img class='item-img'";
        parsed +=" src='"+item.Imagen+"'></div>"; 
        parsed +="<div class='item-desc'><h3 class='desc'>"+item.Marca+" "+item.Titulo+"</h3>"; 
        parsed +="<p>"+item.Descripcion+"</p>"; 
        parsed +="<input type='text' class='price' value='"+item["Precio Bs F"].substring(2,item["Precio Bs F"].length-3).replace(",",'.').replace(",",'.')+" Bs.' disabled='true'></div>"; 
        parsed +="<div class='item-qtd'><input type='button' class='btn' id='plus' value='-' onclick='process(-1,"+i+", "+item["Unidades en stock"]+")' />"; 
        parsed +="<input name='quant' class='quant' size='1' type='text' value='0' disabled='True' />"; 
        parsed +="<input type='button' class='btn' id='minus' value='+' onclick='process(1,"+i+", "+item["Unidades en stock"]+")'><br>"; 
        parsed +="</div></div>";  
  		}else{
  			parsed += "<img class='item-img-out'";
        parsed +=" src='"+item.Imagen+"' width='88' height='88'></div>"; 
        parsed +="<div class='item-desc'><h3 class='desc' style='color: #555'>"+item.Marca+" "+item.Titulo+"</h3>"; 
        parsed +="<p style='color: #555'>"+item.Descripcion+"</p>"; 
        parsed +="<input type='text' class='price-out' value='"+item["Precio Bs F"].substring(2,item["Precio Bs F"].length-3).replace(",",'.').replace(",",'.')+" Bs.' disabled='true'></div>"; 
        parsed +="<div class='item-qtd'><input type='button' class='btn' value='-' onclick='process(-1,"+i+", "+item["Unidades en stock"]+")'  disabled='True'/>"; 
        parsed +="<input name='quant' class='quant-out' size='1' type='text' value='0' disabled='True' />"; 
        parsed +="<input type='button' class='btn' value='+' onclick='process(1,"+i+", "+item["Unidades en stock"]+")' disabled='True'><br>"; 
        parsed +="</div></div>";  
  		}        
  			i++;
  		}
    );                       
    document.getElementById('lista').innerHTML = parsed;
}

function process(quant, i, max){
    var val = parseInt
(document.getElementsByClassName("quant")[i].value);
    val += quant;
    if(val < 0){
      document.getElementsByClassName("quant")[i].value = 0;
    }else if(val > max){
      document.getElementsByClassName("quant")[i].value = max;
    }else{
    	document.getElementsByClassName("quant")[i].value = val;
    }
    var t = 
    document.getElementById("total").value = 0;
    for(var y=0 ; y<document.getElementsByClassName("quant").length;y++){
    	document.getElementById("total").value = (parseInt(document.getElementById("total").value) + 
    		parseInt(document.getElementsByClassName("quant")[y].value.replace(".",'').replace(".",'')) * 
    		parseInt(document.getElementsByClassName("price")[y].value.replace(".",'').replace(".",'').substring(0,(document.getElementsByClassName("price")[y].value.length-3))));
    }
    document.getElementById("total").value = parseInt(document.getElementById("total").value).toLocaleString("pt") + " Bs." ;
    msg();
}

function msg(){
	var d = new Date();
	var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
	var msg = "https://wa.me/584147660652/?text=*Pedido* - Fecha " + d.getDate() + "%20" + months[d.getMonth()] + "%20" + d.getFullYear();
	for(var y=0 ; y<document.getElementsByClassName("quant").length;y++){
		if(parseInt(document.getElementsByClassName("quant")[y].value)>0){
    		msg += "%0A"+ document.getElementsByClassName("quant")[y].value + "x " + document.getElementsByClassName("desc")[y].textContent;
    	}
	}
    msg += "%0A%0A" + "*Total*: " + document.getElementById("total").value;
    msg += "%0A%0A" + "Tu pedido no está confirmado,%0Aespera una respuesta para la confirmación."
    document.getElementById("btn_img").href = encodeURI(msg);
}


window.addEventListener('DOMContentLoaded', init)