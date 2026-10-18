document.addEventListener('DOMContentLoaded', () => {
  const writeReviewForm = document.getElementById('writeReviewForm');

  if (writeReviewForm) {
    writeReviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const displayName = document.querySelector('input[name="displayName"]:checked').value;
      const reviewText = document.querySelector('.review-textarea').value;
      
      console.log('--- Review Submitted ---');
      console.log('Display Name:', displayName);
      console.log('Review:', reviewText);
      
      alert('รีวิวของคุณถูกส่งเรียบร้อยแล้ว!');
    });
  }
});