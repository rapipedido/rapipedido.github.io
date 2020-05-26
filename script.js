var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1KO--qj4tmVaqSnxhbgHhlx_ttqviLBzct5e9sYgDBNU/edit?usp=sharing';
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcaCBt2SjGSZHUqV9TyDoV66FyYZCGr6SPNgYoyKCjpqcobDMl0ip7D9GZPpICXWqdrFM3l_tf8I_1/pub?output=csv';

var phone_num = '584147660652';

//  Set up Currency.js
const USD = value => currency(value, {
  formatWithSymbol: false,
  precision: 2
});
const VEF = value => currency(value, {
  symbol: "Bs.",
  formatWithSymbol: false,
  precision: 0
});

const USD_with_symbol = value => currency(value, {
  formatWithSymbol: true,
  precision: 2
});

const VEF_with_symbol = value => currency(value, {
  symbol: "Bs.",
  formatWithSymbol: true,
  precision: 0
});

function init() {
  console.log("version 0.17");
  Papa.parse(publicSpreadsheetUrl, {
    download: true,
    header: true,
    complete: showInfo
  })
}

function validProduct(item) {
  if (item["Precio Bs F"] != "" &&
    item.Marca != "" &&
    item.Imagen != "" &&
    item.Titulo != "" &&
    item.Descripcion != "" &&
    item["Unidades en stock"] != "" &&
    item["Unidades en stock"] != "#VALUE!" &&
    item["Precio Bs F"] != "#VALUE!") {
    return true;
  } else {
    return false;
  }
}

function showInfo(data, tabletop) {
  console.log(data.data);
  $(".spinner").remove();

  var parsed = "";
  var stock = "";
  var precio = "";
  let lista = document.getElementById('lista');
  var i = 0;
  $.each(data.data, function (y, item) {
    $.trim(item["Precio Bs F"] = item["Precio Bs F"]);
    $.trim(item["Precio USD"] = item["Precio USD"]);
    $.trim(item["Unidades en stock"] = item["Unidades en stock"]);
    $.trim(item.Marca = item.Marca);
    $.trim(item.Titulo = item.Titulo);
    $.trim(item.Descripcion = item.Descripcion);
    if (validProduct(item)) {
      stock = item["Unidades en stock"];
      precio = VEF_with_symbol(item["Precio Bs F"]).format();
      precio_secondary = USD_with_symbol(item["Precio USD"]).format();
      if ($.isNumeric(parseInt(stock))) {
        //if(isNumberDot(precio) && $.isNumeric(parseInt(stock))){
        parsed += "<div class='item'><div class='div-item-img'>";
        if (item["Unidades en stock"] > 0) {
          parsed += "<img class='item-img'";
          parsed += " src='" + item.Imagen + "'></div>";
          parsed += "<div class='item-desc'><h3 class='desc'>" + item.Marca + " " + item.Titulo + "</h3>";
          parsed += "<p>" + item.Descripcion + "</p>";
          parsed += "<input type='text' name=" + item.Titulo + " class='price' value='" + precio + "' disabled='True'><input type='text' class='price-secondary' value='" + precio_secondary + "' ' disabled='True'></div>";
          parsed += "<div class='item-qtd'><input type='button' class='btn' id='minus' value='-' onclick='process(-1," + i + ", " + stock + ")' />";
          parsed += "<input name='quant' class='quant' size='1' type='text' value='0' disabled='True' />";
          parsed += "<input type='button' class='btn' id='plus' value='+' onclick='process(1," + i + ", " + stock + ")'><br>";
          parsed += "</div></div>";
        } else { // OOS Items
          parsed += "<img class='item-img-out'";
          parsed += " src='" + item.Imagen + "' width='88' height='88'></div>";
          parsed += "<div class='item-desc'><h3 class='desc outofstock'>" + item.Marca + " " + item.Titulo + "</h3>";
          parsed += "<p class='outofstock'>" + item.Descripcion + "</p>";
          parsed += "<input type='text' class='price outofstock' value='" + precio + " Bs.' disabled='true'><input type='text' class='price-secondary' value='" + precio_secondary + "' ' disabled='True'></div>";;
          parsed += "<div class='item-qtd'><input type='button' class='btn outofstock' onclick='process(0," + i + ", " + stock + ")'  disabled='True'/>";
          parsed += "<input name='quant' class='quant outofstock' size='1' type='text' value='0' disabled='True' />";
          parsed += "<input type='button' class='btn outofstock' onclick='process(0," + i + ", " + stock + ")' disabled='True'><br>";
          parsed += "</div></div>";
        }
        i++;
      }
    }
  });
  document.getElementById('lista').innerHTML = parsed;
}

function process(update_delta, i, max) {
  // Update Available Stock
  var qty_available = parseInt(document.getElementsByClassName("quant")[i].value);
  qty_available += update_delta;
  console.log("QTY Available after click: " + qty_available);
  if (qty_available < 0) {
    document.getElementsByClassName("quant")[i].value = 0;
  } else if (qty_available > max) {
    document.getElementsByClassName("quant")[i].value = max;
  } else {
    document.getElementsByClassName("quant")[i].value = qty_available;
  }

  // Recalculate Total Cart Amount
  var t = 0;
  for (var y = 0; y < document.getElementsByClassName("quant").length; y++) {
    console.log("VEF Amount:" + VEF(document.getElementsByClassName("price")[y].value));
    t = t +
      (parseInt(document.getElementsByClassName("quant")[y].value) *
        VEF(document.getElementsByClassName("price")[y].value).value);
  };

  // Add price to nav bar
  document.getElementById("total-primary").value = VEF_with_symbol(t).format();

  // Recalculate Total Cart Amount - Secondary 
  var t_secondary = 0;
  for (var y = 0; y < document.getElementsByClassName("quant").length; y++) {
    t_secondary = t_secondary +
      (parseInt(document.getElementsByClassName("quant")[y].value) *
        USD(document.getElementsByClassName("price-secondary")[y].value).value);
  }

  // Add price to nav bar - Secondary 
  document.getElementById("total-secondary").value = USD_with_symbol(t_secondary).format();

  // Rewrite message
  msg();
}

function msg() {
  var d = new Date();
  var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  var base_url = "https://wa.me/" + phone_num + "/?text="
  var msg = "*PEDIDO* - Fecha " + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  for (var y = 0; y < document.getElementsByClassName("quant").length; y++) {
    if (parseInt(document.getElementsByClassName("quant")[y].value) > 0) {
      msg += "\r\n" + document.getElementsByClassName("quant")[y].value + "x " + document.getElementsByClassName("desc")[y].textContent;
    }
  }
  msg += "\r\n\r\n" + "*Total*: " + VEF_with_symbol(document.getElementById("total-primary").value).format();
  msg += " | " + USD_with_symbol(document.getElementById("total-secondary").value).format();
  msg += "\r\n\r\n" + "Tu pedido no está confirmado,\r\nespera una respuesta para la confirmación."

  // Add new text to message
  document.getElementById("btn_order").href = base_url + encodeURIComponent(msg);
}

window.addEventListener('DOMContentLoaded', init)