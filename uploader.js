// const axios = require('axios');
const API_ENDPOINT = 'https://n6cakyv1dg.execute-api.eu-west-1.amazonaws.com/default/fileUploader';
const MAX_FILE_SIZE = 1000000

const fileField = document.querySelector('input[type="file"]');
const uploadedFileItem = document.querySelector('#uploaded_file');
let targetFile;

const rows = [
  ['customer_id', 'customer_address', 'trn_id', 'trn_date', 'trn_amount'],
];

const getTransactionData = () => {
  const transactionId = Math.round(Math.random() * 1000000000);

  const csvRows = [];
  csvRows.push(document.querySelector('#customer_id').value);
  csvRows.push(document.querySelector('#customer_address').value);
  csvRows.push(`T${transactionId}`);
  csvRows.push(document.querySelector('#trn_date').value ?? 'Invalid date');
  csvRows.push(document.querySelector('#trn_amount').value ?? 0);
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
}

const tester = () => {
  const targetFile = createFile(fileField.files[0]);
  let reader = new FileReader();
  reader.readAsDataURL(fileField.files[0]);
  console.log('reader ', reader)

  console.log('Uploading: ', targetFile)
  let binary = atob(targetFile.split(',')[1]) //use atob to decode base-64 encoded string
  console.log('binary is ', binary);
  let array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  let blobData = new Blob([new Uint8Array(array)], {type: 'text/plain'})
  console.log('blobData is: ', blobData);
}
