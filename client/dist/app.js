(self["webpackChunkpublic"] = self["webpackChunkpublic"] || []).push([["app"],{

/***/ "../../vendor/sunnysideup/set-focus-point-from-anywhere/client/src/js/sunny-side-up-focus-point-setter.js":
/*!****************************************************************************************************************!*\
  !*** ../../vendor/sunnysideup/set-focus-point-from-anywhere/client/src/js/sunny-side-up-focus-point-setter.js ***!
  \****************************************************************************************************************/
/***/ (function() {

//
// Initialise any existing OR newly added wrappers
//
function initFocusWrapper(wrapper) {
  if (wrapper.dataset.ssuFocusInit === '1') return;
  wrapper.dataset.ssuFocusInit = '1';
  var img = wrapper.querySelector('img');
  var point = wrapper.querySelector('.ssu-focus-marker');
  if (!img || !point) return;
  wrapper.style.position = 'relative';
  wrapper.style.cursor = 'crosshair';

  //
  // Place marker visually using relX/relY (0..1)
  //
  function updateMarkerFromRel(relX, relY) {
    point.style.left = relX * 100 + '%';
    point.style.top = relY * 100 + '%';
  }
  wrapper._updateMarkerFromRel = updateMarkerFromRel;

  //
  // INITIAL POSITION from Silverstripe focus values (-1..1)
  //
  var focusX = parseFloat(wrapper.dataset.currentX || 0);
  var focusY = parseFloat(wrapper.dataset.currentY || 0);

  // Convert SS focus → rel coords (0..1)
  var relX = (focusX + 1) / 2;
  var relY = (focusY + 1) / 2;
  updateMarkerFromRel(relX, relY);
}

// Init current items
document.querySelectorAll('.sunny-side-up-set-focus-point').forEach(initFocusWrapper);

//
// Delegated click handler — works for AJAX inserts
//
document.addEventListener('click', function (e) {
  var wrapper = e.target.closest('.sunny-side-up-set-focus-point');
  if (!wrapper) return;
  initFocusWrapper(wrapper);
  var img = wrapper.querySelector('img');
  if (!img) return;
  var rect = img.getBoundingClientRect();

  // Click → REL coords (0..1)
  var relX = (e.clientX - rect.left) / rect.width;
  var relY = (e.clientY - rect.top) / rect.height;

  // Update marker visually immediately
  wrapper._updateMarkerFromRel(relX, relY);

  //
  // Convert REL → Silverstripe focus values (-1..1)
  // (Silverstripe: top = -1, bottom = +1)
  //
  var focusX = relX * 2 - 1;
  var focusY = relY * 2 - 1; // ← CORRECT FINAL FORM

  // Build GET request
  var url = new URL(wrapper.dataset.updateUrl);
  url.searchParams.set('x', focusX);
  url.searchParams.set('y', focusY);
  fetch(url.toString(), {
    method: 'GET'
  }).then(function (res) {
    return res.text();
  }).then(function (text) {
    if (text.trim() === 'OK') {
      wrapper.dataset.currentX = focusX;
      wrapper.dataset.currentY = focusY;
    } else {
      console.warn('Focus update failed:', text);
    }
  }).catch(function (err) {
    return console.error(err);
  });
});

//
// Auto-detect AJAX-added wrappers
//
var obs = new MutationObserver(function (mutations) {
  mutations.forEach(function (m) {
    m.addedNodes.forEach(function (node) {
      var _node$classList, _node$querySelectorAl;
      if (!(node instanceof HTMLElement)) return;
      if ((_node$classList = node.classList) !== null && _node$classList !== void 0 && _node$classList.contains('sunny-side-up-set-focus-point')) {
        initFocusWrapper(node);
      }
      (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 || _node$querySelectorAl.call(node, '.sunny-side-up-set-focus-point').forEach(initFocusWrapper);
    });
  });
});
obs.observe(document.body, {
  childList: true,
  subtree: true
});

/***/ }),

/***/ "../../vendor/sunnysideup/set-focus-point-from-anywhere/client/src/main.js":
/*!*********************************************************************************!*\
  !*** ../../vendor/sunnysideup/set-focus-point-from-anywhere/client/src/main.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_sunny_side_up_focus_point_setter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/sunny-side-up-focus-point-setter */ "../../vendor/sunnysideup/set-focus-point-from-anywhere/client/src/js/sunny-side-up-focus-point-setter.js");
/* harmony import */ var _js_sunny_side_up_focus_point_setter__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_js_sunny_side_up_focus_point_setter__WEBPACK_IMPORTED_MODULE_0__);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__("../../vendor/sunnysideup/set-focus-point-from-anywhere/client/src/main.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0EsU0FBU0EsZ0JBQWdCQSxDQUFFQyxPQUFPLEVBQUU7RUFDbEMsSUFBSUEsT0FBTyxDQUFDQyxPQUFPLENBQUNDLFlBQVksS0FBSyxHQUFHLEVBQUU7RUFDMUNGLE9BQU8sQ0FBQ0MsT0FBTyxDQUFDQyxZQUFZLEdBQUcsR0FBRztFQUVsQyxJQUFNQyxHQUFHLEdBQUdILE9BQU8sQ0FBQ0ksYUFBYSxDQUFDLEtBQUssQ0FBQztFQUN4QyxJQUFNQyxLQUFLLEdBQUdMLE9BQU8sQ0FBQ0ksYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBQ3hELElBQUksQ0FBQ0QsR0FBRyxJQUFJLENBQUNFLEtBQUssRUFBRTtFQUVwQkwsT0FBTyxDQUFDTSxLQUFLLENBQUNDLFFBQVEsR0FBRyxVQUFVO0VBQ25DUCxPQUFPLENBQUNNLEtBQUssQ0FBQ0UsTUFBTSxHQUFHLFdBQVc7O0VBRWxDO0VBQ0E7RUFDQTtFQUNBLFNBQVNDLG1CQUFtQkEsQ0FBRUMsSUFBSSxFQUFFQyxJQUFJLEVBQUU7SUFDeENOLEtBQUssQ0FBQ0MsS0FBSyxDQUFDTSxJQUFJLEdBQUdGLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRztJQUNuQ0wsS0FBSyxDQUFDQyxLQUFLLENBQUNPLEdBQUcsR0FBR0YsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHO0VBQ3BDO0VBRUFYLE9BQU8sQ0FBQ2Msb0JBQW9CLEdBQUdMLG1CQUFtQjs7RUFFbEQ7RUFDQTtFQUNBO0VBQ0EsSUFBTU0sTUFBTSxHQUFHQyxVQUFVLENBQUNoQixPQUFPLENBQUNDLE9BQU8sQ0FBQ2dCLFFBQVEsSUFBSSxDQUFDLENBQUM7RUFDeEQsSUFBTUMsTUFBTSxHQUFHRixVQUFVLENBQUNoQixPQUFPLENBQUNDLE9BQU8sQ0FBQ2tCLFFBQVEsSUFBSSxDQUFDLENBQUM7O0VBRXhEO0VBQ0EsSUFBTVQsSUFBSSxHQUFHLENBQUNLLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQztFQUM3QixJQUFNSixJQUFJLEdBQUcsQ0FBQ08sTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDO0VBRTdCVCxtQkFBbUIsQ0FBQ0MsSUFBSSxFQUFFQyxJQUFJLENBQUM7QUFDakM7O0FBRUE7QUFDQVMsUUFBUSxDQUNMQyxnQkFBZ0IsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUNsREMsT0FBTyxDQUFDdkIsZ0JBQWdCLENBQUM7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBcUIsUUFBUSxDQUFDRyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQUMsQ0FBQyxFQUFJO0VBQ3RDLElBQU14QixPQUFPLEdBQUd3QixDQUFDLENBQUNDLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDLGdDQUFnQyxDQUFDO0VBQ2xFLElBQUksQ0FBQzFCLE9BQU8sRUFBRTtFQUVkRCxnQkFBZ0IsQ0FBQ0MsT0FBTyxDQUFDO0VBRXpCLElBQU1HLEdBQUcsR0FBR0gsT0FBTyxDQUFDSSxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQ3hDLElBQUksQ0FBQ0QsR0FBRyxFQUFFO0VBRVYsSUFBTXdCLElBQUksR0FBR3hCLEdBQUcsQ0FBQ3lCLHFCQUFxQixDQUFDLENBQUM7O0VBRXhDO0VBQ0EsSUFBTWxCLElBQUksR0FBRyxDQUFDYyxDQUFDLENBQUNLLE9BQU8sR0FBR0YsSUFBSSxDQUFDZixJQUFJLElBQUllLElBQUksQ0FBQ0csS0FBSztFQUNqRCxJQUFNbkIsSUFBSSxHQUFHLENBQUNhLENBQUMsQ0FBQ08sT0FBTyxHQUFHSixJQUFJLENBQUNkLEdBQUcsSUFBSWMsSUFBSSxDQUFDSyxNQUFNOztFQUVqRDtFQUNBaEMsT0FBTyxDQUFDYyxvQkFBb0IsQ0FBQ0osSUFBSSxFQUFFQyxJQUFJLENBQUM7O0VBRXhDO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsSUFBTUksTUFBTSxHQUFHTCxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDM0IsSUFBTVEsTUFBTSxHQUFHUCxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBQzs7RUFFNUI7RUFDQSxJQUFNc0IsR0FBRyxHQUFHLElBQUlDLEdBQUcsQ0FBQ2xDLE9BQU8sQ0FBQ0MsT0FBTyxDQUFDa0MsU0FBUyxDQUFDO0VBQzlDRixHQUFHLENBQUNHLFlBQVksQ0FBQ0MsR0FBRyxDQUFDLEdBQUcsRUFBRXRCLE1BQU0sQ0FBQztFQUNqQ2tCLEdBQUcsQ0FBQ0csWUFBWSxDQUFDQyxHQUFHLENBQUMsR0FBRyxFQUFFbkIsTUFBTSxDQUFDO0VBRWpDb0IsS0FBSyxDQUFDTCxHQUFHLENBQUNNLFFBQVEsQ0FBQyxDQUFDLEVBQUU7SUFBRUMsTUFBTSxFQUFFO0VBQU0sQ0FBQyxDQUFDLENBQ3JDQyxJQUFJLENBQUMsVUFBQUMsR0FBRztJQUFBLE9BQUlBLEdBQUcsQ0FBQ0MsSUFBSSxDQUFDLENBQUM7RUFBQSxFQUFDLENBQ3ZCRixJQUFJLENBQUMsVUFBQUUsSUFBSSxFQUFJO0lBQ1osSUFBSUEsSUFBSSxDQUFDQyxJQUFJLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtNQUN4QjVDLE9BQU8sQ0FBQ0MsT0FBTyxDQUFDZ0IsUUFBUSxHQUFHRixNQUFNO01BQ2pDZixPQUFPLENBQUNDLE9BQU8sQ0FBQ2tCLFFBQVEsR0FBR0QsTUFBTTtJQUNuQyxDQUFDLE1BQU07TUFDTDJCLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDLHNCQUFzQixFQUFFSCxJQUFJLENBQUM7SUFDNUM7RUFDRixDQUFDLENBQUMsQ0FDREksS0FBSyxDQUFDLFVBQUFDLEdBQUc7SUFBQSxPQUFJSCxPQUFPLENBQUNJLEtBQUssQ0FBQ0QsR0FBRyxDQUFDO0VBQUEsRUFBQztBQUNyQyxDQUFDLENBQUM7O0FBRUY7QUFDQTtBQUNBO0FBQ0EsSUFBTUUsR0FBRyxHQUFHLElBQUlDLGdCQUFnQixDQUFDLFVBQUFDLFNBQVMsRUFBSTtFQUM1Q0EsU0FBUyxDQUFDOUIsT0FBTyxDQUFDLFVBQUErQixDQUFDLEVBQUk7SUFDckJBLENBQUMsQ0FBQ0MsVUFBVSxDQUFDaEMsT0FBTyxDQUFDLFVBQUFpQyxJQUFJLEVBQUk7TUFBQSxJQUFBQyxlQUFBLEVBQUFDLHFCQUFBO01BQzNCLElBQUksRUFBRUYsSUFBSSxZQUFZRyxXQUFXLENBQUMsRUFBRTtNQUVwQyxLQUFBRixlQUFBLEdBQUlELElBQUksQ0FBQ0ksU0FBUyxjQUFBSCxlQUFBLGVBQWRBLGVBQUEsQ0FBZ0JJLFFBQVEsQ0FBQywrQkFBK0IsQ0FBQyxFQUFFO1FBQzdEN0QsZ0JBQWdCLENBQUN3RCxJQUFJLENBQUM7TUFDeEI7TUFFQSxDQUFBRSxxQkFBQSxHQUFBRixJQUFJLENBQ0RsQyxnQkFBZ0IsY0FBQW9DLHFCQUFBLGVBRG5CQSxxQkFBQSxDQUFBSSxJQUFBLENBQUFOLElBQUksRUFDa0IsZ0NBQWdDLENBQUMsQ0FDcERqQyxPQUFPLENBQUN2QixnQkFBZ0IsQ0FBQztJQUM5QixDQUFDLENBQUM7RUFDSixDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRm1ELEdBQUcsQ0FBQ1ksT0FBTyxDQUFDMUMsUUFBUSxDQUFDMkMsSUFBSSxFQUFFO0VBQUVDLFNBQVMsRUFBRSxJQUFJO0VBQUVDLE9BQU8sRUFBRTtBQUFLLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcHVibGljLy4uLy4uL3ZlbmRvci9zdW5ueXNpZGV1cC9zZXQtZm9jdXMtcG9pbnQtZnJvbS1hbnl3aGVyZS9jbGllbnQvc3JjL2pzL3N1bm55LXNpZGUtdXAtZm9jdXMtcG9pbnQtc2V0dGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vXG4vLyBJbml0aWFsaXNlIGFueSBleGlzdGluZyBPUiBuZXdseSBhZGRlZCB3cmFwcGVyc1xuLy9cbmZ1bmN0aW9uIGluaXRGb2N1c1dyYXBwZXIgKHdyYXBwZXIpIHtcbiAgaWYgKHdyYXBwZXIuZGF0YXNldC5zc3VGb2N1c0luaXQgPT09ICcxJykgcmV0dXJuXG4gIHdyYXBwZXIuZGF0YXNldC5zc3VGb2N1c0luaXQgPSAnMSdcblxuICBjb25zdCBpbWcgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpXG4gIGNvbnN0IHBvaW50ID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuc3N1LWZvY3VzLW1hcmtlcicpXG4gIGlmICghaW1nIHx8ICFwb2ludCkgcmV0dXJuXG5cbiAgd3JhcHBlci5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgd3JhcHBlci5zdHlsZS5jdXJzb3IgPSAnY3Jvc3NoYWlyJ1xuXG4gIC8vXG4gIC8vIFBsYWNlIG1hcmtlciB2aXN1YWxseSB1c2luZyByZWxYL3JlbFkgKDAuLjEpXG4gIC8vXG4gIGZ1bmN0aW9uIHVwZGF0ZU1hcmtlckZyb21SZWwgKHJlbFgsIHJlbFkpIHtcbiAgICBwb2ludC5zdHlsZS5sZWZ0ID0gcmVsWCAqIDEwMCArICclJ1xuICAgIHBvaW50LnN0eWxlLnRvcCA9IHJlbFkgKiAxMDAgKyAnJSdcbiAgfVxuXG4gIHdyYXBwZXIuX3VwZGF0ZU1hcmtlckZyb21SZWwgPSB1cGRhdGVNYXJrZXJGcm9tUmVsXG5cbiAgLy9cbiAgLy8gSU5JVElBTCBQT1NJVElPTiBmcm9tIFNpbHZlcnN0cmlwZSBmb2N1cyB2YWx1ZXMgKC0xLi4xKVxuICAvL1xuICBjb25zdCBmb2N1c1ggPSBwYXJzZUZsb2F0KHdyYXBwZXIuZGF0YXNldC5jdXJyZW50WCB8fCAwKVxuICBjb25zdCBmb2N1c1kgPSBwYXJzZUZsb2F0KHdyYXBwZXIuZGF0YXNldC5jdXJyZW50WSB8fCAwKVxuXG4gIC8vIENvbnZlcnQgU1MgZm9jdXMg4oaSIHJlbCBjb29yZHMgKDAuLjEpXG4gIGNvbnN0IHJlbFggPSAoZm9jdXNYICsgMSkgLyAyXG4gIGNvbnN0IHJlbFkgPSAoZm9jdXNZICsgMSkgLyAyXG5cbiAgdXBkYXRlTWFya2VyRnJvbVJlbChyZWxYLCByZWxZKVxufVxuXG4vLyBJbml0IGN1cnJlbnQgaXRlbXNcbmRvY3VtZW50XG4gIC5xdWVyeVNlbGVjdG9yQWxsKCcuc3Vubnktc2lkZS11cC1zZXQtZm9jdXMtcG9pbnQnKVxuICAuZm9yRWFjaChpbml0Rm9jdXNXcmFwcGVyKVxuXG4vL1xuLy8gRGVsZWdhdGVkIGNsaWNrIGhhbmRsZXIg4oCUIHdvcmtzIGZvciBBSkFYIGluc2VydHNcbi8vXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICBjb25zdCB3cmFwcGVyID0gZS50YXJnZXQuY2xvc2VzdCgnLnN1bm55LXNpZGUtdXAtc2V0LWZvY3VzLXBvaW50JylcbiAgaWYgKCF3cmFwcGVyKSByZXR1cm5cblxuICBpbml0Rm9jdXNXcmFwcGVyKHdyYXBwZXIpXG5cbiAgY29uc3QgaW1nID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbWcnKVxuICBpZiAoIWltZykgcmV0dXJuXG5cbiAgY29uc3QgcmVjdCA9IGltZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gIC8vIENsaWNrIOKGkiBSRUwgY29vcmRzICgwLi4xKVxuICBjb25zdCByZWxYID0gKGUuY2xpZW50WCAtIHJlY3QubGVmdCkgLyByZWN0LndpZHRoXG4gIGNvbnN0IHJlbFkgPSAoZS5jbGllbnRZIC0gcmVjdC50b3ApIC8gcmVjdC5oZWlnaHRcblxuICAvLyBVcGRhdGUgbWFya2VyIHZpc3VhbGx5IGltbWVkaWF0ZWx5XG4gIHdyYXBwZXIuX3VwZGF0ZU1hcmtlckZyb21SZWwocmVsWCwgcmVsWSlcblxuICAvL1xuICAvLyBDb252ZXJ0IFJFTCDihpIgU2lsdmVyc3RyaXBlIGZvY3VzIHZhbHVlcyAoLTEuLjEpXG4gIC8vIChTaWx2ZXJzdHJpcGU6IHRvcCA9IC0xLCBib3R0b20gPSArMSlcbiAgLy9cbiAgY29uc3QgZm9jdXNYID0gcmVsWCAqIDIgLSAxXG4gIGNvbnN0IGZvY3VzWSA9IHJlbFkgKiAyIC0gMSAvLyDihpAgQ09SUkVDVCBGSU5BTCBGT1JNXG5cbiAgLy8gQnVpbGQgR0VUIHJlcXVlc3RcbiAgY29uc3QgdXJsID0gbmV3IFVSTCh3cmFwcGVyLmRhdGFzZXQudXBkYXRlVXJsKVxuICB1cmwuc2VhcmNoUGFyYW1zLnNldCgneCcsIGZvY3VzWClcbiAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoJ3knLCBmb2N1c1kpXG5cbiAgZmV0Y2godXJsLnRvU3RyaW5nKCksIHsgbWV0aG9kOiAnR0VUJyB9KVxuICAgIC50aGVuKHJlcyA9PiByZXMudGV4dCgpKVxuICAgIC50aGVuKHRleHQgPT4ge1xuICAgICAgaWYgKHRleHQudHJpbSgpID09PSAnT0snKSB7XG4gICAgICAgIHdyYXBwZXIuZGF0YXNldC5jdXJyZW50WCA9IGZvY3VzWFxuICAgICAgICB3cmFwcGVyLmRhdGFzZXQuY3VycmVudFkgPSBmb2N1c1lcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybignRm9jdXMgdXBkYXRlIGZhaWxlZDonLCB0ZXh0KVxuICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVycikpXG59KVxuXG4vL1xuLy8gQXV0by1kZXRlY3QgQUpBWC1hZGRlZCB3cmFwcGVyc1xuLy9cbmNvbnN0IG9icyA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG11dGF0aW9ucyA9PiB7XG4gIG11dGF0aW9ucy5mb3JFYWNoKG0gPT4ge1xuICAgIG0uYWRkZWROb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgaWYgKCEobm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkgcmV0dXJuXG5cbiAgICAgIGlmIChub2RlLmNsYXNzTGlzdD8uY29udGFpbnMoJ3N1bm55LXNpZGUtdXAtc2V0LWZvY3VzLXBvaW50JykpIHtcbiAgICAgICAgaW5pdEZvY3VzV3JhcHBlcihub2RlKVxuICAgICAgfVxuXG4gICAgICBub2RlXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsPy4oJy5zdW5ueS1zaWRlLXVwLXNldC1mb2N1cy1wb2ludCcpXG4gICAgICAgIC5mb3JFYWNoKGluaXRGb2N1c1dyYXBwZXIpXG4gICAgfSlcbiAgfSlcbn0pXG5cbm9icy5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pXG4iXSwibmFtZXMiOlsiaW5pdEZvY3VzV3JhcHBlciIsIndyYXBwZXIiLCJkYXRhc2V0Iiwic3N1Rm9jdXNJbml0IiwiaW1nIiwicXVlcnlTZWxlY3RvciIsInBvaW50Iiwic3R5bGUiLCJwb3NpdGlvbiIsImN1cnNvciIsInVwZGF0ZU1hcmtlckZyb21SZWwiLCJyZWxYIiwicmVsWSIsImxlZnQiLCJ0b3AiLCJfdXBkYXRlTWFya2VyRnJvbVJlbCIsImZvY3VzWCIsInBhcnNlRmxvYXQiLCJjdXJyZW50WCIsImZvY3VzWSIsImN1cnJlbnRZIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwidGFyZ2V0IiwiY2xvc2VzdCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwid2lkdGgiLCJjbGllbnRZIiwiaGVpZ2h0IiwidXJsIiwiVVJMIiwidXBkYXRlVXJsIiwic2VhcmNoUGFyYW1zIiwic2V0IiwiZmV0Y2giLCJ0b1N0cmluZyIsIm1ldGhvZCIsInRoZW4iLCJyZXMiLCJ0ZXh0IiwidHJpbSIsImNvbnNvbGUiLCJ3YXJuIiwiY2F0Y2giLCJlcnIiLCJlcnJvciIsIm9icyIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJtIiwiYWRkZWROb2RlcyIsIm5vZGUiLCJfbm9kZSRjbGFzc0xpc3QiLCJfbm9kZSRxdWVyeVNlbGVjdG9yQWwiLCJIVE1MRWxlbWVudCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiY2FsbCIsIm9ic2VydmUiLCJib2R5IiwiY2hpbGRMaXN0Iiwic3VidHJlZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9