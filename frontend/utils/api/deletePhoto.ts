export const deletePhoto = async (photoId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos/${photoId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete photo");
  }
};
