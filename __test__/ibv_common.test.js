const {
  manageCardSizes,
  processTemplate,
} = require("../WEB-FE/content/js/ibv_common");
const $ = require("jQuery");
test("manageCardSizes", () => {
  console.log("test case manageCardSizes");
  const card1 = [
    {
      cardId: 2551,
      title: "How CFOs Can Mitigate the Risk of Payments Fraud",
      description:
        "As custodians of the company’s monetary assets, CFOs are responsible for safeguarding the enterprise from threats to its financial health, especially those that can result from processes within the finance domain, such as accounts payable and treasury. According to market research, payments fraud is rising. It is therefore critical that CFOs adopt effective strategies to alleviate the potential hit to the bottom line and investor confidence. ",
      imageUrl:
        "/img/card/how_cfos_can_mitigate_the_risk_of_payments_fraud.png?1599580115017",
      link1Text: "Access content on Lighthouse",
      link1Url: "https://w3.ibm.com/services/lighthouse/documents/147879",
      link2Text: "",
      link2Url: "",
      publishDateText: "11/25/2019 12:00 AM",
      currentUser: "@cn.ibm.com",
      approval: false,
      updatedDateText: "12/18/2019 07:22 PM",
      updatedBy: "@us.ibm.com",
      taskId: 5,
      nextTaskIds: [1, 2, 6],
      link1Target: "_blank",
      link2Target: "_blank",
      firstPublishDateText: "11/25/2019 12:00 AM",
      isValid: 1,
      isLive: 0,
      comments: [],
    },
  ];
  manageCardSizes(card1);

  const card2 = [
    {
      cardId: 2551,
      title: "How CFOs Can Mitigate the Risk of Payments Fraud",
      description:
        "As custodians of the company’s monetary assets, CFOs are responsible for safeguarding the enterprise from threats to its financial health, especially those that can result from processes within the finance domain, such as accounts payable and treasury. According to market research, payments fraud is rising. It is therefore critical that CFOs adopt effective strategies to alleviate the potential hit to the bottom line and investor confidence. ",
      imageUrl:
        "/img/card/how_cfos_can_mitigate_the_risk_of_payments_fraud.png?1599580115017",
      link1Text: "Access content on Lighthouse",
      link1Url: "https://w3.ibm.com/services/lighthouse/documents/147879",
      link2Text: "Access content on Lighthouse",
      link2Url: "https://w3.ibm.com/services/lighthouse/documents/147879",
      publishDateText: "11/25/2019 12:00 AM",
      currentUser: "@cn.ibm.com",
      approval: false,
      updatedDateText: "12/18/2019 07:22 PM",
      updatedBy: "@us.ibm.com",
      taskId: 5,
      nextTaskIds: [1, 2, 6],
      link1Target: "_blank",
      link2Target: "_blank",
      firstPublishDateText: "11/25/2019 12:00 AM",
      isValid: 1,
      isLive: 0,
      comments: [],
    },
  ];
  expect(card1[0].description).toEqual(
    "As custodians of the company’s monetary assets, CFOs are responsible for safeguarding the enterprise from threats to its financial health, especially those that can result from processes within the finance domain, such ..."
  );
  manageCardSizes(card2);
  expect(card2[0].description).toEqual(
    "As custodians of the company’s monetary assets, CFOs are responsible for safeguarding the enterprise from threats to its financial health, especially those that can result from ..."
  );
});

test("processTemplate append=true", () => {
  console.log("test case processTemplate=true");
  expect.assertions(2);
  let targetID = "#cardsTarget";
  let template = require("../template/cardTemplate.js");
  let data = require("../data/data_for_card.json");
  let cb = jest.fn();
  let append = true;
  let oDiv = document.createElement("div");
  oDiv.id = "cardsTarget";
  document.body.appendChild(oDiv);
  processTemplate(targetID, template, data, cb, append);

  expect($("#cardsTarget .ibm-card").length).toBe(8);
  expect(cb).toBeCalled();
});

test("processTemplate append=false", () => {
  console.log("test case processTemplate=false");
  expect.assertions(2);
  let targetID = "#cardsTarget";
  let template = require("../template/cardTemplate.js");
  let data = require("../data/data_for_card.json");
  let cb = jest.fn();
  let append = true;
  document.body.innerHTML = "";
  let oDiv = document.createElement("div");
  oDiv.id = "cardsTarget";
  document.body.appendChild(oDiv);
  processTemplate(targetID, template, data, cb, append);

  expect($("#cardsTarget .ibm-card").length).toBe(8);
  expect(cb).toBeCalled();
});
