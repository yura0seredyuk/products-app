import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 4);

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export const Details = ({
  productName,
  productDescription,
  productWeight,
  productComments,
  productSize,
  productId,
  productImageUrl
}) => {
  const classes = useStyles();
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const ref = firebase.firestore().collection(`Products/${productId}/comments/`);

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
            <Typography gutterBottom variant="h5" component="h2">
              {productName}
            </Typography>
            <Typography>
              {productDescription}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {`Weight: ${productWeight}g.`}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {`Height: ${productSize && productSize.height}mm Width: ${productSize && productSize.width}mm`}
            </Typography>

            <Typography>Comments:</Typography>

            {comments && comments.map(comment => (
              <>
                <Typography key={comment.id}>
                  {comment.description
                    ? `# ${comment.description}`
                    : (<>No comments</>)}
                </Typography>
                <Typography>
                  {comment.date && new Date(comment.date.seconds).toLocaleDateString("en-US")}
                </Typography>
                <Button onClick={() => deleteComment(comment)}>X</Button>
              </>
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
              <Button onClick={addCommentToDatabase}>Add Comment</Button>
            </form>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
