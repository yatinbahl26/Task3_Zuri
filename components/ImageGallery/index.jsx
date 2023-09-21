import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const ImageGallery = ({ images, onDragEnd }) => {
  const [direction, setDirection] = useState("vertical");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 641) {
        setDirection("horizontal");
      } else {
        setDirection("vertical");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="image-gallery" direction={direction}>
        {(provided, snapshot) => (
          <div
            className="w-full flex  flex-col justify-center items-center sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 "
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {images.map((image, index) => (
              <Draggable key={image.id} draggableId={image.id} index={index}>
                {(provided) => (
                  <div
                    className={`relative w-[250px] h-[370px] hover:scale-[1.02] ${snapshot.isDragging ? "enlarge-while-dragging" : ""
                      }`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className="absolute top-0 p-[15px]">
                      <p className="flex justify-center items-center text-[12px] font-bold text-gray-900 rounded-lg bg-[#F3F9F6] bg-opacity-70 backdrop-blur-sm px-2 py-1">
                        {image.tags}
                      </p>
                    </div>
                    <img
                      src={image.imageUrl}
                      alt={image.alt}
                      className="w-full h-full  "
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ImageGallery;
