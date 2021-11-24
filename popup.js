/**
 * This function gets injected into the linkedin webpage
 * It needs to contain all the function it needs inside it as the context will be lost
 * see also: https://developer.chrome.com/docs/extensions/reference/scripting/#runtime-functions
 */
const injectedFunc = async () => {
  const wait = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const buttons = document.querySelectorAll("[aria-label^='Invite']");
  const total = buttons.length;

  let count = 0;
  for (const button of buttons) {
    button.click();
    await wait(getRandom(2000, 3000));

    let send = document.querySelector("[aria-label^='Send']");
    if (send) send.click();

    count++;
    chrome.runtime.sendMessage({ count, total });
    await wait(getRandom(2000, 3000));
  }
};

const progressbar = document.querySelector(".progress");
const sendrequest = document.querySelector("#send-request");
const requeststatus = document.querySelector("#request-status");

chrome.runtime.onMessage.addListener((response) => {
  const progressPerc = (response.count / response.total) * 100;
  const isDone = response.total === response.count;

  sendrequest.disabled = !isDone;
  requeststatus.innerText = response.count;
  progressbar.style.width = `${progressPerc}%`;
});

const startSendRequests = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab[0].id },
      func: injectedFunc,
    });
  });
};

sendrequest.addEventListener("click", startSendRequests);
