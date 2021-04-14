import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import { Details } from './Details';


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export function Products({ products, deleteProduct }) {
  const classes = useStyles();

  return (
    <>
      <Box display="flex" flexWrap="wrap" justifyContent="center">
      {products.map(product => (
        <Box m={2} key={product.id}>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                component="img"
                alt={product.name}
                height="140"
                image={product.imageUrl}
                title={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h4" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body1">
                  {`Products left: ${product.count}`}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Box m={2}>
                <Button variant="contained" color="primary">
                  Learn More
                </Button>
              </Box>

              <Box m={2}>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteProduct(product)}
                >
                  Delete product
                </Button>
              </Box>
            </CardActions>
          </Card>

          <Details
            productName={product.name}
            productDescription={product.description}
            productWeight={product.weight}
            productSize={product.size}
            productImageUrl={product.imageUrl}
            productId={product.id}
          />
        </Box>
      ))}
      </Box>
    </>
  );
}

Products.propTypes = {
  deleteProduct: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      weight: PropTypes.string.isRequired,
      size: PropTypes.object.isRequired,
      imageUrl: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  ).isRequired
}
