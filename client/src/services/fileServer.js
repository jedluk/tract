import axios from 'axios';

export const FILE_SERVER =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : 'http://file_server:8081';

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await axios.post(`${FILE_SERVER}/upload`, fd);
  return res.data;
}
