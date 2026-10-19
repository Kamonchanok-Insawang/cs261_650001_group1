document.addEventListener('DOMContentLoaded', () => {

    // คลิกโลโก้ TU REVIEW เพื่อกลับหน้าหลัก (search)
  const brand = document.querySelector('.brand');
  if (brand) {
    brand.style.cursor = 'pointer';
    brand.addEventListener('click', () => {
      window.location.href = 'search.html';
    });
  }
  
  // ---------- อ่านรหัสวิชาจาก URL: read.html?code=CS261 ----------
  const params = new URLSearchParams(window.location.search);
  const courseCode = (params.get('code') || '').trim().toUpperCase();
  if (!courseCode) {
    window.location.href = 'search.html';
    return;
  }

  const codeEl = document.querySelector('.course-header .course-code');
  const nameEl = document.querySelector('.course-header .course-name');
  const emptyState = document.querySelector('.empty-state');
  const reviewGrid = document.querySelector('.review-grid');

  // ซ่อนเนื้อหาตัวอย่างไว้ก่อนจนกว่าข้อมูลจริงจะมา
  emptyState.style.display = 'none';
  reviewGrid.style.display = 'none';
  reviewGrid.innerHTML = '';
  codeEl.textContent = courseCode;
  nameEl.textContent = 'กำลังโหลด...';

  // ---------- Modal อ่านรีวิวเต็ม ----------
  const fullReviewModal = document.getElementById('fullReviewModal');
  const closeReviewModalBtn = document.getElementById('closeReviewModalBtn');

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

  function formatDate(iso) {
    return new Date(iso).toLocaleString('th-TH-u-ca-gregory', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function openFullReview(review) {
    document.querySelector('.modal-review-body').textContent = review.comment || '';
    document.querySelector('.review-date-time').textContent = formatDate(review.createdAt);
    // ข้อมูลคะแนนแยกหมวดและยอดไลก์ยังไม่มีใน API (Sprint 2) จึงซ่อนไว้
    const ratingsGrid = document.querySelector('.modal-ratings-grid');
    const socialStats = document.querySelector('.modal-social-stats');
    if (ratingsGrid) ratingsGrid.style.display = 'none';
    if (socialStats) socialStats.style.display = 'none';
    fullReviewModal.classList.add('active');
  }

  // ---------- สร้างการ์ดรีวิว (ใช้ textContent กันโค้ดแปลกปลอมในคอมเมนต์) ----------
  function createStars(rating) {
    const stars = document.createElement('div');
    stars.className = 'stars';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('i');
      if (i <= rating) {
        star.className = 'fa-solid fa-star';
      } else {
        star.className = 'fa-regular fa-star';
        star.style.color = '#e2e8f0';
      }
      stars.appendChild(star);
    }
    return stars;
  }

  function createCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';

    const header = document.createElement('div');
    header.className = 'card-header';

    const info = document.createElement('div');
    info.className = 'reviewer-info';
    const avatar = document.createElement('div');
    avatar.className = 'reviewer-avatar';
    avatar.innerHTML = '<i class="fa-solid fa-user-secret"></i>';
    const name = document.createElement('span');
    name.className = 'reviewer-name';
    name.textContent = 'Anonymous';
    info.appendChild(avatar);
    info.appendChild(name);

    header.appendChild(info);
    header.appendChild(createStars(review.rating));

    const body = document.createElement('div');
    body.className = 'card-body';
    const comment = review.comment || '';
    const LIMIT = 60;
    if (comment.length > LIMIT) {
      body.textContent = comment.slice(0, LIMIT) + '... ';
      const more = document.createElement('span');
      more.className = 'read-more';
      more.textContent = 'อ่านเพิ่มเติม';
      more.addEventListener('click', () => openFullReview(review));
      body.appendChild(more);
    } else {
      body.textContent = comment;
    }

    card.appendChild(header);
    card.appendChild(body);
    return card;
  }

  // ---------- ดึงข้อมูลจริงจาก backend ----------
  async function loadReviews() {
    try {
      const response = await fetch(`/api/courses/${encodeURIComponent(courseCode)}/reviews`);

      if (response.status === 404) {
        nameEl.textContent = 'ไม่พบรายวิชา';
        return;
      }
      if (!response.ok) {
        nameEl.textContent = 'โหลดข้อมูลไม่สำเร็จ';
        return;
      }

      const data = await response.json();
      codeEl.textContent = data.code;
      nameEl.textContent = data.name;

      // แสดงคะแนนเฉลี่ยและจำนวนรีวิวใต้ชื่อวิชา
      const summary = document.createElement('p');
      summary.className = 'course-name';
      summary.textContent = data.reviewCount > 0
        ? `คะแนนเฉลี่ย ${data.averageRating.toFixed(1)} / 5 (${data.reviewCount} รีวิว)`
        : 'ยังไม่มีคะแนน';
      nameEl.insertAdjacentElement('afterend', summary);

      if (data.reviewCount === 0) {
        emptyState.style.display = '';   // แสดงสถานะ "ยังไม่มีรีวิว"
      } else {
        data.reviews.forEach(r => reviewGrid.appendChild(createCard(r)));
        reviewGrid.style.display = '';
      }
    } catch (err) {
      nameEl.textContent = 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้';
    }
  }

  loadReviews();

  // ---------- ปุ่มเขียนรีวิว / เรียงลำดับ ----------
  const addReviewBtn = document.getElementById('addReviewBtn');
  const emptyStateWriteBtn = document.getElementById('emptyStateWriteBtn');
  const sortSelect = document.getElementById('sortSelect');
  const writeUrl = `write.html?code=${encodeURIComponent(courseCode)}`;

  if (addReviewBtn) {
    addReviewBtn.addEventListener('click', () => { window.location.href = writeUrl; });
  }
  if (emptyStateWriteBtn) {
    emptyStateWriteBtn.addEventListener('click', () => { window.location.href = writeUrl; });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      console.log(`เรียงลำดับรีวิวตาม: ${e.target.value}`);
    });
  }
});