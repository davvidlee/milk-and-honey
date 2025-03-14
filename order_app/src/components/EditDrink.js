import Divider from "@mui/material/Divider";
import React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { useMenu } from "../menu/MenuContext";
import "../App.css";

var hasTouchScreen = false;

if ("maxTouchPoints" in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
} else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
} else {
    var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
        hasTouchScreen = true; // deprecated, but good fallback
    } else {
        // Only as a last resort, fall back to user agent sniffing
        var UA = navigator.userAgent;
        hasTouchScreen = (
            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
        );
    }
}

if (hasTouchScreen) document.body.className += 'noHover'
function watchForHover() {
  // lastTouchTime is used for ignoring emulated mousemove events
  let lastTouchTime = 0

  function enableHover() {
    if (new Date() - lastTouchTime < 500) return
    document.body.classList.add('hasHover')
  }

  function disableHover() {
    document.body.classList.remove('hasHover')
  }

  function updateLastTouchTime() {
    lastTouchTime = new Date()
  }

  document.addEventListener('touchstart', updateLastTouchTime, true)
  document.addEventListener('touchstart', disableHover, true)
  document.addEventListener('mousemove', enableHover, true)

  enableHover()
}

watchForHover()

const EditDrink = ({ props, open, handleClose }) => {
  const [alertActive, setAlertActive] = React.useState(false);

  const hasTeaOption = props.item.tea.length > 1;
  const hasFlavorOption = props.item.flavor.length > 1;
  const hasMilkOption = props.item.milk.length > 1;
  const hasIceOption = props.item.ice.length > 1;
  const hasSweetnessOption = props.item.sweetness.length > 1;


  const [milk, setMilk] = React.useState("");
  const [tea, setTea] = React.useState("");
  const [flavors, setFlavors] = React.useState(new Set());
  const [toppings, setToppings] = React.useState(new Set());
  const [sweetness, setSweetness] = React.useState("");
  const [ice, setIce] = React.useState("");
  const [notes, setNotes] = React.useState("");


  const [total, setTotal] = React.useState(props.item.price);
  const [scroll, setScroll] = React.useState("paper");

  const [itemCount, setItemCount] = React.useState(1);

  const { toppingInventory, handleAddToCart } = useMenu();
 

  const toppingInvMap = new Map();
  toppingInvMap.set("Honey Boba", "hasBoba");
  toppingInvMap.set("Lychee Jelly", "hasJelly");
  toppingInvMap.set("Passionfruit Popping Boba", "hasPopping");

  // NEW STUFF HERE SDPOJFPOSDFJSDOPJFDPOSJFDSPOJFDOPSJF
  const [selectedItems, setSelectedItems] = React.useState(new Set());

  const handleColorChange = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = new Set(prevSelectedItems);
      if(newSelectedItems.has(item)){
        newSelectedItems.delete(item);
      }else{
        newSelectedItems.add(item);
      }
      return newSelectedItems;
    })  
  };

  const handleTopping = (e, ingredient) => {
    e.preventDefault();
    if (toppings.has(ingredient)) {
      setToppings((prev) => new Set([...prev].filter((x) => x !== ingredient)));
      setTotal((prev) => prev - 0.5);
    } else {
      setToppings((prev) => new Set(prev.add(ingredient)));
      setTotal((prev) => prev + 0.5);
    }
  };

  const handleFlavors = (e, choice) => {
    e.preventDefault();
    if (flavors.has(choice)) {
      setFlavors((prev) => new Set([...prev].filter((x) => x !== choice)));
    } else {
      setFlavors((prev) => new Set(prev.add(choice)));
    }
  };

  const decrement = () => {
    setItemCount(itemCount-1);
  }

  const increment = () => {
    setItemCount(itemCount+1);
  }
  // No hover effect for touch screen devices
  const handleAdd = () => {
    if (
      (hasFlavorOption && flavors.length === 0) ||
      (hasTeaOption && tea === "") ||
      (hasMilkOption && milk === "")||
      (hasIceOption && ice === "")||
      (hasSweetnessOption && sweetness === "")
    ) {
      setAlertActive(true);
    } else {
      handleClose();
      for(var i = 0; i < itemCount; i++) {
        const cartItem = {
          id: new Date().getTime() + i,
          item: props.item,
          tea: tea === "" ? props.item.tea[0] : tea,
          flavors: flavors.length === 0 ? props.item.flavor[0] : flavors,
          milk: milk !== "" ? milk : props.item.milk[0],
          sweetness: sweetness !== "" ? sweetness : props.item.sweetness[0],
          ice: ice !== "" ? ice : props.item.ice[0],
          toppings: toppings,
          notes: notes,
          subtotal: total,
        };
        console.log(cartItem);
        handleAddToCart(cartItem);
      }
      setToppings(new Set());
      setSweetness("");
      setMilk("");
      setFlavors(new Set());
      setTea("");
      setIce("");
      setSelectedItems(new Set());
      setTotal(props.item.price);
    }
  };

  const updateChar = (e) => {
    var left = 50 - e.length;
    document.getElementsByClassName('charLeft')[0].textContent = left + " characters left"
  };

  const showChars = (e) => {
    document.getElementsByClassName('charLeft')[0].style.visibility = 'visible';
  };
  const hideChars = (e) => {
    document.getElementsByClassName('charLeft')[0].style.visibility = 'hidden';
  };

  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose} scroll={scroll}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {/* Customize your drink */}
          </Typography>
        </Toolbar>

        <DialogContent dividers={scroll === "paper"}>
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Box sx={{ ml: 2, my: 3 }}>
              <div className="d-flex">
                <div className="mx-4 d-flex justify-content-center">
                  <img src={props.item.picture} class="drinkPic" alt="..." />
                </div>
                <div className="mx-8">
                  <Typography gutterBottom variant="h4" component="div">
                    {props.item.name}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    ${props.item.price}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {props.item.description}
                  </Typography>
                </div>
              </div>
            </Box>

            <Divider textAlign="center"> Customize your drink </Divider>

            {hasTeaOption && (
              <Box sx={{ ml: 2, mt: 3 }}>
                <Typography gutterBottom variant="h6">
                  Base Tea
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {props.item.tea.map((teaChoice) => (
                    <Chip
                      className="chipclass"
                      color={tea === teaChoice ? "primary" : "default"}
                      label={teaChoice}
                      onClick={(e) => {
                        setTea(teaChoice);
                        e.currentTarget.blur()}}
                      sx = {{ml:1, mb:1}}
                  />
                  ))}
                </Box>
              </Box>
            )}

            {hasMilkOption && (
              <Box sx={{ ml: 2, mt: 3 }}>
                <Typography gutterBottom variant="h6">
                  Milk
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {props.item.milk.map((milkChoice) => (
                    <Chip
                      className="chip"
                      color={milk === milkChoice ? "primary" : "default"}
                      label={milkChoice}
                      onClick={(e) => {setMilk(milkChoice); e.currentTarget.blur()}}
                      sx = {{ml:1, mb:1}}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {hasFlavorOption && (
              <Box sx={{ ml: 2, mt: 3 }}>
                <Typography gutterBottom variant="h6">
                  Flavors
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {props.item.flavor.map((flavorChoice) => (
                    <Chip
                      className="chip"
                      color={flavors.has(flavorChoice) ? "primary" : "default"}
                      label={flavorChoice}
                      onClick={(e) => {handleFlavors(e, flavorChoice); e.currentTarget.blur()}}
                      sx={{
                        // backgroundColor: selectedItems.has(topping) ? 'rgb(249, 212, 84)' : 'rgb(235, 235, 235)',
                        // '&:hover': {
                        //   backgroundColor: selectedItems.has(topping) ? 'rgb(249, 212, 84)' : 'rgb(235, 235, 235)',
                        // },
                        '@media (hover: none)': {
                          '&:hover': {
                            backgroundColor: flavors.has(flavorChoice) ? 'rgb(249, 212, 84)' : 'rgb(235, 235, 235)', // This should match the non-hover state explicitly for touch devices
                          },
                        },ml:1, mb:1}}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ ml: 2, mt: 3 }}>
              <Typography gutterBottom variant="h6">
                Toppings (+$0.5)
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap"}}>
                {props.item.toppings.map((topping) => {
                  return (
                    <Chip
                      className={`multchip ${selectedItems.has(topping) ? 'selected' : ''}`}
                      //color={toppings.has(topping) ? "primary" : "default"}
                      color = {selectedItems.has(topping)? "primary":"default"}
                      label={topping}
                      onClick={(e) => {handleTopping(e, topping); e.currentTarget.blur(); handleColorChange(topping);}}
                      disabled={!toppingInventory[toppingInvMap.get(topping)]}
                      sx={{
                        // backgroundColor: selectedItems.has(topping) ? 'rgb(249, 212, 84)' : 'rgb(235, 235, 235)',
                        // '&:hover': {
                        //   backgroundColor: selectedItems.has(topping) ? 'rgb(249, 212, 84)' : 'rgb(235, 235, 235)',
                        // },
                        '@media (hover: none)': {
                          '&:hover': {
                            backgroundColor: selectedItems.has(topping) ? 'rgb(249, 212, 84)' : 'rgb(235, 235, 235)', // This should match the non-hover state explicitly for touch devices
                          },
                        },
                        ml: 1, mb: 1
                      }}
                    /> 
                  );
                })}
              </Box>
            </Box>

            {hasIceOption && (
              <Box sx={{ ml: 2, mt: 3 }}>
                <Typography gutterBottom variant="h6">
                  Ice
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {props.item.ice.map((iceChoice) => (
                    <Chip
                      className="chip"
                      color={ice === iceChoice ? "primary" : "default"}
                      label={iceChoice}
                      onClick={(e) => {setIce(iceChoice);e.currentTarget.blur()}}
                      sx = {{ml:1, mb:1}}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {hasSweetnessOption && (
              <Box sx={{ ml: 2, mt: 3 }}>
                <Typography gutterBottom variant="h6">
                  Sweetness
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {props.item.sweetness.map((sweetnessChoice) => (
                    <Chip
                      className="chip"
                      color={sweetness === sweetnessChoice ? "primary" : "default"}
                      label={sweetnessChoice}
                      onClick={(e) => {setSweetness(sweetnessChoice); e.currentTarget.blur()}}
                      sx = {{ml:1, mb:1}}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* <Box sx={{ ml: 2, mt: 3 }}>
              <Typography gutterBottom variant="h6">
                sweetness
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <Chip
                  className="chipclass"
                  color={sweetness === "25%" ? "primary" : "default"}
                  label="25%"
                  onClick={() => setSweetness("25%")}
                />
                <Chip
                  className="chipclass"
                  color={sweetness === "50%" ? "primary" : "default"}
                  label="50%"
                  onClick={() => setSweetness("50%")}
                />
                <Chip
                  className="chipclass"
                  color={sweetness === "75%" ? "primary" : "default"}
                  label="75%"
                  onClick={() => setSweetness("75%")}
                />
                <Chip
                  className="chipclass"
                  color={sweetness === "100%" ? "primary" : "default"}
                  label="100%"
                  onClick={() => setSweetness("100%")}
                />
              </Box>
            </Box>

            <Box sx={{ ml: 2, mt: 3 }}>
              <Typography gutterBottom variant="h6">
                ice
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <Chip
                  className="chipclass"
                  color={ice === "0%" ? "primary" : "default"}
                  label="0%"
                  onClick={() => setIce("0%")}
                />

                <Chip
                  className="chipclass"
                  color={ice === "25%" ? "primary" : "default"}
                  label="25%"
                  onClick={() => setIce("25%")}
                />

                <Chip
                  className="chipclass"
                  color={ice === "50%" ? "primary" : "default"}
                  label="50%"
                  onClick={() => setIce("50%")}
                />

                <Chip
                  className="chipclass"
                  color={ice === "100%" ? "primary" : "default"}
                  label="100%"
                  onClick={() => setIce("100%")}
                />
              </Box>
            </Box> */}
            
            {(
              <Box sx={{ ml: 2, mt: 3 }} style={{width: '300px'}}>
                <Typography gutterBottom variant="h6">
                  Notes (optional)
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <TextField
                  multiline
                  placeholder="Enter here (50 characters max)"
                  variant="outlined"
                  className = 'notesTextfield'
                  InputLabelProps={{ shrink: false }}
                  style={{ width: '20%', minWidth: '300px', borderColor: '#d9d9d9', borderWidth: '2px', whiteSpace: "pre-wrap"}}
                  sx={{
                    '& legend': { display: 'none' },
                    '& fieldset': { top: 0 },
                    borderRadius: '30px',
                    }}
                  onChange={(e) => {setNotes(e.target.value); updateChar(e.target.value)}}
                  onFocus={(e) => showChars()}
                  onBlur={(e) => hideChars()}
                  inputProps={{maxLength: 50}}
                />
                </Box>
                <Typography 
                  style={{fontSize: '.8em', color: '#605DEC', textAlign: 'right', marginRight:'.5em', marginTop: '.4em', visibility:'hidden'}}
                  className= 'charLeft'
                >
                  50 characters left
                </Typography>
              </Box>
            )}

            <Box sx={{ ml: 2, mt: 7 }}></Box>
          </Box>
        </DialogContent>

        <Box>
          <div className="fs-3 d-flex justify-content-end" style={{marginRight: "1rem"}}>
            Subtotal: ${total}
          </div>
        </Box>
        <Box>
          <Button
            fullWidth={false}
            size="large"
            variant="contained"
            style={{float: 'right', marginRight: '1rem'}}
            onClick={() => handleAdd()}
          >
            <ShoppingCartIcon sx={{ mr: 1 }} />
            Add to cart
          </Button>
          {/* <Button
            fullWidth={false}
            size="string"
            style={{ float: 'right', marginRight: '1rem' }}
            onClick={() => increment()}
            >
            +
          </Button>
          <Button
            fullWidth={false}
            size="string"
            variant="contained"
            style={{ float: 'right', marginRight: '1rem' }}>
            {itemCount}
          </Button>
          <Button
            fullWidth={false}
            size="string"
            style={{ float: 'right', marginRight: '1rem' }}
            onClick={() => decrement()}
            >
            -
          </Button> */}
        </Box>
      </Dialog>

      <Dialog
        open={alertActive}
        onClose={() => setAlertActive(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Oops!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please finish your selection for all the ingredients!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertActive(false)} autoFocus>
            Gotcha
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditDrink;
