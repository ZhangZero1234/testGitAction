const {
  getSelectIDs,
  markSelectedTaxos,
} = require("../WEB-FE/content/js/ibv_forms");

window.$ = require("jQuery");

test("getSelectIDs", () => {
  console.log("test case getSelectIDs");
  const html = `
    <form id="taxoExploreSelectForm" class="ibm-row-form" method="post" action="javascript:;" style="height: unset;">
      <button id="showHideFilterButton2" class="ibm-btn-sec ibm-btn-white ibv-explore-buttons ibm-collapse-link">Hide filters</button>
      <div id="taxoExploreFilterSection" style="display: block; height: unset; overflow: unset;">
        <div id="selectFilters2">
          <select class="taxoSelect select2-hidden-accessible" id="taxoId-6" multiple="" data-placeholder="< select >" style="width: 276.641px;" tabindex="-1" aria-hidden="true">
          <option value="6000" selected="">Global</option>
          <option value="6045">United States</option>
          <option value="6067">Western Europe</option>
          </select>
          <select class="taxoSelect select2-hidden-accessible" id="taxoId-5" multiple="" data-placeholder="< select >" style="width: 276.641px;" tabindex="-1" aria-hidden="true">
          <option value="5001">Chinese</option>
          <option value="5004" selected="">English</option>
          <option value="5018">Thai</option>
          </select>
        </div>
      </div>
    </form>
    `;
  document.body.innerHTML = html;
  const ids = getSelectIDs("form#taxoExploreSelectForm select.taxoSelect");
  expect(ids).toEqual(["6000", "5004"]);
});

test("markSelectedTaxos", () => {
  let taxoBeanList = require("../data/data_for_markselectedaxos.json");
  let selectedTaxos = { 5004: "selected", 6000: "selected", 8001: "selected" };
  markSelectedTaxos(taxoBeanList, selectedTaxos);
  const expectedData =
    '[{"taxoId":5,"label":"Language","subTaxoBeans":[{"taxoId":5004,"label":"English","subTaxoBeans":[],"parentId":5,"approval":false,"isActive":1,"orderNum":4,"selected":true},{"taxoId":5017,"label":"Spanish (LA)","subTaxoBeans":[],"parentId":5,"approval":false,"isActive":1,"orderNum":17}],"parentId":0,"approval":false,"isActive":1,"orderNum":6},{"taxoId":6,"label":"Region/Country","subTaxoBeans":[{"taxoId":6000,"label":"Global","subTaxoBeans":[],"parentId":6,"approval":false,"isActive":1,"orderNum":0,"selected":true},{"taxoId":6067,"label":"Western Europe","subTaxoBeans":[],"parentId":6,"approval":false,"isActive":1,"orderNum":67}],"parentId":0,"approval":false,"isActive":1,"orderNum":7},{"taxoId":8,"label":"Technology","subTaxoBeans":[{"taxoId":8000,"label":"None specified","subTaxoBeans":[],"parentId":8,"approval":false,"isActive":1,"orderNum":1},{"taxoId":8001,"label":"Artificial Intelligence","subTaxoBeans":[],"parentId":8,"approval":false,"isActive":1,"orderNum":2,"selected":true}],"parentId":0,"approval":false,"isActive":1,"orderNum":9}]';
  expect(taxoBeanList).toEqual(JSON.parse(expectedData));
});
