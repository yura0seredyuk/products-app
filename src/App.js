import React, {useState, useEffect, createRef} from "react";
import './App.css';
import firebase from 'firebase/app';
import { Products } from './Components/Products';
import { ModalForm } from './Components/Modal';
import Button from '@material-ui/core/Button';
import { Box } from '@material-ui/core';
import 'firebase/firestore';
import { Details } from './Components/Details';
import { Route, Link } from "react-router-dom";


function App() {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState(products);
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
  }, [sortedProducts])

  function deleteProduct(product) {
    ref
      .doc(product.id)
      .delete()
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
