chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    getData();
    sendResponse();
  }
);

function getData() {
  var element, date, description, amount, charges_array;
  charges_array = [
    ["Tipo", "Nº de Parcelas", "Quantia (R$)", "Descrição", "Data", "Categoria", "Nº do Documento", "Centro de Custo / Receita", "Cliente/Fornecedor", "Observação", "Produto", "Região"]
  ];

  var year = getYear($(".tablist li.current").get(0).textContent.trim());

  $(".abasInternas:visible .QuadroInformacao .table tr").each(function(index) {
    if ($(this).html().indexOf("colspan") == -1) {
      element = $(this).children();
      amount = amountFormat(element[2].textContent.trim())
      description = element[1].textContent.trim()
      date = dayMonthFormat(element[0].textContent.trim()) + "/" + year;
      charges_array.push(["Normal", "", amount, description, date, "", "", "", "", "", "", ""]);
    }
  });

  var monthYear = monthYearFormat($(".tablist li.current").get(0).textContent.trim());

  var wb = XLSX.utils.book_new(),
    ws = XLSX.utils.aoa_to_sheet(charges_array);
  XLSX.utils.book_append_sheet(wb, ws, "Fatura " + monthYear);
  XLSX.writeFile(wb, "Fatura-Visa-Platinum-" + monthYear + ".xls");
}

function dayMonthFormat(date) {
  var value = date.replace(/[^0-9]/g, '');
  var day = value.substring(0, 2)
  var month = value.substring(2)
  return day + "/" + month;
}

function getYear(date) {
  var value = date.replace(/[^0-9]/g, '');
  var year = value.substring(2)
  return year;
}

function monthYearFormat(date) {
  var value = date.replace(/[^0-9]/g, '');
  var month = value.substring(0, 2)
  var year = value.substring(2)
  return month + "-" + year;
}

function amountFormat(amount) {
  var value = amount.replace(/[^0-9-,]/g, '').replace(",", ".");
  return value * -1;
}
