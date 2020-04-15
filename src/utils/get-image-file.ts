export const getImageFile = (): Promise<File> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");

    input.accept = "image/*";
    input.multiple = false;
    input.type = "file";

    const callback = (event: Event) => {
      const { files } = event.target as HTMLInputElement;

      if (!files) {
        return reject();
      }

      return resolve(files[0]);
    };

    input.addEventListener("change", callback, false);
    document.body.appendChild(input);
    input.click();
  });
};
