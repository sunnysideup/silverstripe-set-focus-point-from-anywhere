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

  //
  // Convert relative (0–1) to CSS %
  //
  function updateMarkerFromRel (relX, relY) {
    const x = relX * 100 + '%'
    const y = relY * 100 + '%'
    point.style.left = x
    point.style.top = y
    wrapper.style.setProperty('--sunny-side-up-focus-x', x)
    wrapper.style.setProperty('--sunny-side-up-focus-y', y)
  }

  wrapper._updateMarkerFromRel = updateMarkerFromRel

  //
  // Initial marker position from data-currentX/Y (–1 → 1)
  //
  const focusX = parseFloat(wrapper.dataset.currentX || 0)
  const focusY = parseFloat(wrapper.dataset.currentY || 0)

  const relX = (focusX + 1) / 2
  const relY = (focusY + 1) / 2

  updateMarkerFromRel(relX, relY)

  //
  // --- DRAGGING SUPPORT ---
  //
  let isDragging = false

  function onMouseDown (e) {
    // Start dragging only when the image area is clicked
    if (!e.target.closest('.sunny-side-up-set-focus-point img')) return

    const rect = img.getBoundingClientRect()
    isDragging = true
    img.classList.add('ssu-focus-loading')

    function onMouseMove (ev) {
      if (!isDragging) return
      const relX = (ev.clientX - rect.left) / rect.width
      const relY = (ev.clientY - rect.top) / rect.height
      updateMarkerFromRel(relX, relY)
    }

    function onMouseUp (ev) {
      if (!isDragging) return
      isDragging = false

      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)

      const relX = (ev.clientX - rect.left) / rect.width
      const relY = (ev.clientY - rect.top) / rect.height

      updateMarkerFromRel(relX, relY)

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
          if (text.trim() !== 'OK') {
            throw new Error('Response not OK: ' + text)
          }
          wrapper.dataset.currentX = focusX
          wrapper.dataset.currentY = focusY
          img.classList.remove('ssu-focus-loading')
        })
        .catch(err => {
          console.error(err)
          img.classList.remove('ssu-focus-loading')
          img.classList.add('ssu-focus-error')
        })
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  wrapper.addEventListener('mousedown', onMouseDown)
}

//
// Initialise existing items
//
document
  .querySelectorAll('.sunny-side-up-set-focus-point')
  .forEach(initFocusWrapper)

//
// Delegated click support (still works as before)
// Clicking without dragging sets a new point
//
document.addEventListener('click', e => {
  const wrapper = e.target.closest('.sunny-side-up-set-focus-point')
  if (!wrapper) return

  // If dragging occurred, ignore the click event
  if (wrapper._dragJustFinished) {
    wrapper._dragJustFinished = false
    return
  }

  initFocusWrapper(wrapper)

  const img = wrapper.querySelector('img')
  if (!img) return

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
      if (text.trim() !== 'OK') {
        throw new Error('Response not OK: ' + text)
      }
      wrapper.dataset.currentX = focusX
      wrapper.dataset.currentY = focusY
      img.classList.remove('ssu-focus-loading')
    })
    .catch(err => {
      console.error(err)
      img.classList.remove('ssu-focus-loading')
      img.classList.add('ssu-focus-error')
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
