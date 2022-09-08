import { useState } from "react";

function Modal({ handleSetImages, handleModalOpen }) {
  const [searchedImages, setSearchedImages] = useState([]);

  const searchApi =
    "https://api.unsplash.com/search/photos?client_id=pUMdKf_Knqnrm9YOuFpuKbiV5q6WgsAU3vbg5PEkTTA&query=";

  const handleClick = (image) => {
    handleSetImages(image);
    handleModalOpen(false);
  };

  const handleChange = (searchText) => {
    fetch(searchApi + searchText)
      .then((resp) => resp.json())
      .then((data) => setSearchedImages(data.results));
  };

  return (
    <div className="modal">
      <div className="head">
        <input type="text" onChange={(e) => handleChange(e.target.value)} />
        <button className="close" onClick={() => handleModalOpen(false)}>
          Close
        </button>
      </div>
      <div className="img-wrapper">
        {searchedImages.map((image) => {
          return (
            <img
              src={image.urls.thumb}
              key={image.id}
              onClick={() => handleClick(image)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Modal;
