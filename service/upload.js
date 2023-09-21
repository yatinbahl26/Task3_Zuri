import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const uploadImageAndText = async (imageFile, imageTags) => {
  try {
    const storageRef = ref(storage, `images/${imageFile.name}`);
    const imageSnapshot = await uploadBytes(storageRef, imageFile);

    const imageUrl = await getDownloadURL(imageSnapshot.ref);

    const imageData = {
      imageUrl,
      tags: imageTags,
    };

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const response = await fetch(
            "https://gallery-686d2-default-rtdb.firebaseio.com/images.json",
            {
              method: "POST",
              body: JSON.stringify(imageData),
            }
          );
        } catch (error) {
          console.error("Error uploading image and text data:", error);
        }
      } else {
        console.log("User is not authenticated.");
      }
    });
  } catch (error) {
    console.error("Error uploading image and text data:", error);
  }
};

export const getImageData = async () => {
  const response = await fetch(
    "https://gallery-686d2-default-rtdb.firebaseio.com/images.json"
  );

  return response.json();
};
