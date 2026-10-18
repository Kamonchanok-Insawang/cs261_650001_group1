document.addEventListener('DOMContentLoaded', () => {
  const readMoreLinks = document.querySelectorAll('.read-more');
  const fullReviewModal = document.getElementById('fullReviewModal');
  const closeReviewModalBtn = document.getElementById('closeReviewModalBtn');

  readMoreLinks.forEach(link => {
    link.addEventListener('click', () => {
      fullReviewModal.classList.add('active');
    });
  });

  if (closeReviewModalBtn) {
    closeReviewModalBtn.addEventListener('click', () => {
      fullReviewModal.classList.remove('active');
    });
  }

  if (fullReviewModal) {
    fullReviewModal.addEventListener('click', (e) => {
      if (e.target === fullReviewModal) {
        fullReviewModal.classList.remove('active');
      }
    });
  }
  const addReviewBtn = document.getElementById('addReviewBtn');
  const sortSelect = document.getElementById('sortSelect');

  if(addReviewBtn) {
    addReviewBtn.addEventListener('click', () => {
      alert("กำลังไปยังหน้าสำหรับเขียนรีวิว..."); 
    });
  }

  if(sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      console.log(`เรียงลำดับรีวิวตาม: ${selectedValue}`);
    });
  }
});