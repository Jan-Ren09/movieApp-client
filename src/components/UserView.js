import { useState, useEffect } from 'react';
import MovieCard from './MovieCard'; 
import { Col } from 'react-bootstrap';

export default function UserView({ movieData, addComment }) { // Added addComment as a prop
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const productArr = movieData.map(movie => (
				<Col className='p-3' key={movie._id}>
					<MovieCard movieProp={movie} addComment={addComment} />
				</Col>
        ));
        
        setProducts(productArr);
    }, [movieData]);

    return (
        <>
				{products}
        </>
    );
}
