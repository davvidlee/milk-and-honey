import React from "react";

const OrderItem = ({ props }) => {
  // console.log(props.drink);

  return (
    <>
      <div className="row my-4">
        {/* <div className="col-4 d-flex justify-content-start">
          <img src={props.item.picture} class="cartDrinkPic" alt="..." />
        </div> */}
        <div style={{ color: "#AAA" }}>
          <div className="fs-6" style={{ color: "#424F65" }}>
            {props.name}
          </div>
          {props.tea !== "/" && props.name == "Custom Fruit Tea" && <div>{props.tea}</div>}
          {props.milk !== "/" && <div>{props.milk}</div>}
          <div>{new Array(...props.flavors).join(" ")}</div>
          {props.ice !== "/" && <div>{props.ice}</div>}
          {props.sweetness !== "/" && <div>{props.sweetness} Sweetness</div>}
          <div>{new Array(...props.toppings).join(" ")}</div>
        </div>
      </div>
    </>
  );
};

export default OrderItem;
