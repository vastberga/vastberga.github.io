document.addEventListener('DOMContentLoaded', function (event) {
  const addTabButton = document.getElementById('add-tab')
  const tabList = document.getElementById('tab-list')
  const iframeContainer = document.getElementById('iframe-container')
  const rightSideNav = document.getElementById('right-side-nav')
  const toggleNavButton = document.getElementById('toggle-nav')
  const searchBar = document.getElementById("searchbar");
  var tabModal = document.getElementById("tab-modal");
  var tabButton = document.getElementById("open-tabs");
  var tabModalCloseButton = document.getElementById("close-tabs");

  tabButton.onclick = function() {
    tabModal.style.display = "block";
  };

  tabModalCloseButton.onclick = function() {
   tabModal.style.display = "none"; 
  }

  let tabCounter = 1
  let navOpen = true

  addTabButton.addEventListener('click', () => {
    const newTab = document.createElement('div')
    const tabTitle = document.createElement('h2')
    const newIframe = document.createElement('iframe')

    tabTitle.textContent = `New Tab`
    tabTitle.className = 'tab-title'
    newTab.dataset.tabId = tabCounter
    newTab.addEventListener('click', switchTab)
    newTab.classList.add("card")

    const closeButton = document.createElement('button')
    closeButton.classList.add('close-tab')
    closeButton.innerHTML = '&#10005;'

    closeButton.addEventListener('click', (event) => {
      event.stopPropagation()

      const tabToRemove = tabList.querySelector(`[data-tab-id='${newTab.dataset.tabId}']`)
      const iframeToRemove = iframeContainer.querySelector(`[data-tab-id='${newTab.dataset.tabId}']`)

      if (tabToRemove && iframeToRemove) {
        const removedTabId = parseInt(tabToRemove.dataset.tabId)
        tabToRemove.remove()
        iframeToRemove.remove()

        const remainingTabs = Array.from(tabList.querySelectorAll('div'))
        if (remainingTabs.length > 0) {
          let indexToActivate = remainingTabs.findIndex((tab) => parseInt(tab.dataset.tabId) > removedTabId)
          if (indexToActivate === -1) {
            indexToActivate = remainingTabs.length - 1
          }
          const nextTabToActivate = remainingTabs[indexToActivate]
          const nextIframeToActivate = iframeContainer.querySelector(
            `[data-tab-id='${nextTabToActivate.dataset.tabId}']`
          )

          if (nextTabToActivate && nextIframeToActivate) {
            nextTabToActivate.classList.add('active')
            nextIframeToActivate.classList.add('active')
          }
        }
      }
    })

    newTab.appendChild(tabTitle)
    newTab.appendChild(closeButton)
    tabList.appendChild(newTab)

    const allTabs = Array.from(tabList.querySelectorAll('li'))
    allTabs.forEach((tab) => tab.classList.remove('active'))
    const allIframes = Array.from(iframeContainer.querySelectorAll('iframe'))
    allIframes.forEach((iframe) => iframe.classList.remove('active'))

    newTab.classList.add('active')

    newIframe.src = '/newtab.html'
    newIframe.dataset.tabId = tabCounter
    newIframe.classList.add('active')
    iframeContainer.appendChild(newIframe)

    // svery epic
    newIframe.addEventListener('load', () => {
      const title = newIframe.contentDocument.title
      tabTitle.textContent = title
    })

    tabCounter++
    document.getElementById("intro-text").style.display = "none";
  })

  window.addEventListener('message', function (event) {
    console.log('Received message:', event.data)
    if (event.data && event.data.url) {
      const iframes = Array.from(iframeContainer.querySelectorAll('iframe'))
      const activeIframe = iframes.find((iframe) => iframe.classList.contains('active'))

      if (activeIframe) {
        console.log('Visible iframe:', activeIframe)
        const tabToUpdate = tabList.querySelector(`[data-tab-id='${activeIframe.dataset.tabId}']`)
        if (tabToUpdate) {
          console.log('Tab to update:', tabToUpdate)
          const tabTitle = tabToUpdate.querySelector('.tab-title')
          if (tabTitle) {
            console.log('Tab title:', tabTitle)
            tabTitle.textContent = event.data.url
            console.log('Hostname:', event.data.url)
          } else {
            console.log('No tab title element found.')
          }
        } else {
          console.log('No tab to update found.')
        }
      } else {
        console.log('No visible iframe found.')
      }
    } else {
      console.log('No URL data in the message.')
    }
  })

  function switchTab(event) {
    const tabId = event.target.closest('div').dataset.tabId

    const allTabs = Array.from(tabList.querySelectorAll('div'))
    allTabs.forEach((tab) => tab.classList.remove('active'))
    const allIframes = Array.from(iframeContainer.querySelectorAll('iframe'))
    allIframes.forEach((iframe) => iframe.classList.remove('active'))

    const selectedTab = tabList.querySelector(`[data-tab-id='${tabId}']`)
    if (selectedTab) {
      selectedTab.classList.add('active')
    } else {
      console.log('No selected tab found with ID:', tabId)
    }

    const selectedIframe = iframeContainer.querySelector(`[data-tab-id='${tabId}']`)
    if (selectedIframe) {
      selectedIframe.classList.add('active')
      searchBar.value = ""
      tabModal.style.display = "none"; 
    } else {
      console.log('No selected iframe found with ID:', tabId)
    }
  }
})

function erudaToggle() {
  const iframeContainer = document.getElementById('iframe-container')
  const iframes = Array.from(iframeContainer.querySelectorAll('iframe'))
  const activeIframe = iframes.find((iframe) => iframe.classList.contains('active'))

  const proccyWindow = activeIframe.contentWindow
  const proccyDocument = activeIframe.contentDocument

  if (!proccyWindow || !proccyDocument) return

  if (proccyWindow.eruda?._isInit) {
    proccyWindow.eruda.destroy()
  } else {
    let script = proccyDocument.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/eruda'
    script.onload = function () {
      if (!proccyWindow) return
      proccyWindow.eruda.init()
      proccyWindow.eruda.show()
    }
    proccyWindow.document?.head?.appendChild(script) || proccyDocument.head.appendChild(script)
  }
}