function isValidCat(cat, rout) {
  let catagorys = new Array();
  if (rout === "catagory") {
    catagorys = ["review", "best_deals", "latest_tech"];
  }
  else if (rout === "tutorials") {
    catagorys = ["basic_guide", "pc_building_guide"];
  }
  for (i = 0; i < catagorys.length; i++) {
    if (catagorys[i] === cat) {
      return true;
    }
  }
  return false;
}
exports.isValidCat = isValidCat;
