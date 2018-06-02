chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    getData();
    sendResponse();
  }
);

function getData() {
  var date, description, amount, charges_array, charges;
  charges_array = [
    ["Tipo", "Nº de Parcelas", "Quantia (R$)", "Descrição", "Data", "Categoria", "Nº do Documento", "Centro de Custo / Receita", "Cliente/Fornecedor", "Observação", "Produto", "Região"]
  ];
  charges = $(".md-tab-content:not(.ng-hide)").find(".charge");
  vencimento = $("md-tab.active md-tab-label h3").get(0).textContent.trim();
  vencimento = normalizeExpiryMonth(vencimento) + normalizeExpiryYear(vencimento);

  for (var i = 0; i < charges.length; i++) {
    date = normalizeDate($(charges).find(".date").get(i).textContent.trim());
    description = $(charges).find(".description").get(i).textContent.trim();
    amount = amountFormat($(charges).find(".amount").get(i).textContent.trim());
    charges_array.push(["Normal", "", amount, description, date, "", "", "", "", "", "", ""]);
  }

  var wb = XLSX.utils.book_new(),
    ws = XLSX.utils.aoa_to_sheet(charges_array);
  XLSX.utils.book_append_sheet(wb, ws, "Fatura " + vencimento);
  XLSX.writeFile(wb, "fatura-" + vencimento + ".xls");
}

function amountFormat(amount) {
  var value = amount.replace(/[^0-9-,]/g, '').replace(",", ".");
  return value * -1;
}

function normalizeDate(date) {
  return normalizeDay(date) + "/" + normalizeMonth(date) + "/" + normalizeYear(date);
}

function normalizeDay(date) {
  return date.split(' ')[0]
}

function normalizeMonth(date) {
  var month = date.split(' ')[1]
  var months = {
    'Jan': '01',
    'Fev': '02',
    'Mar': '03',
    'Abr': '04',
    'Mai': '05',
    'Jun': '06',
    'Jul': '07',
    'Ago': '08',
    'Set': '09',
    'Out': '10',
    'Nov': '11',
    'Dez': '12'
  }
  return months[month];
}

function normalizeYear(date) {
  var dateArray = date.split(' ');
  if (dateArray.length > 2) {
    return '20' + dateArray[2];
  } else {
    return new Date().getFullYear();
  };
}

function normalizeExpiryMonth(date) {
  var month = date.split(' ')[0]
  var months = {
    'Jan': '01',
    'Fev': '02',
    'Mar': '03',
    'Abr': '04',
    'Mai': '05',
    'Jun': '06',
    'Jul': '07',
    'Ago': '08',
    'Set': '09',
    'Out': '10',
    'Nov': '11',
    'Dez': '12'
  }
  return months[month];
}

function normalizeExpiryYear(date) {
  var dateArray = date.split(' ');
  if (dateArray.length == 2) {
    return '20' + dateArray[1];
  } else {
    return new Date().getFullYear();
  };
}
