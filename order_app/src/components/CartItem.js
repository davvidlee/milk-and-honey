
import React from 'react'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMenu } from '../menu/MenuContext';

const CartItem = ({ props }) => {

  const { handleRemoveFromCart } = useMenu();

  return (
    <>
      <div className="row my-4">
        <div className="col-4 d-flex justify-content-start">
          <img src={props.item.picture} class="cartDrinkPic" alt="..." />
        </div>
        <div className="col-4">
          <div className="fw-bold fs-6 mb-2">
            {props.item.name}
          </div>
          {(props.tea !== "/") &&
            <div>
              {props.tea}
            </div>}
          {(props.milk !== "/") &&
            <div>
              {props.milk}
            </div>}
            <div>
              {new Array(...props.flavors).join(' ')}
            </div>

          {(props.ice !== "/") &&
            <div>
              {props.ice}
            </div>}
          {(props.sweetness !== "/") &&
            <div>
              {props.sweetness} Sweetness
            </div>}
          <div>
            {new Array(...props.toppings).join(' ')}
          </div>
          {(props.notes !== "/") &&
            <div>
              Special Notes: {props.notes}
            </div>}
        </div>
        <div className="col-4">
          <Typography gutterBottom variant="h6 " component="div">
            ${props.subtotal}
          </Typography>
          <Button variant="outlined" size="small" color="secondary" onClick={() => handleRemoveFromCart(props.id)}>Remove</Button>
        </div>
      </div>
    </>
  )
}

export default CartItem