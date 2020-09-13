const devices = document.querySelector('.devices'),
  inputDevices = document.querySelectorAll('.device input'),
  refreshPageCheckbox = document.querySelector('.refresh-page-check')

chrome.storage.sync.get(['refreshPage'], result => {
  refreshPageCheckbox.checked = result.refreshPage
})

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.tabs.sendMessage(tabs[0].id,
    {
      eventName: 'get current device',
      cookieName: 'UI'
    },
    response => {
      if (response.currentDevice !== 'no device') {
        const currentDevice = response.currentDevice
        inputDevices.forEach(deviceInput => {
          if (deviceInput.value === currentDevice) {
            deviceInput.nextElementSibling.classList.add('active')
            setEvents()
          }
        })
        return
      }
      noDeviceDetected()
    })
})

function setEvents() {
  refreshPageCheckbox.addEventListener('change', e => {
    chrome.storage.sync.set({ refreshPage: e.currentTarget.checked })
  })

  devices.addEventListener('click', e => {
    const input = e.target.closest('input')
    if (input) {
      removeActiveDevice()
      cookieSwitcher(input.value)
    }
  })
}

function noDeviceDetected() {
  devices.innerHTML = `<span>No device detected</span>`
  document.querySelector('.actions-box').classList.add('hidden')
}

function removeActiveDevice() {
  inputDevices.forEach(deviceInput => {
    deviceInput.nextElementSibling.classList.remove('active')
  })
}

function cookieSwitcher(device) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id,
      {
        eventName: 'change device cookie',
        cookieName: 'UI',
        deviceToSet: device
      },
      response => {
        const refreshPage = refreshPageCheckbox.checked
        if (response.deviceSetted && refreshPage) {
          chrome.tabs.reload(tabs[0].id, { 'bypassCache': true })
        }
      })
  })
}