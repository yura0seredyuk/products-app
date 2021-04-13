import React, {useState, useEffect} from 'react';
import './App.css';
import firebase from 'firebase/app';

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

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {console.log(products)}
        </p>
      </header>
    </div>
  );
}

export default App;
