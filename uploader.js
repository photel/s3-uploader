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
  const targetFile = fileField[0];
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


// function readBlob() {

//   var files = document.querySelector('input[type="file"]');
//   if (!files.length) {
//     alert('Please select a file!');
//     return;
//   }
//   var file = files[0];

//   console.log(file.type);

//   var MIMEType = file.type;

//   // decode base64 string, remove space for IE compatibility
//   var reader = new FileReader();

//   reader.onload = function(readerEvt) {

// 		// This is done just for the proof of concept
//     var binaryString = readerEvt.target.result;
//     var base64 = btoa(binaryString);
//     var blobfile = atob(base64);


//     window.blobFromBlobFile = b64toBlob(base64, MIMEType, 512);
//     window.blobURL = URL.createObjectURL(window.blobFromBlobFile);


//     if (MIMEType != "image/jpeg") {
//       var a = "<br /><a href=\"" + window.blobURL + "\">Blob File Link</a>";
//     } else {
//       var a = "<img src=" + window.blobURL + "\>";
//     }

//     document.getElementById('byte_content').innerHTML = a;

//   };

//   reader.readAsBinaryString(file);
// }

// document.querySelector('.readBytesButtons').addEventListener('click', function(evt) {
//   if (evt.target.tagName.toLowerCase() == 'button') {
//     readBlob();
//   }
// }, false);

// function changefunction(args) {
//   readBlob();
// }

// function b64toBlob(b64Data, contentType, sliceSize) {
//     contentType = contentType || '';
//     sliceSize = sliceSize || 512;

//     var byteCharacters = atob(b64Data);
//     var byteArrays = [];

//     for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//         var slice = byteCharacters.slice(offset, offset + sliceSize);

//         var byteNumbers = new Array(slice.length);
//         for (var i = 0; i < slice.length; i++) {
//             byteNumbers[i] = slice.charCodeAt(i);
//         }

//         var byteArray = new Uint8Array(byteNumbers);

//         byteArrays.push(byteArray);
//     }

//     var blob = new Blob(byteArrays, {type: contentType});
//     return blob;
// }
