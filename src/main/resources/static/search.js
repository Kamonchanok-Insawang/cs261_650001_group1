document.addEventListener('DOMContentLoaded', () => {
  const openFilterBtn = document.getElementById('openFilterBtn');
  const filterModal = document.getElementById('filterModal');
  const clearFilterBtn = document.getElementById('clearFilterBtn');
  const applyFilterBtn = document.getElementById('applyFilterBtn');

  openFilterBtn.addEventListener('click', () => {
    filterModal.classList.add('active');
  });


  filterModal.addEventListener('click', (e) => {
    if (e.target === filterModal) {
      filterModal.classList.remove('active');
    }
  });

  clearFilterBtn.addEventListener('click', () => {
    const radioInputs = filterModal.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => input.checked = false);

    const selects = filterModal.querySelectorAll('select');
    selects.forEach(select => select.selectedIndex = 0);
  });


  applyFilterBtn.addEventListener('click', () => {
    filterModal.classList.remove('active');
  });
});