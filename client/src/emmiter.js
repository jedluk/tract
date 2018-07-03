import { setReadyImage } from "./actions/img";

export default (socket, store) => {
  socket.on("finished processing", data => {
    const { outImgName: name } = data;
    store.dispatch(setReadyImage(name));
  });
};
