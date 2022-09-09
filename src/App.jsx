import { useEffect, useState } from "react";
import "./App.css";
import Modal from "./components/Modal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [allImgs, setAllImgs] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const unsplashApi =
    "https://api.unsplash.com/search/photos?page=1&query=nature&client_id=pUMdKf_Knqnrm9YOuFpuKbiV5q6WgsAU3vbg5PEkTTA&per_page=30";

  useEffect(() => {
    fetch(unsplashApi)
      .then((resp) => resp.json())
      .then((data) => {
        setImages(data.results);
        setAllImgs(data.results);
      });
  }, []);

  // console.log("backup images", allImgs);
  console.log("IMAGES", images);

  const handleSearch = (value) => {
    if (value === "") {
      setImages(allImgs);
      return;
    }
    const searchedImgs = images.filter((img) => {
      if (img.description !== null) {
        return img.description.indexOf(value) === -1 ? false : true;
      } else if (img.alt_description !== null) {
        return img.alt_description.indexOf(value) === -1 ? false : true;
      } else return false;
    });
    setImages(searchedImgs);
  };

  const handleModalOpen = (value) => {
    setIsModalOpen(value);
  };

  const handleSetImages = (img) => {
    setImages([...images, img]);
  };

  const handleFilter = (value) => {
    if (value === "date") {
      const filterImgs = images.sort((a, b) => {
        let aD = new Date(a.created_at);
        let bD = new Date(b.created_at);
        return aD - bD;
      });
      setImages(filterImgs);
    } else if (value === "description") {
      const filterImgs = images.sort((a, b) => {
        if (
          (a.description || a.alt_description) <
          (b.description || b.alt_description)
        ) {
          return -1;
        }
        if (
          (a.description || a.alt_description) >
          (b.description || b.alt_description)
        ) {
          return 1;
        }
        return 0;
      });
      setImages(filterImgs);
    } else {
      setImages(allImgs);
    }
  };

  const handleToggleSelection = (id) => {
    let isSelected = false;
    for (let selected of selectedImages) {
      if (selected === id) isSelected = true;
    }
    return isSelected;
  };

  const handleDeselectAll = () => {
    setSelectedImages([]);
    setIsAllSelected(false);
  };

  const handleSelectAll = () => {
    const all = images.map((img) => img.id);
    setSelectedImages(all);
    setIsAllSelected(true);
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
    let newImages = selectedImages.filter((img) => img !== imgId);
    let isHere = false;
    for (let select of selectedImages) {
      if (imgId === select) isHere = true;
    }

    if (isHere) {
      setSelectedImages(newImages);
    } else {
      setSelectedImages([...newImages, imgId]);
    }
  };

  return (
    <div className="main">
      {isModalOpen && (
        <Modal
          handleSetImages={handleSetImages}
          handleModalOpen={handleModalOpen}
        />
      )}
      <h1>The Sea of Images</h1>
      <input
        type="text"
        placeholder="Search images"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="customise">
        <div className="btns">
          {isAllSelected ? (
            <button onClick={handleDeselectAll}>Deselect All</button>
          ) : (
            <button onClick={handleSelectAll}>Select All</button>
          )}
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
            <div key={image.id} className="wrapper">
              <img
                src={image.urls.small}
                onClick={() => handleClick(image.id)}
                className={handleToggleSelection(image.id) ? "selection" : ""}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
