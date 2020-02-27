import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SERVER_URL } from '../../constants.js';
import './AccueilliFeedback.css';

const AccueilliFeedback = props => {
    const currentQuestionImages = props.images;

    const selectedAccueilli = props.accueilli
    const [visible, setVisible] = useState(true)

    const [imageList, setImageList] = useState([]);
    const [goodBoxList, setGoodBoxList] = useState([]);
    const [badBoxList, setBadBoxList] = useState([]);

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? 'lightblue' : '',
    });

    useEffect(() => {
        let index = 0;
        const images = props.images.map((image) => {
            return {
                id: `${image.src}#${index++}`,
                src: `${image.src}`
            }
        })

        setImageList(images)

    }, [])

    const move = (source, destination, droppableSource, droppableDestination) => {
        console.log(source);
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);

        const [removed] = sourceClone.splice(droppableSource.index, 1);
        destClone.splice(droppableDestination.index, 0, removed);

        const result = [];
        result["source"] = sourceClone;
        result["destination"] = destClone;
        console.log(result);
        return result;

    }

    const onDragEnd = (result) => {
        console.log(result);
        const { destination, source, draggableId } = result;
        let droppableSource;
        let droppableDestination;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId &&
            destination.index === source.index) {
            return;
        }

        switch (destination.droppableId) {
            case 'goodAnswerBox':
                droppableDestination = goodBoxList
                break;
            case 'badAnswerBox':
                droppableDestination = badBoxList
                break;
            default:
                droppableDestination = imageList
                break;
        }

        switch (source.droppableId) {
            case 'goodAnswerBox':
                droppableSource = goodBoxList
                break;
            case 'badAnswerBox':
                droppableSource = badBoxList
                break;
            default:
                droppableSource = imageList
                break;
        }

        const resultt = move(droppableSource, droppableDestination, result.source, result.destination)

        switch (destination.droppableId) {
            case 'goodAnswerBox':
                setGoodBoxList(resultt['destination']);
                break;
            case 'badAnswerBox':
                setBadBoxList(resultt['destination']);
                break;
            default:
                setImageList(resultt['destination']);
                break;
        }

        switch (source.droppableId) {
            case 'goodAnswerBox':
                setGoodBoxList(resultt['source']);
                break;
            case 'badAnswerBox':
                setBadBoxList(resultt['source']);
                break;
            default:
                setImageList(resultt['source']);
                break;
        }

    }

    console.log(currentQuestionImages);

    const closeModal = () => {
        setVisible(false);
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div>
                <Modal visible={visible}
                    title="Prises de notes pour l'accueilli"
                    onOk={() => { props.okFeedback(); closeModal() }}
                    onCancel={() => { props.cancelFeedback(); closeModal() }}
                    width="90%"
                    footer={[
                        <Button key="back"
                            onClick={() => { props.cancelFeedback(); closeModal() }}>
                            Annuler
                   </Button>,
                        <Button key="submit"
                            type="primary"
                            onClick={() => { props.okFeedback(); closeModal() }}>
                            Valider
                   </Button>,
                    ]}>
                    <div className="feedbackBoxes">
                        <Droppable droppableId="goodAnswerBox">
                            {(provided, snapshot) => (

                                <div className="goodAnswers" ref={provided.innerRef} {...provided.droppableProps} style={getListStyle(snapshot.isDraggingOver)}>
                                    <p>Bien !</p>
                                    {goodBoxList.map((image, imageIndex) => {
                                        return <Draggable draggableId={image.id} index={imageIndex}>
                                            {(provided) => (
                                                <div {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                > <img src={SERVER_URL + image.src} alt="image" className="draggableImage" />
                                                </div>
                                            )
                                            }
                                        </Draggable>
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}

                        </Droppable>
                        <Droppable droppableId="badAnswerBox">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="badAnswers" style={getListStyle(snapshot.isDraggingOver)}>
                                    <p>À surveiller</p>
                                    {badBoxList.map((image, imageIndex) => {
                                        return <Draggable draggableId={image.id} index={imageIndex}>
                                            {(provided) => (
                                                <div {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                > <img src={SERVER_URL + image.src} alt="image" className="draggableImage" />
                                                </div>
                                            )
                                            }
                                        </Draggable>
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <div className="imageList">
                        <Droppable droppableId="images" direction="horizontal">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} style={getListStyle(snapshot.isDraggingOver)} className="droppableImages">
                                    {imageList.map((image, imageIndex) => {
                                        return <Draggable draggableId={image.id} index={imageIndex}>
                                            {(provided) => (
                                                <div {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                > <img src={SERVER_URL + image.src} alt="image" className="draggableImage" />
                                                </div>
                                            )
                                            }
                                        </Draggable>
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                </Modal >
            </div>
        </DragDropContext>
    );
};

export default AccueilliFeedback;