import { Col, Row } from "react-bootstrap";
import MovieCard from '../components/MovieCard'; 
import { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import AdminView from '../components/AdminView';
import { Notyf } from 'notyf';

const token = localStorage.getItem('token');

export default function Home() {
    const [movies, setMovies] = useState([]);
    const { user } = useContext(UserContext);
    const notyf = new Notyf();

    const fetchMovies = () => {
        fetch(`https://movieapp-api-lms1.onrender.com/movies/getMovies`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch movies');
            return res.json();
        })
        .then(data => {
            setMovies(data.movies);
            notyf.success('Movies fetched successfully!');  // Success message
        })
        .catch(err => {
            console.log("Error fetching movies: ", err);
            notyf.error('Failed to fetch movies');  // Error message
        });
    };

    useEffect(() => {
        fetchMovies();
    }, [user]);

    const addComment = (id, comment) => {
        fetch(`https://movieapp-api-lms1.onrender.com/movies/addComment/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment })
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to add comment');
            return res.json();
        })
        .then(data => {
            if (data.message === 'comment added successfully') {
                fetchMovies();  // Refetch movies to show updated comments
                notyf.success('Comment added successfully!');  // Success message
            } else {
                console.error("Failed to add comment: ", data.message);
                notyf.error('Failed to add comment');  // Error message
            }
        })
        .catch(err => {
            console.log("Error adding comment: ", err);
            notyf.error('Failed to add comment');  // Error message
        });
    };

    return (
        <>
            <h1 className='text-center'>NextFlix</h1>
            
            {user.isAdmin ? (
                <AdminView movieData={movies} fetchData={fetchMovies} />
            ) : (
                <Row className='justify-content-between'>
                    {movies.length > 0 ? (
                        movies.map(movie => (
                                <Col xs={12} sm={6} lg={4} key={movie._id} className="mb-4">
                                    <MovieCard
                                        movieProp={movie}
                                        addComment={addComment}
                                    />
                                </Col>
                        ))
                    ) : (
                        <Col className="text-center">
                            <p>No movies available at the moment.</p>
                        </Col>
                    )}
                </Row>
            )}
        </>
    );
}
