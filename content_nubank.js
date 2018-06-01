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
  current_charges = document.querySelector(".md-tab-content:not(.ng-hide)");
  charges = current_charges.querySelectorAll(".charge");
  venc = current_charges.querySelectorAll(".date")[0].textContent.trim();
  venc = normalizeMonth(venc) + normalizeDay(venc);

  for (var i = 0; i < charges.length; i++) {
    date = normalizeDate(charges[i].querySelector(".date").textContent);
    description = charges[i].querySelector(".description").textContent.trim();
    amount = amountFormat(charges[i].querySelector(".amount").textContent);
    charges_array.push(["Normal", "", amount, description, date, "", "", "", "", "", "", ""]);
  }

  var wb = XLSX.utils.book_new(),
    ws = XLSX.utils.aoa_to_sheet(charges_array);
  XLSX.utils.book_append_sheet(wb, ws, "Fatura " + venc);
  XLSX.writeFile(wb, "fatura-" + venc + ".xls");
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
