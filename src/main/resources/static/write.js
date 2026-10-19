document.addEventListener('DOMContentLoaded', () => {

  // คลิกโลโก้ TU REVIEW เพื่อกลับหน้าหลัก (search)
  const brand = document.querySelector('.brand');
  if (brand) {
    brand.style.cursor = 'pointer';
    brand.addEventListener('click', () => {
      window.location.href = 'search.html';
    });
  }

  // ---------- ระบบดาว (ของเดิม) ----------
  document.querySelectorAll('.star-group').forEach(group => {
    const stars = group.querySelectorAll('.star-icon');

    stars.forEach(star => {
      star.addEventListener('mouseover', function () {
        const value = Number(this.getAttribute('data-val'));
        stars.forEach(s => {
          s.classList.toggle('hover', Number(s.getAttribute('data-val')) <= value);
        });
      });

      star.addEventListener('mouseout', () => {
        stars.forEach(s => s.classList.remove('hover'));
      });

      star.addEventListener('click', function () {
        const value = Number(this.getAttribute('data-val'));
        group.setAttribute('data-selected', value);
        stars.forEach(s => {
          s.classList.toggle('active', Number(s.getAttribute('data-val')) <= value);
        });
      });
    });
  });

  // ---------- ส่งรีวิวจริง ----------
  const form = document.getElementById('writeReviewForm');
  if (!form) return;

  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem('userProfile'));
    } catch (e) {
      return null;
    }
  }

  // รหัสนักศึกษา: ลองหลายชื่อฟิลด์ (จะแก้ให้ตรงหลังรู้ชื่อจริง)
  function getStudentId(profile) {
    if (!profile) return null;
    const candidates = [profile.studentId, profile.username, profile.userName, profile.userId, profile.id];
    for (const c of candidates) {
      if (c !== undefined && c !== null && /^\d+$/.test(String(c))) {
        return String(c);
      }
    }
    return null;
  }

  function getRating(category) {
    const group = document.querySelector('.star-group[data-category="' + category + '"]');
    const v = group ? Number(group.getAttribute('data-selected')) : 0;
    return v >= 1 && v <= 5 ? v : null;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const profile = getProfile();
    const studentId = getStudentId(profile);
    if (!studentId) {
      alert('กรุณาเข้าสู่ระบบก่อนเขียนรีวิว');
      window.location.href = 'index.html';
      return;
    }

    const difficulty = getRating('difficulty');
    const workload = getRating('workload');
    const instructor = getRating('instructor');
    if (!difficulty || !workload || !instructor) {
      alert('กรุณาให้ดาวให้ครบทั้ง 3 ด้าน');
      return;
    }

    const courseCode = form.querySelectorAll('select')[2].value.toUpperCase();
    const comment = document.querySelector('.review-textarea').value.trim();
    const hideName = document.querySelector('input[name="displayName"]:checked').value === 'anonymous';

    try {
      // 1) หา id ของรายวิชาจากรหัสวิชา
      const courseRes = await fetch('/api/courses/' + encodeURIComponent(courseCode));
      if (!courseRes.ok) {
        alert('ไม่พบรายวิชา ' + courseCode);
        return;
      }
      const course = await courseRes.json();

      // 2) สร้างรีวิว
      const reviewRes = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(studentId),
          targetId: course.id,
          difficultyRating: difficulty,
          workloadRating: workload,
          instructorRating: instructor,
          comment: comment
        })
      });
      if (!reviewRes.ok) {
        alert('ส่งรีวิวไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง');
        return;
      }
      const review = await reviewRes.json();

      // 3) ตั้งค่าการแสดงชื่อ (ระบบ anonymity ของ BE4)
      const anonRes = await fetch('/api/reviews/' + review.reviewId + '/anonymity', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': studentId },
        body: JSON.stringify({
          anonymous: hideName,
          authorName: hideName ? null : (profile.name || null)
        })
      });
      if (!anonRes.ok) {
        console.warn('ตั้งค่าการแสดงชื่อไม่สำเร็จ (รีวิวถูกบันทึกแล้ว)');
      }

      alert('รีวิวของคุณถูกส่งเรียบร้อยแล้ว!');
      window.location.href = 'read.html?code=' + encodeURIComponent(courseCode);

    } catch (err) {
      console.error(err);
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่');
    }
  });
});