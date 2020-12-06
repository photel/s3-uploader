// const axios = require('axios');
const API_ENDPOINT = 'https://n6cakyv1dg.execute-api.eu-west-1.amazonaws.com/default/fileUploader';
const MAX_FILE_SIZE = 1000000

const uploaderButton = document.querySelector('#trigger_upload');file_upload_input

// const formData = new FormData();
const fileField = document.querySelector('input[type="file"]');
const uploadedFileItem = document.querySelector('#uploaded_file');
let targetFile;

const rows = [
  ['customer_id', 'customer_address', 'trn_id', 'trn_date', 'trn_amount'],
  ['C1', '1 Smith Street London', 'T31', '03/16/2017', '100'],
  ['C2', '2 Smith Street London', 'T32', '03/16/2017', '200'],
  ['C2', '2 Smith Street London', 'T33', '04/7/2017', '50'],
];


let csvContent = "data:text/csv;charset=utf-8," 
  + rows.map(e => e.join("|")).join("\n");

// const triggerUpload = () => {
//   formData.append('transaction', fileField.files[0]);
// };

// const getPresignedUrl = () => {
//   axios.get(API_ENDPOINT)
//   .then(function (response) {
//     postData_test(response);
//   })
//   .catch(function (error) {
//     console.error(error);
//   })
//   .then(function () {
//     // add success / failure notification to view
//   });
// };

// const postData_test = (payload) => {
//   console.log(payload);
// }

const postData = async () => {
  // targetFile = fileField.files[0];
  console.log('Posting data')
  // Get the presigned URL
  const response = await axios({
    method: 'GET',
    url: API_ENDPOINT
  });
  console.log('Response: ', response.data)
  console.log('Uploading: ', csvContent)
  let binary = csvContent.split(',')[1];
  console.log('binary is ', binary);
  let array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  let blobData = new Blob([new Uint8Array(array)], {type: 'text/plain'})
  console.log('Uploading to: ', response.data.uploadURL)
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
