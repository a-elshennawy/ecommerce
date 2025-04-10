//the loader
document.addEventListener("DOMContentLoaded", function () {
  const loader = document.querySelector(".loader");

  if (loader) {
    loader.style.display = "none";
    setTimeout(() => {
      if (loader) {
        loader.style.display = "none";
      }
    }, 1000);
  }
});
