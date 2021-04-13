import React, {useState, useEffect} from 'react';
import './App.css';
import firebase from 'firebase/app';
import { Products } from './Components/Products';
import Button from '@material-ui/core/Button';

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
    </div>
  );
}

export default App;
