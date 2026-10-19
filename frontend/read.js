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
  const emptyStateWriteBtn = document.getElementById('emptyStateWriteBtn');

  if(addReviewBtn) {
    addReviewBtn.addEventListener('click', () => {
      window.location.href = 'write.html';
    });
  }
  
  if(emptyStateWriteBtn) {
    emptyStateWriteBtn.addEventListener('click', () => {
      window.location.href = 'write.html'; 
    });
  }

  if(sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      console.log(`เรียงลำดับรีวิวตาม: ${selectedValue}`);
    });
  }

  const deleteBtns = document.querySelectorAll('.btn-delete');
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  let cardToDelete = null;

  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      cardToDelete = btn.closest('.review-card');
      deleteConfirmModal.classList.add('active');
    });
  });

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
      deleteConfirmModal.classList.remove('active');
      cardToDelete = null;
    });
  }
  if (deleteConfirmModal) {
    deleteConfirmModal.addEventListener('click', (e) => {
      if (e.target === deleteConfirmModal) {
        deleteConfirmModal.classList.remove('active');
        cardToDelete = null;
      }
    });
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (cardToDelete) {
        cardToDelete.remove();
      }
      deleteConfirmModal.classList.remove('active');
      cardToDelete = null;
    });
  }
});