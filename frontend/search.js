document.addEventListener('DOMContentLoaded', () => {
  const openFilterBtn = document.getElementById('openFilterBtn');
  const filterModal = document.getElementById('filterModal');
  const clearFilterBtn = document.getElementById('clearFilterBtn');
  const applyFilterBtn = document.getElementById('applyFilterBtn');

  if(openFilterBtn) {
    openFilterBtn.addEventListener('click', () => {
      filterModal.classList.add('active');
    });
  }

  if(filterModal) {
    filterModal.addEventListener('click', (e) => {
      if (e.target === filterModal) {
        filterModal.classList.remove('active');
      }
    });
  }

  if(clearFilterBtn) {
    clearFilterBtn.addEventListener('click', () => {
      const radioInputs = filterModal.querySelectorAll('input[type="radio"]');
      radioInputs.forEach(input => input.checked = false);

      const selects = filterModal.querySelectorAll('select');
      selects.forEach(select => select.selectedIndex = 0);
    });
  }

  if(applyFilterBtn) {
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

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const keyword = searchInput.value.trim().toUpperCase();
        
        if (keyword === 'CS999' || keyword === '') {
          showToast();
        } else {
          alert(`กำลังค้นหาวิชา: ${keyword} ...`);
        }
      }
    });
  }
});