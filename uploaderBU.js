// const axios = require('axios');
const API_ENDPOINT = 'https://n6cakyv1dg.execute-api.eu-west-1.amazonaws.com/default/fileUploader';
const MAX_FILE_SIZE = 1000000

const uploaderButton = document.querySelector('#trigger_upload');file_upload_input

// const formData = new FormData();
const fileField = document.querySelector('input[type="file"]');
const uploadedFileItem = document.querySelector('#uploaded_file');
let targetFile;

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
  targetFile = fileField.files[0];
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

const createFile = (file) => {
  console.log('fired createFile with file: ', file);
  // var image = new Image()
  let reader = new FileReader();
  if (file) {
    reader.onload = (event) => {
      console.log('length: ', event.target.result.includes('data:text/plain'))
      if (!event.target.result.includes('data:text/plain')) {
        return alert('Wrong file type - Text files only.')
      }
      if (event.target.result.length > MAX_FILE_SIZE) {
        return alert('File is loo large - 1Mb maximum')
      }
      targetFile = event.target.result
    }
    const output = reader.readAsDataURL(file);
    console.log('output is: ', output);
    return output
  }
};
