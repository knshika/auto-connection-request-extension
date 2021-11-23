//https://www.linkedin.com/search/results/people/?keywords=sde%20amazon&origin=SWITCH_SEARCH_VERTICAL&sid=*6-

//conent-script
const clickConnectBtns = async () => {
  let buttons = document.querySelectorAll("[aria-label^='Invite']");
  let count = 0;
  const wait = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  function getRandomTime(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  for (const button of buttons) {
    button.click();

    await wait(getRandomTime(2000, 3000));

    let send = document.querySelector("[aria-label^='Send']");
    if (send) {
      send.click();
      chrome.runtime.sendMessage(++count);
    }
    await wait(getRandomTime(2000, 3000));
  }
};

//background-script
const injectTheScript = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab[0].id },
      func: clickConnectBtns,
    });
    chrome.runtime.onMessage.addListener(function (response) {
      document.querySelector("#request-status").innerText = response;
    });
  });
};

document
  .querySelector("#send-request")
  .addEventListener("click", injectTheScript);
