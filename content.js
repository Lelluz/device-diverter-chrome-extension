const replaceString = (oldS, newS, fullS) => fullS.split(oldS).join(newS),
  getCookie = name => {
    var v = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`)
    return v ? v[2] : null
  },
  setCookie = (name, value) => document.cookie = `${name}=${value};path=/;domain=${window.location.hostname.replace('www.', '')};secure`,
  getCurrentDevice = uiCookie => uiCookie.match(/device=(.*?)&/i)[1]

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.eventName === 'get current device') {
    const uiCookie = getCookie(request.cookieName),
      currentDevice = uiCookie ? getCurrentDevice(uiCookie) : 'no device'
    sendResponse({ currentDevice: currentDevice })
  }
  if (request.eventName === 'change device cookie') {
    const uiCookie = getCookie(request.cookieName),
      currentDevice = getCurrentDevice(uiCookie)

    if (request.deviceToSet != currentDevice) {
      const newUiCookie = replaceString(currentDevice, request.deviceToSet, uiCookie)
      setCookie(request.cookieName, newUiCookie)
    }
    sendResponse({ deviceSetted: request.deviceToSet })
  }
})