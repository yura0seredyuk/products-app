import React, {useState, useEffect, createRef} from "react";
import './App.css';
import firebase from 'firebase/app';
import { Products } from './Components/Products';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { customAlphabet } from 'nanoid';

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
  const [size, setSize] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const ref = firebase.firestore().collection('Products');
  const classes = useStyles();

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
    setSize(event.target.value);
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

      <Products products={products} />

      <Button
        variant="outlined"
        color="primary"
      >
        Add new Product
      </Button>

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
          value={size}
          onChange={addSize}
        />

        <Button
          variant="outlined"
          color="primary"
          onClick={() => addNewProducts({ id: nanoid(), name, count, imageUrl, weight, size })}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default App;
