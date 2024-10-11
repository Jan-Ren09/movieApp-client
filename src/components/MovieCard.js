import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

function MovieCard({ movieProp, addComment }) {
    const { _id, title, director, year, description, comments } = movieProp;
    const [showModal, setShowModal] = useState(false);
    const [newComment, setNewComment] = useState("");

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleAddComment = () => {
        addComment(_id, newComment);  
        setNewComment("");
        handleClose();
    };

    return (
        <>
            <Card >
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{director}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">{year}</Card.Subtitle>
                    <Card.Text>{description}</Card.Text>

                    {/* Display Existing Comments */}
                    {comments.length > 0 ? (
                        <div>
                            <h6>Comments:</h6>
                            {comments.map((commentObj) => (
                                <Card.Text key={commentObj._id}>- {commentObj.comment}</Card.Text>
                            ))}
                        </div>
                    ) : (
                        <Card.Text>No comments yet.</Card.Text>
                    )}
                    
                    <Button variant="primary" onClick={handleShow}>
                        Add Comment
                    </Button>
                </Card.Body>
            </Card>

            {/* Modal for Adding Comment */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        placeholder="Enter your comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddComment}>
                        Submit Comment
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MovieCard;
