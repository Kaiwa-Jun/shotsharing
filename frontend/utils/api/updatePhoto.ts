import axios from "axios";

export async function updatePhoto(id: number, formData: FormData) {
  try {
    const response = await axios.patch(`/api/photos/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}
