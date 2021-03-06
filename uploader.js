// const axios = require('axios');
const API_ENDPOINT = 'https://n6cakyv1dg.execute-api.eu-west-1.amazonaws.com/default/fileUploader';
const MAX_FILE_SIZE = 1000000

const transactionForm = document.querySelector('#transaction_form');
const fileField = document.querySelector('input[type="file"]');
const uploadedFileItem = document.querySelector('#uploaded_file');
let targetFile;

const rows = [
  ['customer_id', 'customer_address', 'trn_id', 'trn_date', 'trn_amount'],
];

const getTransactionData = () => {
  const date = Math.floor(Date.now() / 1000);
  const transactionId = `${Math.round(Math.random() * 1000000000)}${date}`;

  const custAddress = document.querySelector('#customer_address').value.replace(/[, ]+/g, " ").trim();

  const csvRows = [];
  const transactionBalance = parseFloat((document.querySelector('#trn_credit').value)) + parseFloat(document.querySelector('#trn_debit').value*-1);
  csvRows.push(document.querySelector('#customer_id').value);
  csvRows.push(custAddress);
  csvRows.push(`T${transactionId}`);
  csvRows.push(document.querySelector('#trn_date').value ?? 'Invalid date');
  csvRows.push(transactionBalance);
  console.log('csvRows ',csvRows);
  return csvRows;
};

const generateCSV = (fnc) => {
  rows.push(fnc);

  let csvContent = "data:text/csv;charset=utf-8," 
  + rows.map(e => e.join("|")).join("\n");
  return csvContent;
};

const postData = async () => {
  const compiledCsv = generateCSV(getTransactionData());
  console.log('compiledCsv: ', compiledCsv);
  console.log('Posting data')
  // Get the presigned URL
  const response = await axios({
    method: 'GET',
    url: API_ENDPOINT
  });
  console.log('Response: ', response.data)
  console.log('Uploading: ', compiledCsv)
  let binary = compiledCsv.split(',')[1];
  console.log('binary is ', binary);
  let array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  let blobData = new Blob([new Uint8Array(array)], {type: 'text/plain'})
  console.log('Uploading to: ', response.data.uploadURL);
  console.log('blobData type: ', blobData.type);
  console.log('blobData: ', blobData);
  const result = await fetch(response.data.uploadURL, {
    method: 'PUT',
    body: blobData
  })
  console.log('Result: ', result)
  // Final URL for the user doesn't need the query string params
  const linkUrl = response.data.uploadURL.split('?')[0];
  uploadedFileItem.innerHTML = linkUrl;
  transactionForm.reset();
}
