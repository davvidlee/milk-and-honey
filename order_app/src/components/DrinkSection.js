import DrinkCard from "./DrinkCard";
import React from "react";

const DrinkSection = ({ sectionItems, price, description }) => {
  return (
    <>
      <div className="drinkSection">
        <div
          className="mt-4 mb-3 text-uppercase title fw-bolder d-flex justify-content-center"
          id="drinkType"
          style={{ marginLeft: "10px" }}
        >
          {sectionItems[0].category} ${price}
        </div>
        <div
          className="mb-3 d-flex justify-content-center"
          // style={{ marginLeft: "10px" }}
        >
          {description}
        </div>
        <div className="d-flex flex-wrap justify-content-center">
          {/* CHANGE HERE TO REMOVE MENU ITEMS */}
        {sectionItems.map((item) => (
            <DrinkCard key={item.id} item={item} class="ml_auto" />
          ))}
        </div>
      </div>
    </>
  );
};

export default DrinkSection;
