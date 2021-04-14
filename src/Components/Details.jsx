import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from 'react-modal';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Box } from '@material-ui/core';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 4);
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

Modal.setAppElement('#root')

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export const Details = ({
  productName,
  productDescription,
  productWeight,
  productSize,
  productId,
  productImageUrl
}) => {
  const classes = useStyles();
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const ref = firebase.firestore().collection(`Products/${productId}/comments/`);
  const reference = firebase.firestore().collection("Products");
  const [changeName, setChangeName] = useState(productName);
  const [changeDescription, setChangeDescription] = useState(productDescription);
  const [changeWeight, setChangeWeight] = useState(productWeight);

  var subtitle;
  const [modalIsOpen,setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = 'black';
  }

  function closeModal(){
    setIsOpen(false);
  }

  function editProducts(updatedProduct) {
    reference
      .doc(updatedProduct.id)
      .update(updatedProduct)
      .catch((err) => {
        console.error(err);
      });
  }

  function getComments() {
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((item) => {
        items.push(item.data());
      });
      setComments(items);
    });
  }

  useEffect(() => {
    getComments();
  }, [])

  function addComment(newComment) {
    ref
      .doc(newComment.id)
      .set(newComment)
      .catch((err) => {
        console.error(err);
      });
  }

  function deleteComment(comment) {
    ref
      .doc(comment.id)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  }

  const addCommentToDatabase = () => {
    addComment({ description, id: nanoid(), productId, date: new Date() });
  }

  const editName = (event) => {
    setChangeName(event.target.value);
  }

  const editDescription = (event) => {
    setChangeDescription(event.target.value);
  }

  const editWeight = (event) => {
    setChangeWeight(event.target.value);
  }

  return (
    <>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt={productName}
            height="100"
            image={productImageUrl}
            title={productName}
          />
          <CardContent>
            <Typography gutterBottom variant="h4" component="h2">
              {productName}
            </Typography>
            <Typography variant="h5">
              {productDescription}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {`Weight: ${productWeight}g.`}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {`Height: ${productSize && productSize.height}mm Width: ${productSize && productSize.width}mm`}
            </Typography>

            <Box m={2}>
              <Button variant="contained" onClick={openModal}>Edit details</Button>
            </Box>

            <Typography>Comments:</Typography>

            {comments && comments.map(comment => (
              <Box key={comment.id}>
                <Typography>
                  {comment.description
                    ? `# ${comment.description}`
                    : (<>No comments</>)}
                </Typography>
                <Typography>
                  {comment.date && `Date: ${new Date(comment.date.seconds).toLocaleDateString()}`}
                </Typography>
                <Box m={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => deleteComment(comment)}
                  >
                    X
                  </Button>
                </Box>
              </Box>
            ))}
            <form
              className={classes.root}
              noValidate autoComplete="off"
            >
              <TextField
                type="text"
                id="standard-basic"
                label="Comment"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Box m={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addCommentToDatabase}
                >
                  Add Comment
                </Button>
              </Box>
            </form>

            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >

              <h2 ref={_subtitle => (subtitle = _subtitle)}>Edit details</h2>
              <form>
                <Box>Name:</Box>
                <TextField
                  id="standard-basic"
                  value={changeName}
                  onChange={editName}
                />
                <Box>Description:</Box>
                <TextField
                  id="standard-basic"
                  value={changeDescription}
                  onChange={editDescription}
                />
                <Box>Weight:</Box>
                <TextField
                  id="standard-basic"
                  value={changeWeight}
                  onChange={editWeight}
                />
                <Box>
                  <Button
                    onClick={() => editProducts({ name: changeName, description: changeDescription, weight: changeWeight, id: productId })}
                  >
                    Save
                  </Button>
                  <Button onClick={closeModal}>Close details</Button>
                </Box>
              </form>
            </Modal>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
