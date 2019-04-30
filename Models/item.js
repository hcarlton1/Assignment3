class Item {
  constructor(itemCode, name, category, desc, rating, image, price) {
      this.itemCode =itemCode ;
      this.name = name;
      this.category = category;
      this.description = desc;
      this.rating = rating ;
      this.image= image;
      this.price = price;
  }

setItemCode(iCode) {
    this.itemCode = iCode;
};

getItemCode() {
    return this.itemCode;
};

setItemName(iName) {
    this.name = iName;
};

geItemName() {
    return this.name;
};
setCategory(iCat) {
    this.category = iCat;
};

getDescription() {
    return this.description;
};
setDescription(iDesc) {
    this.description = iDesc;
};

setImageURL(iUrl) {
    this.image = iUrl;
};
getImageURL() {
    return this.image;
};

setPrice(iPrice){
  this.price = iPrice;
};
getPrice(){
  return this.price;
};
}
module.exports = Item;
