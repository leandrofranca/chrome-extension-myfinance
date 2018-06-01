chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    getData();
    sendResponse();
  }
);

function startOfx() {
  return `
OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE
<OFX>
<BANKMSGSRSV1>
<STMTTRNRS>
<STMTRS>
<BANKTRANLIST>`;
}

function endOfx() {
  return `
</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;
}

function bankStatement(date, amount, description) {
  return `
<STMTTRN>
<TRNTYPE>OTHER</TRNTYPE>
<DTPOSTED>${date}</DTPOSTED>
<TRNAMT>${amount}</TRNAMT>
<MEMO>${description}</MEMO>
</STMTTRN>`;
}

function getData() {
  var date, description, amount, doc;

  var ofx = startOfx();
  $('#RetornoConsulta tbody tr').each(function(index) {
    amount = amountFormat($(this).children()[3].textContent.trim())
    description = $(this).children()[1].textContent.trim()
    date = $(this).children()[0].textContent.trim();
  });
    ofx += bankStatement(date, amount, description);
  ofx += endOfx();

  link = document.createElement("a");
  link.setAttribute("href", 'data:application/x-ofx,' + encodeURIComponent(ofx));
  link.setAttribute("download", "extrato.ofx");
  link.click();
}

function amountFormat(amount) {
  var value = amount.replace(/[^0-9-,]/g, '').replace(",", ".");
  return value * 1;
}
