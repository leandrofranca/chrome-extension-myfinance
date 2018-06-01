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

  var monthYear = monthYearFormat($(".tablist li.current")[0].textContent.trim());
  var year = getYear($(".tablist li.current")[0].textContent.trim());

  $(".abasInternas:visible .QuadroInformacao .table tr").each(function(index) {
    if ($(this).html().indexOf("colspan") == -1) {
      amount = amountFormat($(this).children()[2].textContent.trim())
      description = $(this).children()[1].textContent.trim()
      date = dayMonthFormat($(this).children()[0].textContent.trim()) + "/" + year;
      charges_array.push(["Normal", "", amount, description, date, "", "", "", "", "", "", ""]);
    }
  });

  var wb = XLSX.utils.book_new(),
    ws = XLSX.utils.aoa_to_sheet(charges_array);
  XLSX.utils.book_append_sheet(wb, ws, "Fatura " + monthYear);
  XLSX.writeFile(wb, "fatura-" + monthYear + ".xls");
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
