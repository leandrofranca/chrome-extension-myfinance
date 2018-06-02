chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    getData();
    sendResponse();
  }
);

function getData() {
  var tds, detail, type, client, date, doc, description, amount, charges_array;
  charges_array = [
    ["Tipo", "Quantia", "Data", "Mês de Competência", "Descrição", "Documento", "Categoria", "Cliente / Fornecedor", "Centro de Custo / Receita", "Transferência para", "Produto", "Região"]
  ];

  $('#RetornoConsulta tbody tr').each(function(index) {
    tds = $(this).children();

    date = tds[0].textContent.trim();
    detail = $(tds).eq(1).children('span').children('span.TextoDetalheTransferenciaExtrato')
    client = ""
    if (detail.length > 0) {
      client = $(detail)[0].textContent.trim();
    }
    description = tds[1].textContent.replace(client, "").trim();
    doc = tds[2].textContent.trim();
    amount = amountFormat(tds[3].textContent.trim());
    if (amount > 0) {
      type = "Crédito";
    } else {
      type = "Débito";
    }
    charges_array.push([type, amount, date, "", description, doc, "", client, "", "", "", ""]);
  });

  var wb = XLSX.utils.book_new(),
    ws = XLSX.utils.aoa_to_sheet(charges_array);
  XLSX.utils.book_append_sheet(wb, ws, "Extrato");
  XLSX.writeFile(wb, "Extrato_NEL.xls");
}

function amountFormat(amount) {
  var value = amount.replace(/[^0-9-,]/g, '').replace(",", ".");
  return value * 1;
}
