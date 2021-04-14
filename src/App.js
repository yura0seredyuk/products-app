import React, {useState, useEffect} from "react";
import './App.css';
import firebase from 'firebase/app';
import { Products } from './Components/Products';
import { ModalForm } from './Components/Modal';
import Button from '@material-ui/core/Button';
import { Box } from '@material-ui/core';
import 'firebase/firestore';

function App() {
  const [products, setProducts] = useState([]);
  const ref = firebase.firestore().collection('Products');

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
  }, [])

  function deleteProduct(product) {
    ref
      .doc(product.id)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  }

  const sortByName = () => {
    const sorted = [...products].sort((prev, next) => {
      return prev.name.localeCompare(next.name);
    });
    setProducts(sorted);
  };

  const sortByCount = () => {
    const sorted = [...products].sort((prev, next) => {
      return prev.count - next.count;
    });
    setProducts(sorted);
  };

  return (
    <>
        <div className="App">
          <Box
            m={2}
            fontSize={40}
            fontFamily="Roboto"
          >
            Product list
          </Box>

          <Box m={2} display="flex">
            <Box mr={2}>
              <Button
                variant="contained"
                onClick={sortByName}
              >
                Sort by name
              </Button>
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={sortByCount}
              >
                Sort by count
              </Button>
            </Box>
          </Box>

          <ModalForm />

          <Products
            products={products}
            deleteProduct={deleteProduct}
          />
        </div>
    </>
  );
}

export default App;
