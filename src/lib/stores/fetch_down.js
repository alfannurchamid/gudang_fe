// @ts-nocheck
export const fetchDown = (url, saveas) => {
  // (A) FETCH FILE
  fetch(url)
    // (B) RETURN AS BLOB
    .then((result) => {
      if (result.status != 200) {
        throw new Error("Bad server response");
      }
      return result.blob();
    })

    // (C) BLOB DATA
    .then((data) => {
      // (C1) FILE DATA IS "READY FOR USE"
      console.log(data);

      // (C2) TO "FORCE DOWNLOAD"
      var url = window.URL.createObjectURL(data),
        anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = saveas;
      anchor.click();

      // (C3) CLEAN UP
      window.URL.revokeObjectURL(url);
      document.removeChild(anchor);
    })

    // (D) HANDLE ERRORS - OPTIONAL
    .catch((error) => {
      console.log(error);
    });
};