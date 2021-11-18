//https://www.linkedin.com/search/results/people/?keywords=sde%20amazon&origin=SWITCH_SEARCH_VERTICAL&sid=*6-

const clickConnectBtns = async () => {
  let buttons = document.querySelectorAll("[aria-label^='Invite']");

  const wait = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  for (const button of buttons) {
    button.click();
    console.log("clicked");

    await wait(2000);

    let send = document.querySelector("[aria-label^='Send']");
    if (send) send.click();
    console.log("send");

    await wait(4000);
  }
};

const injectTheScript = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    console.log(tab);
    chrome.scripting.executeScript({
      target: { tabId: tab[0].id },
      func: clickConnectBtns,
    });
  });
};

document
  .querySelector("#send-request")
  .addEventListener("click", injectTheScript);
