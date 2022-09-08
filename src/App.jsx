import { useEffect, useState } from "react";
import "./App.css";
import Modal from "./components/Modal";

function App() {
  const [holdSelection, setHoldSelection] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const unsplashApi =
    "https://api.unsplash.com/search/photos?page=1&query=nature&client_id=pUMdKf_Knqnrm9YOuFpuKbiV5q6WgsAU3vbg5PEkTTA&per_page=30";

  useEffect(() => {
    fetch(unsplashApi)
      .then((resp) => resp.json())
      .then((data) => {
        setImages(data.results);
      });
  }, []);

  const handleModalOpen = (value) => {
    setIsModalOpen(value);
  };

  const handleSetImages = (img) => {
    setImages([...images, img]);
  };

  const handleFilter = (value) => {
    let filterImgs = [];
    if (value === "date") {
      filterImgs = images.sort((a, b) => {
        let aD = new Date(a.created_at);
        let bD = new Date(b.created_at);
        return aD - bD;
      });
    } else if (value === "description") {
      filterImgs = images.sort((a, b) => {
        if (a.description < b.description) {
          return -1;
        }
        if (a.description > b.description) {
          return 1;
        }
        return 0;
      });
    }
    setImages(filterImgs);
  };

  const handleIsSelected = (id) => {
    let isSelected = false;
    for (let selected of selectedImages) {
      if (selected === id) isSelected = true;
    }
    return isSelected;
  };

  const handleSelectAll = () => {
    const all = images.map((img) => img.id);
    setSelectedImages(all);
  };

  const handleDelete = () => {
    const newImages = [];
    for (let image of images) {
      let isHere = false;
      for (let select of selectedImages) {
        if (image.id === select) isHere = true;
      }

      if (!isHere) newImages.push(image);
    }
    setImages(newImages);
    setSelectedImages([]);
  };

  const handleClick = (imgId) => {
    let newImages = selectedImages.filter((img) => img.id !== imgId);
    setSelectedImages([...newImages, imgId]);
    setHoldSelection(!holdSelection);
  };

  // console.log(images);

  return (
    <div className="main">
      {isModalOpen && (
        <Modal
          handleSetImages={handleSetImages}
          handleModalOpen={handleModalOpen}
        />
      )}
      <h1>The Sea of Images</h1>
      <input type="text" placeholder="Search images" />
      <div className="customise">
        <div className="btns">
          <button onClick={handleSelectAll}>Select All</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={() => setIsModalOpen(true)}>Add</button>
        </div>
        <div className="filter">
          <select name="filter" onChange={(e) => handleFilter(e.target.value)}>
            <option value="none" selected={true}>
              Sort By
            </option>
            <option value="date">Date</option>
            <option value="description">Description</option>
          </select>
        </div>
      </div>
      <div className="img-container">
        {images.map((image) => {
          return (
            <div className="wrapper" key={image.id}>
              <img
                src={image.urls.small}
                onClick={() => handleClick(image.id)}
              />
              {holdSelection && handleIsSelected(image.id) && (
                <div className="selection"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
