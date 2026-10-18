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

  const starGroups = document.querySelectorAll('.star-group');
  
  starGroups.forEach(group => {
    const stars = group.querySelectorAll('.star-icon'); 
    
    stars.forEach(star => {
      star.addEventListener('mouseover', function() {
        const value = this.getAttribute('data-val');
        stars.forEach(s => {
          if (s.getAttribute('data-val') <= value) {
            s.classList.add('hover');
          } else {
            s.classList.remove('hover');
          }
        });
      });

      star.addEventListener('mouseout', function() {
        stars.forEach(s => {
          s.classList.remove('hover');
        });
      });

      star.addEventListener('click', function() {
        const value = this.getAttribute('data-val');
        group.setAttribute('data-selected', value); 
        
        stars.forEach(s => {
          if (s.getAttribute('data-val') <= value) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });
    });
  });
});