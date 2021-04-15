import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import firebase from 'firebase';
import { makeStyles } from '@material-ui/core/styles';
import { customAlphabet } from 'nanoid';
import { Box } from '@material-ui/core';

const nanoid = customAlphabet('1234567890', 4);

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const customStyles = {
  content: {
    width: '600px',
    top: '30%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

export function ModalForm() {
  const [name, setName] = useState('');
  const [count, setCount] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const ref = firebase.firestore().collection('Products');
  const classes = useStyles();

  let subtitle;

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = '#grey';
  }

  function closeModal() {
    setIsOpen(false);
  }

  function addNewProducts(newProduct) {
    ref
      .doc(newProduct.id)
      .set(newProduct)
      .catch((err) => {
        throw new Error(err);
      });
  }

  const addSize = (event) => {
    const value = event.target.value.split('x');

    setSize({
      height: value[0], width: value[1],
    });
  };

  const clearFields = () => {
    setName('');
    setSize('');
    setCount('');
    setDescription('');
    setImageUrl('');
    setWeight('');
  };

  const addProductToDatabase = () => {
    addNewProducts({
      id: nanoid(),
      name,
      count,
      imageUrl,
      weight,
      size,
      description,
      comments: [],
    });
    setIsOpen(false);
    clearFields();
  };

  return (
    <>
      <Box m={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={openModal}
        >
          Add new Product
        </Button>
      </Box>

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
          autoComplete="off"
          onSubmit={addProductToDatabase}
        >
          <TextField
            type="text"
            id="standard-basic"
            label="Name"
            value={name}
            required
            onChange={e => setName(e.target.value)}
          />

          <TextField
            type="number"
            id="standard-basic"
            label="Count"
            value={count}
            required
            onChange={e => setCount(e.target.value)}
          />

          <TextField
            type="text"
            id="standard-basic"
            label="ImageUrl"
            value={imageUrl}
            required
            onChange={e => setImageUrl(e.target.value)}
          />

          <TextField
            type="text"
            id="standard-basic"
            label="Weight"
            value={weight}
            required
            onChange={e => setWeight(e.target.value)}
          />

          <TextField
            type="text"
            id="standard-basic"
            label="Size"
            placeholder="height x width (x required)"
            required
            onChange={addSize}
          />

          <TextField
            type="text"
            id="standard-basic"
            label="Description"
            required
            onChange={e => setDescription((e.target.value))}
          />

          <Box m={2} display="flex">
            <Box mr={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </Box>
            <Box>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>
    </>
  );
}
