// const axios = require('axios');
const API_ENDPOINT = 'https://n6cakyv1dg.execute-api.eu-west-1.amazonaws.com/default/fileUploader';

const uploaderButton = document.querySelector('#trigger_upload');

const formData = new FormData();
const fileField = document.querySelector('input[type="file"]');


const triggerUpload = () => {
  formData.append('transaction', fileField.files[0]);
};

const getPresignedUrl = () => {
  axios.get(API_ENDPOINT)
  .then(function (response) {
    postData_test(response);
  })
  .catch(function (error) {
    console.error(error);
  })
  .then(function () {
    // add success / failure notification to view
  });
};

const postData_test = (payload) => {
  console.log(payload);
}

const uploadedFileItem = document.querySelector('#uploaded_file');
ReactDOM.render(reactEl(uploader), domContainer);