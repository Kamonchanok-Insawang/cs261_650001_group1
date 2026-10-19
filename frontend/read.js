document.addEventListener('DOMContentLoaded', () => {

    // แสดงชื่อผู้ใช้ที่ login อยู่ แทนข้อความ "User Account"
  try {
    const profile = JSON.parse(localStorage.getItem('userProfile'));
    if (profile && profile.name) {
      document.querySelectorAll('*').forEach(el => {
        if (el.children.length === 0 && el.textContent.trim() === 'User Account') {
          el.textContent = profile.name;
        }
      });
    }
  } catch (e) {
    // ไม่มีข้อมูลผู้ใช้: ปล่อยเป็น "User Account" ตามเดิม
  }

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

    // หา element ชื่อ/ไอคอนผู้เขียนใน modal ตอนโหลดหน้า (ตอนนี้ยังเป็นข้อความตัวอย่าง "Anonymous")
  const modalNameEl = fullReviewModal
    ? Array.from(fullReviewModal.querySelectorAll('*'))
        .find(el => el.children.length === 0 && el.textContent.trim() === 'Anonymous')
    : null;
  const modalAvatarIcon = fullReviewModal
    ? fullReviewModal.querySelector('.fa-user-secret, .fa-user')
    : null;

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

    // ---------- รหัสนักศึกษาของผู้ที่ login อยู่ ----------
  function getMyStudentId() {
    try {
      const p = JSON.parse(localStorage.getItem('userProfile'));
      return p && p.studentId ? String(p.studentId) : null;
    } catch (e) {
      return null;
    }
  }
  const myId = getMyStudentId();

  // ---------- Modal ยืนยันการลบรีวิว ----------
  const deleteModal = document.getElementById('deleteConfirmModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  let pendingDeleteId = null;

  function closeDeleteModal() {
    pendingDeleteId = null;
    if (deleteModal) deleteModal.classList.remove('active');
  }

  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  if (deleteModal) {
    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) closeDeleteModal();
    });
  }
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!pendingDeleteId || !myId) return;
      try {
        const res = await fetch('/api/reviews/' + pendingDeleteId, {
          method: 'DELETE',
          headers: { 'X-User-Id': myId }
        });
        if (res.ok) {
          window.location.reload();
          return;
        }
        const body = await res.json().catch(() => ({}));
        alert(body.message || 'ลบรีวิวไม่สำเร็จ');
      } catch (e) {
        alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
      }
      closeDeleteModal();
    });
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleString('th-TH-u-ca-gregory', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  // ---------- ดาว ----------
  function createStars(rating, showNumber) {
    const stars = document.createElement('div');
    stars.className = 'stars';
    const rounded = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('i');
      if (i <= rounded) {
        star.className = 'fa-solid fa-star';
      } else {
        star.className = 'fa-regular fa-star';
        star.style.color = '#e2e8f0';
      }
      stars.appendChild(star);
    }
    if (showNumber) {
      const num = document.createElement('span');
      num.textContent = Number(rating).toFixed(1);
      num.style.marginLeft = '6px';
      num.style.fontSize = '0.85em';
      stars.appendChild(num);
    }
    return stars;
  }

  // ---------- คะแนน 3 ด้านใน modal ----------
  function fillModalRatings(review) {
    const grid = document.querySelector('.modal-ratings-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const rows = [
      ['ความยาก (Difficulty)', review.difficultyRating],
      ['ภาระงาน (Workload)', review.workloadRating],
      ['ความใจดีของอาจารย์ (Instructor)', review.instructorRating]
    ];
    let count = 0;
    rows.forEach(([label, value]) => {
      if (value === null || value === undefined) return;
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:8px;';
      const l = document.createElement('span');
      l.textContent = label;
      row.appendChild(l);
      row.appendChild(createStars(value, false));
      grid.appendChild(row);
      count++;
    });
    grid.style.display = count > 0 ? '' : 'none';
  }

  function openFullReview(review) {
    document.querySelector('.modal-review-body').textContent = review.comment || '';
    document.querySelector('.review-date-time').textContent = formatDate(review.createdAt);

            // ชื่อผู้เขียนและไอคอนใน modal
    const shownName = review.authorName || 'Anonymous';
    if (modalNameEl) modalNameEl.textContent = shownName;
    if (modalAvatarIcon) {
      modalAvatarIcon.className = shownName === 'Anonymous'
        ? 'fa-solid fa-user-secret'
        : 'fa-solid fa-user';
    }

    fillModalRatings(review);

    // ยอดไลก์/วิวยังไม่มีใน API (Sprint 2) จึงซ่อนไว้
    const socialStats = document.querySelector('.modal-social-stats');
    if (socialStats) socialStats.style.display = 'none';

    fullReviewModal.classList.add('active');
  }

  // ---------- สร้างการ์ดรีวิว (ใช้ textContent กันโค้ดแปลกปลอมในคอมเมนต์) ----------
  function createCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openFullReview(review));

    const header = document.createElement('div');
    header.className = 'card-header';

    const authorName = review.authorName || 'Anonymous';
    const isAnonymous = authorName === 'Anonymous';

    const info = document.createElement('div');
    info.className = 'reviewer-info';
    const avatar = document.createElement('div');
    avatar.className = 'reviewer-avatar';
    avatar.innerHTML = isAnonymous
      ? '<i class="fa-solid fa-user-secret"></i>'
      : '<i class="fa-solid fa-user"></i>';
    const name = document.createElement('span');
    name.className = 'reviewer-name';
    name.textContent = authorName;
    info.appendChild(avatar);
    info.appendChild(name);

    header.appendChild(info);
    const starsEl = createStars(review.rating, true);
    if (review.mine) {
      const actions = document.createElement('div');
      actions.className = 'header-actions';
      actions.appendChild(starsEl);

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-delete';
      delBtn.title = 'Delete Review';
      delBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();   // ไม่ให้เปิด modal อ่านรีวิวเต็ม
        pendingDeleteId = review.reviewId;
        if (deleteModal) deleteModal.classList.add('active');
      });
      actions.appendChild(delBtn);
      header.appendChild(actions);
    } else {
      header.appendChild(starsEl);
    }

    const body = document.createElement('div');
    body.className = 'card-body';
    const comment = review.comment || '';
    const LIMIT = 60;
    if (comment.length > LIMIT) {
      body.textContent = comment.slice(0, LIMIT) + '... ';
      const more = document.createElement('span');
      more.className = 'read-more';
      more.textContent = 'อ่านเพิ่มเติม';
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
      const response = await fetch(
        `/api/courses/${encodeURIComponent(courseCode)}/reviews`,
        { headers: myId ? { 'X-User-Id': myId } : {} }
      );
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

      // เฉลี่ยรายด้าน
      const parts = [];
      if (data.averageDifficulty !== null && data.averageDifficulty !== undefined) {
        parts.push(`ความยาก ${data.averageDifficulty.toFixed(1)}`);
      }
      if (data.averageWorkload !== null && data.averageWorkload !== undefined) {
        parts.push(`ภาระงาน ${data.averageWorkload.toFixed(1)}`);
      }
      if (data.averageInstructor !== null && data.averageInstructor !== undefined) {
        parts.push(`ความใจดีอาจารย์ ${data.averageInstructor.toFixed(1)}`);
      }
      if (parts.length > 0) {
        const detail = document.createElement('p');
        detail.className = 'course-name';
        detail.textContent = parts.join('  ·  ');
        summary.insertAdjacentElement('afterend', detail);
      }

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