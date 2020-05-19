export const getImageFile = (): Promise<File> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");

    input.accept = "image/png,image/jpeg";
    input.multiple = false;
    input.type = "file";

    const callback = (event: Event) => {
      const { files } = event.target as HTMLInputElement;

      if (!files) {
        return reject();
      }

      document.body.removeChild(input);

      return resolve(files[0]);
    };

    input.style.width = "0";
    input.style.height = "0";
    input.style.top = "0";
    input.style.left = "0";
    input.style.position = "fixed";

    input.addEventListener("change", callback, false);
    document.body.appendChild(input);
    input.click();
  });
};
