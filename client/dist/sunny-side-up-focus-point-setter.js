document.addEventListener('click', e => {
  const wrapper = e.target.closest('.sunny-side-up-set-focus-point')
  if (!wrapper) return

  const img = wrapper.querySelector('img')
  if (!img) return

  const rect = img.getBoundingClientRect()

  const relX = (e.clientX - rect.left) / rect.width
  const relY = (e.clientY - rect.top) / rect.height

  const focusX = relX * 2 - 1
  const focusY = -(relY * 2 - 1)

  console.log('focusX:', focusX.toFixed(3), 'focusY:', focusY.toFixed(3))

  fetch(wrapper.dataset.updateUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x: focusX, y: focusY })
  })
})
