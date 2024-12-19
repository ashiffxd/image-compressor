import React from "react";
import axios from "axios";

function Upload() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        action="/upload"
        method="POST"
        encType="multipart/form-data"
        className="flex flex-col items-center gap-4 p-6 bg-white shadow-lg rounded-md"
      >
        <input
          type="file"
          id="fileInput"
          name="image"
          className="block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={inputHandler}
          className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

async function inputHandler(event) {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (file) {
    const formData = new FormData();
    formData.append("image", file);
    await axios
      .post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    console.log("File not uploaded");
  }
}

export default Upload;
