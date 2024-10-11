import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function AdminView({ movieData, fetchData }) {
    const [movies, setMovies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false); // New state for update modal
    const [newMovie, setNewMovie] = useState({
        title: '',
        description: '',
        year: '',
        director: '',
        genre: '',  
    });
    const [selectedMovieId, setSelectedMovieId] = useState(null); // New state to store selected movie ID
    const notyf = new Notyf();

    useEffect(() => {
        setMovies(movieData);
    }, [movieData]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleUpdateShow = (movie) => {
        setNewMovie(movie); // Set the selected movie for updating
        setSelectedMovieId(movie._id); // Set the ID of the movie to update
        setShowUpdateModal(true);
    };

    const handleUpdateClose = () => setShowUpdateModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMovie({
            ...newMovie,
            [name]: value
        });
    };

    const handleCreateMovie = () => {
        fetch("https://movieapp-api-lms1.onrender.com/movies/addMovie", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newMovie)
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to create movie');
            return res.json();
        })
        .then(data => {
            notyf.success('Movie created successfully!');
            fetchData(); 
            handleClose(); 
            setNewMovie({ title: '', description: '', year: '', director: '', genre: '' }); // Reset state
        })
        .catch(err => {
            console.error("Error creating movie: ", err);
            notyf.error('Failed to create movie');
        });
    };

    const handleUpdateMovie = () => {
        fetch(`https://movieapp-api-lms1.onrender.com/movies/updateMovie/${selectedMovieId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newMovie)
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to update movie');
            return res.json();
        })
        .then(data => {
            notyf.success('Movie updated successfully!');
            fetchData(); // Refresh the movie list
            handleUpdateClose(); 
        })
        .catch(err => {
            console.error("Error updating movie: ", err);
            notyf.error('Failed to update movie');
        });
    };

    const handleDeleteMovie = (id) => {
        fetch(`https://movieapp-api-lms1.onrender.com/movies/deleteMovie/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to delete movie');
            notyf.success('Movie deleted successfully!');
            fetchData(); // Refresh the movie list
        })
        .catch(err => {
            console.error("Error deleting movie: ", err);
            notyf.error('Failed to delete movie');
        });
    };

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <h1 className="text-center my-4">Admin Dashboard</h1>

                <Row className='justify-content-center mb-4'>
                    <Col xs="auto">
                        <Button variant="success" onClick={handleShow}>
                            Create Movie
                        </Button>
                    </Col>
                </Row>

                <h2 className="text-center my-4">Movies</h2>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr className="text-center">
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Year</th>
                            <th>Director</th>
                            <th>Genre</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map(movie => (
                            <tr key={movie._id}>
                                <td>{movie._id}</td>
                                <td>{movie.title}</td>
                                <td>{movie.description}</td>
                                <td>{movie.year}</td>
                                <td>{movie.director}</td>
                                <td>{movie.genre}</td>
                                <td>
                                    <Button className='btn-warning m-2' onClick={() => handleUpdateShow(movie)}>
                                        Update
                                    </Button>
                                    <Button className='btn-danger m-2' onClick={() => handleDeleteMovie(movie._id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Modal for Creating Movie */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formMovieTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter movie title" 
                                name="title" 
                                value={newMovie.title} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formMovieDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter movie description" 
                                name="description" 
                                value={newMovie.description} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formMovieYear">
                            <Form.Label>Year</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Enter release year" 
                                name="year" 
                                value={newMovie.year} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formMovieDirector">
                            <Form.Label>Director</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter director's name" 
                                name="director" 
                                value={newMovie.director} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formMovieGenre">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter movie genre" 
                                name="genre" 
                                value={newMovie.genre} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateMovie}>
                        Create Movie
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Updating Movie */}
            <Modal show={showUpdateModal} onHide={handleUpdateClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formMovieTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter movie title" 
                                name="title" 
                                value={newMovie.title} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formMovieDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter movie description" 
                                name="description" 
                                value={newMovie.description} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formMovieYear">
                            <Form.Label>Year</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Enter release year" 
                                name="year" 
                                value={newMovie.year} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formMovieDirector">
                            <Form.Label>Director</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter director's name" 
                                name="director" 
                                value={newMovie.director} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formMovieGenre">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter movie genre" 
                                name="genre" 
                                value={newMovie.genre} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleUpdateClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateMovie}>
                        Update Movie
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
