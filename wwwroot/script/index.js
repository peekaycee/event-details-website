const brandsContainer = document.querySelector('.brands');
const brandItems = document.querySelectorAll('.brand');
let scrollAmount = 0;

function scrollBrands() {
  const itemWidth = brandItems[0].offsetWidth;
  scrollAmount += itemWidth;

  brandsContainer.style.transform = `translateX(-${scrollAmount}px)`;

  // Reset scroll when it reaches the end
  if (scrollAmount >= brandsContainer.scrollWidth / 2) {
    brandsContainer.style.transform = 'translateX(0)';
    scrollAmount = 0;
  }
}

// Start the carousel
setInterval(scrollBrands, 2000);
