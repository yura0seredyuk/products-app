import React, {useState, useEffect, createRef} from "react";
import './App.css';
import firebase from 'firebase/app';
import { Products } from './Components/Products';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { customAlphabet } from 'nanoid';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root');

const nanoid = customAlphabet('1234567890', 4);

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));


function App() {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState(products);
  const [name, setName] = useState('');
  const [count, setCount] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [activeAddButton, setActiveAddButton] = useState(false);
  const ref = firebase.firestore().collection('Products');
  const classes = useStyles();

  var subtitle;
  const [modalIsOpen,setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = '#f00';
  }

  function closeModal(){
    setIsOpen(false);
  }

  function getProducts() {
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((item) => {
        items.push(item.data());
      });
      setProducts(items);
    });
  }

  useEffect(() => {
    getProducts();
  }, [sortedProducts])

  function addNewProducts(newProduct) {
    ref
      .doc(newProduct.id)
      .set(newProduct)
      .catch((err) => {
        console.error(err);
      });
  }

  function deleteProduct(product) {
    ref
      .doc(product.id)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  }

  function editProduct(product) {
    ref
      .doc(product.id)
      .update(product)
      .catch((err) => {
        console.error(err);
      });
  }

  const sortByName = () => {
    const sorted = products.sort((prev, next) => {
      return prev.name.localeCompare(next.name);
    });
    setSortedProducts(sorted);
  };

  const sortByCount = () => {
    const sorted = products.sort((prev, next) => {
      return prev.count - next.count;
    });
    setSortedProducts(sorted);
  };

  const addSize = (event) => {
    const value = event.target.value.split('x');

    setSize({height: value[0], width:value[1]});
  }

  const addProductToDatabase = () => {
    addNewProducts({ id: nanoid(), name, count, imageUrl, weight, size });
    setActiveAddButton(false);
  }

  const cancelAdd = () => {
    setActiveAddButton(false);
  }

  return (
    <div className="App">
      <Button
        variant="contained"
        onClick={sortByName}
      >
        Sort by name
      </Button>
      <Button
        variant="contained"
        onClick={sortByCount}
      >
        Sort by count
      </Button>

      <Button
        variant="outlined"
        color="primary"
        onClick={openModal}
      >
        Add new Product
      </Button>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={_subtitle => (subtitle = _subtitle)}>ADD NEW PRODUCT</h2>
        <form
          className={classes.root}
          noValidate autoComplete="off"
        >
          <TextField
            type="text"
            id="standard-basic"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            type="number"
            id="standard-basic"
            label="Count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />

          <TextField
            type="text"
            id="standard-basic"
            label="ImageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <TextField
            type="text"
            id="standard-basic"
            label="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <TextField
            type="text"
            id="standard-basic"
            label="Size"
            onChange={addSize}
          />

          <Button
            variant="outlined"
            color="primary"
            onClick={closeModal}
          >
            Cancel
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={addProductToDatabase}
          >
            Submit
          </Button>
        </form>
      </Modal>

      <Products
        products={products}
        deleteProduct={deleteProduct}
      />
    </div>
  );
}

export default App;
