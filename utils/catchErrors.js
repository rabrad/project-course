function catchErrors(error, displayError) {
  let errorMsg;
  if (error.response) {
    // The request was made but the server respond with 
    // a status that is not on the range of 200..
    errorMsg = error.response.data;
    console.error("Error response", errorMsg);

    // if Cloudonary image uploads
    if (error.response.data.error) {
      errorMsg = error.response.data.error.message;
    }

  } else if (error.request) {
    // The request was made, but no response received
    errorMsg = error.request;
    console.error("Error request", errorMsg);
  } else {
    // Something else happened in making the request that trigger an error
    errorMsg = error.message;
    console.error("Error message", errorMsg);
  }

  displayError(errorMsg)
}

export default catchErrors;