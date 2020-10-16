const { getTaxoBeanList } = require("../WEB-FE/content/js/ibv_forms");
test("getTaxoBeanList success", () => {
  expect.assertions(2);
  console.log("test case getTaxoBeanList success");
  const ajax = (obj) => {
    let { success } = obj;
    window.$ = require("jQuery");
    success({
      taxoBeanList: "this is a taxoBeanList",
    });
  };
  window.$ = {
    isFunction: jest.fn(),
  };
  window.$.ajax = ajax;
  const cb = jest.fn();
  let allTaxoData = {};
  getTaxoBeanList(allTaxoData, cb);
  expect(allTaxoData).toEqual({ taxoBeanList: "this is a taxoBeanList" });
  expect(cb).toBeCalled();
  console.log(allTaxoData);
});

test("getTaxoBeanList error", () => {
  console.log("test case getTaxoBeanList success");
  const ajax = (obj) => {
    let { error } = obj;
    window.$ = require("jQuery");
    error({
      err: { mas: "err" },
    });
  };
  window.$ = {
    isFunction: jest.fn(),
  };
  window.$.ajax = ajax;
  const cb = jest.fn();
  let allTaxoData = {};
  let oDiv = document.createElement("div");
  let cardStatusOBJ = document.body.appendChild(oDiv);
  cardStatusOBJ.id = "cardStatus";
  getTaxoBeanList(allTaxoData, cb);

  expect($("#cardStatus").text()).toEqual(
    "(This service is currently unavailable, please contact ibv@us.ibm.com if the problem persists.)"
  );
});
