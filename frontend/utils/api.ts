export interface ApiResponse<T> {
  data: T;
}

export async function getPhotos(): Promise<any[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos`
  );
  const data = await response.json();
  return data;
}
