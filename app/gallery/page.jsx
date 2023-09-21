"use client";

import { useCallback, useEffect, useState } from "react";
import { imagesFolder } from "./constants";
import ImageGallery from "@/components/ImageGallery";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getImageData, uploadImageAndText } from "@/service/upload";

const Gallery = () => {
  const [images, setImages] = useState(imagesFolder);
  const [allImages, setAllImages] = useState(imagesFolder);
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle image location change on drag
  const onDragEnd = (results) => {
    if (!results.destination) {
      return;
    }

    // Reorder images based on drag and drop
    const updatedImages = [...images];
    const [reorderedImage] = updatedImages.splice(results.source.index, 1);
    updatedImages.splice(results.destination.index, 0, reorderedImage);

    setImages(updatedImages);
  };

  const getAllImages = useCallback(async () => {
    try {
      const response = await getImageData();

      const dataArray = Object.keys(response).map((key) => ({
        id: key,
        alt: response[key].tags,
        ...response[key],
      }));

      // Sort dataArray by ID in descending order (latest first)
      const sortedDataArray = dataArray.sort((a, b) => {
        return b.id.localeCompare(a.id);
      });

      // Merge fetched data with existing images, new data at the top
      const mergedImages = [...sortedDataArray, ...imagesFolder];
      setImages(mergedImages);
      setAllImages(mergedImages);
    } catch (error) {
      console.log(error);
    }
  }, [images]);

  useEffect(() => {
    getAllImages();

    const timeout = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue === "") {
      setImages(allImages);
    } else {
      setImages(
        allImages.filter((image) =>
          image.tags.includes(searchValue.toLowerCase())
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const imageFile = form.get("imageFile");
    const imageTags = form.get("imageTags");

    try {
      await uploadImageAndText(imageFile, imageTags);

      e.target.reset();
    } catch (error) {
      console.log(error.message);
      setError("Error uploading image and tag data");
    } finally {
      setLoading(false);
      getAllImages();
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex gap-2 bg-black text-white w-full h-full p-2 flex-col lg:flex-row">
        <div className="w-full h-full md:h-screen flex flex-col flex-[1] px-4 py-10">
          <p className="text-2xl sm:text-3xl mb-4">Hello user, 👋</p>
          <p className="mb-6 text-center max-w-[500px]">
            Welcome to our drag&drop gallery of beautiful images. You can upload your images.
          </p>

          <form
            onSubmit={handleSearch}
            className="relative flex flex-col gap-3 w-full max-w-[500px] justify-center items-center my-4"
          >
            <input
              type="search"
              className="w-full px-3 py-2 rounded-md text-black"
              placeholder="Search image by tag name"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <button
              className="absolute top-0 right-0 w-[100px] h-10 flex justify-center items-center rounded-md bg-slate-50 text-black"
              type="submit"
            >
              Search
            </button>
          </form>
          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col gap-3 w-full max-w-[500px] justify-center items-center"
          >
            {/* <label className="relative w-full rounded-md">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-[0.2] cursor-pointer"
                name="imageFile"
                required
              />
              <div className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300">
                Choose a file
              </div>
            </label> */}

            {/* <input
              type="text"
              className="w-full px-3 py-2 rounded-md text-black"
              name="imageTags"
              placeholder="image tag"
              required
            /> */}
            {/* <button
              className="absolute bottom-0 right-0 w-[100px] h-10 flex justify-center items-center rounded-md bg-slate-50 text-black"
              type="submit"
            >
              Upload
            </button> */}
          </form>
          {loading && (
            <img
              src="/loader.svg"
              alt="loading..."
              className="w-[150px] h-[150px] mx-auto"
            />
          )}
          {error && (
            <p className="max-w-[300px] text-red-500 text-center">{error}</p>
          )}
        </div>
        <div className="flex-[3] w-full flex justify-evenly py-4 overflow-hidden">
          <ImageGallery images={images} onDragEnd={onDragEnd} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Gallery;
