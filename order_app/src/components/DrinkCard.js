import React from "react";
import EditDrink from "./EditDrink";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const DrinkCard = (props) => {
  const [open, setOpen] = React.useState(false);
  const { currentUser } = useAuth();
  let navigate = useNavigate();

  const handleClickOpen = () => {
    if (!currentUser) {
      navigate("/login");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // return (
  //   <>
  //     <div className="drinkCard" onClick={handleClickOpen} style={{ display: 'flex', alignItems: 'center' }}>
  //       <div style={{ width: "110px", height: '110px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
  //         <img src={props.item.picture} className="cardImg" style={{ width: '100px', marginLeft: '10px' }} alt={props.item.name} />
  //       </div>
  //       <div className="d-flex justify-content-left flex-wrap px-2 mt-1 text-uppercase" style={{ width: '220px', fontSize: '1.25rem' }}>
  //         {props.item.name}
  //       </div>
  //     </div>
  //     <EditDrink props={props} open={open} handleClose={handleClose} handleAddToCart={props.handleAddToCart} />
  //   </>
  // )

  return (
    <>
      <div className="drinkCard" onClick={handleClickOpen}>
        <img src={props.item.picture} className="cardImg" />
        <div className="d-flex justify-content-center flex-wrap px-3 mt-2 text-uppercase">
          {props.item.name}
        </div>
      </div>
      <EditDrink props={props} open={open} handleClose={handleClose} />
    </>
  );
};

export default DrinkCard;
