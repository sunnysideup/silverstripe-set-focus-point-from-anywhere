//
// Initialise any existing OR newly added wrappers
//
function initFocusWrapper (wrapper) {
  if (wrapper.dataset.ssuFocusInit === '1') return
  wrapper.dataset.ssuFocusInit = '1'

  const img = wrapper.querySelector('img')
  const point = wrapper.querySelector('.ssu-focus-marker')
  if (!img || !point) return

  wrapper.style.position = 'relative'
  wrapper.style.cursor = 'crosshair'

  //
  // Place marker visually using relX/relY (0..1)
  //
  function updateMarkerFromRel (relX, relY) {
    point.style.left = relX * 100 + '%'
    point.style.top = relY * 100 + '%'
  }

  wrapper._updateMarkerFromRel = updateMarkerFromRel

  //
  // INITIAL POSITION from Silverstripe focus values (-1..1)
  //
  const focusX = parseFloat(wrapper.dataset.currentX || 0)
  const focusY = parseFloat(wrapper.dataset.currentY || 0)

  // Convert SS focus → rel coords (0..1)
  const relX = (focusX + 1) / 2
  const relY = (focusY + 1) / 2

  updateMarkerFromRel(relX, relY)
}

// Init current items
document
  .querySelectorAll('.sunny-side-up-set-focus-point')
  .forEach(initFocusWrapper)

//
// Delegated click handler — works for AJAX inserts
//
document.addEventListener('click', e => {
  const wrapper = e.target.closest('.sunny-side-up-set-focus-point')
  if (!wrapper) return

  initFocusWrapper(wrapper)

  const img = wrapper.querySelector('img')
  if (!img) return

  const rect = img.getBoundingClientRect()

  // Click → REL coords (0..1)
  const relX = (e.clientX - rect.left) / rect.width
  const relY = (e.clientY - rect.top) / rect.height

  // Update marker visually immediately
  wrapper._updateMarkerFromRel(relX, relY)

  //
  // Convert REL → Silverstripe focus values (-1..1)
  // (Silverstripe: top = -1, bottom = +1)
  //
  const focusX = relX * 2 - 1
  const focusY = relY * 2 - 1 // ← CORRECT FINAL FORM

  // Build GET request
  const url = new URL(wrapper.dataset.updateUrl)
  url.searchParams.set('x', focusX)
  url.searchParams.set('y', focusY)

  fetch(url.toString(), { method: 'GET' })
    .then(res => res.text())
    .then(text => {
      if (text.trim() === 'OK') {
        wrapper.dataset.currentX = focusX
        wrapper.dataset.currentY = focusY
      } else {
        console.warn('Focus update failed:', text)
      }
    })
    .catch(err => console.error(err))
})

//
// Auto-detect AJAX-added wrappers
//
const obs = new MutationObserver(mutations => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (!(node instanceof HTMLElement)) return

      if (node.classList?.contains('sunny-side-up-set-focus-point')) {
        initFocusWrapper(node)
      }

      node
        .querySelectorAll?.('.sunny-side-up-set-focus-point')
        .forEach(initFocusWrapper)
    })
  })
})

obs.observe(document.body, { childList: true, subtree: true })
