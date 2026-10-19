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
  
  const openFilterBtn = document.getElementById('openFilterBtn');
  const filterModal = document.getElementById('filterModal');
  const clearFilterBtn = document.getElementById('clearFilterBtn');
  const applyFilterBtn = document.getElementById('applyFilterBtn');

  if (openFilterBtn) {
    openFilterBtn.addEventListener('click', () => {
      filterModal.classList.add('active');
    });
  }

  if (filterModal) {
    filterModal.addEventListener('click', (e) => {
      if (e.target === filterModal) {
        filterModal.classList.remove('active');
      }
    });
  }

  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', () => {
      const radioInputs = filterModal.querySelectorAll('input[type="radio"]');
      radioInputs.forEach(input => input.checked = false);

      const selects = filterModal.querySelectorAll('select');
      selects.forEach(select => select.selectedIndex = 0);
    });
  }

  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', () => {
      filterModal.classList.remove('active');
    });
  }

  const searchInput = document.getElementById('searchInput');
  const toastNotification = document.getElementById('toastNotification');
  let toastTimer;

  function showToast() {
    if (toastNotification) {
      toastNotification.classList.remove('hidden');
      setTimeout(() => {
        toastNotification.classList.add('show');
      }, 10);

      clearTimeout(toastTimer);

      toastTimer = setTimeout(() => {
        toastNotification.classList.remove('show');
        setTimeout(() => {
          toastNotification.classList.add('hidden');
        }, 400);
      }, 3000);
    }
  }

  function goToCourse(code) {
    window.location.href = `read.html?code=${encodeURIComponent(code)}`;
  }

  // ค้นหาด้วยรหัสวิชา -> เรียก GET /api/courses/{code}
  if (searchInput) {
    searchInput.addEventListener('keypress', async (e) => {
      if (e.key !== 'Enter') return;

      const keyword = searchInput.value.trim().toUpperCase();
      if (keyword === '') {
        showToast();
        return;
      }

      try {
        const response = await fetch(`/api/courses/${encodeURIComponent(keyword)}`);
        if (response.ok) {
          const course = await response.json();
          goToCourse(course.code);
        } else {
          showToast(); // 404 = ไม่พบรายวิชา
        }
      } catch (err) {
        showToast();
      }
    });
  }

  // คลิกการ์ดวิชา -> ไปหน้ารีวิวของวิชานั้น
  document.querySelectorAll('.course-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const code = card.querySelector('.course-code').textContent.trim();
      goToCourse(code);
    });
  });

    // เติมคะแนนเฉลี่ยและจำนวนรีวิวจริงจาก API ให้การ์ดวิชา (แทนค่าตัวอย่างใน HTML)
  document.querySelectorAll('.course-card').forEach(async (card) => {
    const footer = card.querySelector('.course-footer');
    if (!footer) return;

    const code = card.querySelector('.course-code').textContent.trim();
    footer.innerHTML = '';   // ล้างค่าตัวอย่างก่อน

    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(code)}/reviews`);
      if (!res.ok) return;
      const data = await res.json();

      if (data.reviewCount === 0) {
        const empty = document.createElement('span');
        empty.className = 'score';
        empty.textContent = 'ยังไม่มีรีวิว';
        footer.appendChild(empty);
        return;
      }

      // ดาว + คะแนนเฉลี่ย
      const rating = document.createElement('div');
      rating.className = 'rating';
      const stars = document.createElement('div');
      stars.className = 'stars';
      const rounded = Math.round(data.averageRating);
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = i <= rounded ? 'fa-solid fa-star' : 'fa-regular fa-star';
        stars.appendChild(star);
      }
      const score = document.createElement('span');
      score.className = 'score';
      score.textContent = data.averageRating.toFixed(1);
      rating.appendChild(stars);
      rating.appendChild(score);

      // จำนวนรีวิว
      const stats = document.createElement('div');
      stats.className = 'stats';
      const icon = document.createElement('i');
      icon.className = 'fa-regular fa-comment';
      const count = document.createElement('span');
      count.textContent = data.reviewCount + ' รีวิว';
      stats.appendChild(icon);
      stats.appendChild(count);

      footer.appendChild(rating);
      footer.appendChild(stats);
    } catch (e) {
      // โหลดไม่ได้: ปล่อยส่วนล่างของการ์ดว่าง
    }
  });
  
});