// const axios = require('axios');
const API_ENDPOINT = 'https://n6cakyv1dg.execute-api.eu-west-1.amazonaws.com/default/fileUploader';

const uploaderButton = document.querySelector('#trigger_upload');

// const formData = new FormData();
const fileField = document.querySelector('input[type="file"]');
const uploadedFileItem = document.querySelector('#uploaded_file');


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
  const targetFile = fileField.files[0];
  console.log('Posting data')
  // Get the presigned URL
  const response = await axios({
    method: 'GET',
    url: API_ENDPOINT
  });
  console.log('Response: ', response.data)
  console.log('Uploading: ', targetFile)
  let binary = atob(targetFile.split(',')[1]) //use atob to decode base-64 encoded string
  console.log('binary is ', binary);
  let array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  let blobData = new Blob([new Uint8Array(array)], {type: 'text/csv'})
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
