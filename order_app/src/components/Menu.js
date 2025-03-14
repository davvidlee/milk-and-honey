import DrinkSection from "./DrinkSection";
import { CircularProgress } from "@mui/material";
import { useMenu } from "../menu/MenuContext";

// currently hardcoded, consider revision
const categories = [
  //"Specials",
  "Classic Milk Tea",
  "Fresh Milk Lattes",
  "Fruit Teas",
  "Custom Fruit Tea"
];

const Menu = () => {
  const { menu, contextLoaded, categoryDescription } = useMenu();

  function getCategoryGroups(categories, menuItems) {
    const groups = [];
    for (const category of categories) {
      const itemsInCategory = menuItems.filter(
        (item) => item.category === category
      );
      const descriptionObj = categoryDescription.find(
        (desc) => desc.category === category
      );
      const description = descriptionObj ? descriptionObj.description : "";
      const price = itemsInCategory.length > 0 ? itemsInCategory[0].price : 0;
      groups.push({ category, items: itemsInCategory, price, description });
    }
    return groups;
  }

  function displayCategories(sections) {
    return sections.map((section) => (
      <DrinkSection
        sectionItems={section.items}
        price={section.price}
        description={section.description}
      />
    ));
  }

  // function displayCategories(sections) {
  //   return sections.map((sectionItems) => (
  //     <DrinkSection sectionItems={sectionItems} />
  //   ));
  // }

  return (
    <>
      {!contextLoaded && (
        <div
          style={{
            width: "100%",
            height: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </div>
      )}
      {contextLoaded && (
        <div>{displayCategories(getCategoryGroups(categories, menu))}</div>
      )}
    </>
  );
};

export default Menu;
