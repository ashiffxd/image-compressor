import React from "react";
import axios from "axios";

function Upload() {
  const[image , setImage] = React.useState(null);

  async function inputHandler(event) {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

      const formData = new FormData();
      formData.append("image", file);
       const res = await axios.post("http://localhost:8000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        setImage(res.data.compressedImageUrl);
        console.log(res.data.compressedImageUrl);
    
  }
  
  return (
    <div className="h-screen">
      <div className="flex h-[500px] flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        action="/upload"
        method="POST"
        encType="multipart/form-data"
        className="flex flex-col items-center gap-4 p-6 bg-white shadow-lg rounded-md h-[500px] w-[500px]"
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
        <div className="flex items-center justify-center mt-44 h-10">
    {image &&
      <img src={image} alt="compressed" className="rounded-md h-[400px] w-250"/>
    }
    </div>
      </form>
    </div>

    
    </div>
  );
}


export default Upload;
