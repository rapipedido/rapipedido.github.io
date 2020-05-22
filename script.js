var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1KO--qj4tmVaqSnxhbgHhlx_ttqviLBzct5e9sYgDBNU/edit?usp=sharing';
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcaCBt2SjGSZHUqV9TyDoV66FyYZCGr6SPNgYoyKCjpqcobDMl0ip7D9GZPpICXWqdrFM3l_tf8I_1/pub?output=csv';

var phone_num = '584147660652';

function init() {
    console.log("version 0.17");
    Papa.parse(publicSpreadsheetUrl, {
      download: true,
      header: true,
      complete: showInfo
    })
}

function showInfo(data, tabletop) {
    console.log(data.data);
    $( ".spinner" ).remove();
    //  Set up Currency.js
    const USD = value => currency(value, { symbol: "$", precision: 2 });
    const VEF = value => currency(value, { symbol: "Bs. ", precision: 0 });

    var parsed = "";
    var stock = "";
    var precio = "";			
    let lista = document.getElementById('lista');
    var i=0;
  	$.each( data.data, function( y, item ) {
      $.trim(item["Precio Bs F"] = item["Precio Bs F"]); 
      $.trim(item["Precio USD"] = item["Precio USD"]);
      $.trim(item["Unidades en stock"] = item["Unidades en stock"]);
      $.trim(item.Marca = item.Marca);
      $.trim(item.Titulo = item.Titulo);
      $.trim(item.Descripcion = item.Descripcion);
      if(item["Precio Bs F"] != "" && item.Marca != "" && item.Imagen != "" && item.Titulo != "" && item.Descripcion != "" && item["Unidades en stock"] != "" &&  item["Unidades en stock"] != "#VALUE!"&&  item["Precio Bs F"] != "#VALUE!"){
      	stock = item["Unidades en stock"];
        //precio = item["Precio Bs F"].substring(2,item["Precio Bs F"].length-3).replace(",",'.').replace(",",'.');
        precio = VEF(item["Precio Bs F"]).format();
        precio_usd = USD(item["Precio USD"]).format();
        if($.isNumeric(parseInt(stock))){
        //if(isNumberDot(precio) && $.isNumeric(parseInt(stock))){
          parsed += "<div class='item'><div class='div-item-img'>";
      		if(item["Unidades en stock"] > 0){
      			parsed += "<img class='item-img'";
            parsed +=" src='"+item.Imagen+"'></div>"; 
            parsed +="<div class='item-desc'><h3 class='desc'>"+item.Marca+" "+item.Titulo+"</h3>"; 
            parsed +="<p>"+item.Descripcion+"</p>"; 
            parsed +="<input type='text' class='price' value='"+precio+" Bs.' disabled='True'><span class='price-usd'> | $"+precio_usd+"</span></div>"; 
            parsed +="<div class='item-qtd'><input type='button' class='btn' id='plus' value='-' onclick='process(-1,"+i+", "+stock+")' />"; 
            parsed +="<input name='quant' class='quant' size='1' type='text' value='0' disabled='True' />"; 
            parsed +="<input type='button' class='btn' id='minus' value='+' onclick='process(1,"+i+", "+stock+")'><br>"; 
            parsed +="</div></div>";  
      		}else{
      			parsed += "<img class='item-img-out'";
            parsed +=" src='"+item.Imagen+"' width='88' height='88'></div>"; 
            parsed +="<div class='item-desc'><h3 class='desc' style='color: #555'>"+item.Marca+" "+item.Titulo+"</h3>"; 
            parsed +="<p style='color: #555'>"+item.Descripcion+"</p>"; 
            parsed +="<input type='text' class='price' style='color: #555;-webkit-text-fill-color: #555;' value='"+precio+" Bs.' disabled='true'></div>"; 
            parsed +="<div class='item-qtd'><input type='button' class='btn' value='-' onclick='process(-1,"+i+", "+stock+")'  disabled='True'/>"; 
            parsed +="<input name='quant' class='quant' style='color: #555;-webkit-text-fill-color: #555;' size='1' type='text' value='0' disabled='True' />"; 
            parsed +="<input type='button' class='btn' value='+' onclick='process(1,"+i+", "+stock+")' disabled='True'><br>"; 
            parsed +="</div></div>";  
      		}        
      		i++;
        }
      }
  	});                       
    document.getElementById('lista').innerHTML = parsed;
}

function process(quant, i, max){
    var val = parseInt(document.getElementsByClassName("quant")[i].value);
    val += quant;
    if(val < 0){
      document.getElementsByClassName("quant")[i].value = 0;
    }else if(val > max){
      document.getElementsByClassName("quant")[i].value = max;
    }else{
    	document.getElementsByClassName("quant")[i].value = val;
    }
    var t = document.getElementById("total").value = 0;
    for(var y=0 ; y<document.getElementsByClassName("quant").length;y++){
    	document.getElementById("total").value = (parseInt(document.getElementById("total").value) + 
    		parseInt(document.getElementsByClassName("quant")[y].value.replace(".",'').replace(".",'')) * 
    		VEF(document.getElementsByClassName("price")[y].value));
    }
    document.getElementById("total").value = VEF(document.getElementById("total").value).format();
    msg();
}

function msg(){
  var d = new Date();
  var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  var base_url = "https://wa.me/"+phone_num+"/?text="
  var msg = "*PEDIDO* - Fecha " + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  for(var y=0 ; y<document.getElementsByClassName("quant").length;y++){
    if(parseInt(document.getElementsByClassName("quant")[y].value)>0){
        msg += "\r\n"+ document.getElementsByClassName("quant")[y].value + "x " + document.getElementsByClassName("desc")[y].textContent;
      }
  }
    msg += "\r\n\r\n" + "*Total*: " + document.getElementById("total").value;
    msg += "\r\n\r\n" + "Tu pedido no está confirmado,\r\nespera una respuesta para la confirmación."
    document.getElementById("btn_img").href = base_url + encodeURIComponent(msg);
}

function isNumberDot(valor){
  for(var x = 0; valor.length > x ; x++){
    if (!($.isNumeric(parseInt(valor[x])) || (valor[x] == '.') && x != 0)){
      return false;
    }
  }
  return true;
}

window.addEventListener('DOMContentLoaded', init)