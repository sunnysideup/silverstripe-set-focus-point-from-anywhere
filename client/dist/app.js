//
// Initialise existing OR newly added wrappers
//
function initFocusWrapper (wrapper) {
  if (wrapper.dataset.ssuFocusInit === '1') return
  wrapper.dataset.ssuFocusInit = '1'

  const img = wrapper.querySelector('img')
  const point = wrapper.querySelector('.ssu-focus-marker')
  if (!img || !point) return

  wrapper.style.position = 'relative'
  wrapper.style.cursor = 'crosshair'

  function updateMarkerFromRel (relX, relY) {
    point.style.left = relX * 100 + '%'
    point.style.top = relY * 100 + '%'
  }

  wrapper._updateMarkerFromRel = updateMarkerFromRel

  // INITIAL POSITION
  const focusX = parseFloat(wrapper.dataset.currentX || 0)
  const focusY = parseFloat(wrapper.dataset.currentY || 0)

  const relX = (focusX + 1) / 2
  const relY = (focusY + 1) / 2

  updateMarkerFromRel(relX, relY)
}

document
  .querySelectorAll('.sunny-side-up-set-focus-point')
  .forEach(initFocusWrapper)

//
// Delegated click handler
//
document.addEventListener('click', e => {
  const wrapper = e.target.closest('.sunny-side-up-set-focus-point')
  if (!wrapper) return

  initFocusWrapper(wrapper)

  const img = wrapper.querySelector('img')
  if (!img) return

  // Clear old UI states
  img.classList.remove('ssu-focus-error')
  img.classList.add('ssu-focus-loading')

  const rect = img.getBoundingClientRect()
  const relX = (e.clientX - rect.left) / rect.width
  const relY = (e.clientY - rect.top) / rect.height

  wrapper._updateMarkerFromRel(relX, relY)

  const focusX = relX * 2 - 1
  const focusY = relY * 2 - 1

  const url = new URL(wrapper.dataset.updateUrl)
  url.searchParams.set('x', focusX)
  url.searchParams.set('y', focusY)

  fetch(url.toString(), { method: 'GET' })
    .then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res.text()
    })
    .then(text => {
      if (text.trim() === 'OK') {
        wrapper.dataset.currentX = focusX
        wrapper.dataset.currentY = focusY
        img.classList.remove('ssu-focus-loading')
      } else {
        throw new Error('Response not OK: ' + text)
      }
    })
    .catch(err => {
      console.error(err)
      img.classList.remove('ssu-focus-loading')
      img.classList.add('ssu-focus-error')
      // Optional: hide image
      // img.style.visibility = 'hidden'
    })
})

//
// MutationObserver: auto-init AJAX-added items
//
const obs = new MutationObserver(muts => {
  muts.forEach(m => {
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
