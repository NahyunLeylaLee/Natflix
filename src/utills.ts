export function makeImagePath(id: string, format?: string) {
  return id === null ? "/Natflix/noImage.png" : `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}