import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SERVER_URL } from '../../constants.js';
import './AccueilliFeedback.css';
const AccueilliFeedback = props => {
    const currentQuestionImages = props.images;
    const selectedAccueilli = props.accueilli
    const [visible, setVisible] = useState(true)
    let imageList = [];
    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? 'lightblue' : '',
    });

    useEffect(() => {
        let index = 1;
        imageList = props.images.map((image) => {
            return {
                id: `${index}`,
                index: index++,
                src: `${image.src}`
            }
        })
        console.log(imageList)

    }, [])

    const onDragEnd = (result) => {
        console.log(result);
        const { destination, source, draggableId } = result;
        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId &&
            destination.index === source.index) {
            return;
        }

        const resultt = Array.from(imageList);
        const [removed] = resultt.splice(source.index, 1);
        resultt.splice(destination.index, 0, removed);

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
                                    {provided.placeholder}
                                </div>
                            )}

                        </Droppable>
                        <Droppable droppableId="badAnswerBox">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="badAnswers" style={getListStyle(snapshot.isDraggingOver)}>
                                    <p>À surveiller</p>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <div className="imageList">
                        <Droppable droppableId="images" direction="horizontal">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} style={getListStyle(snapshot.isDraggingOver)} className="droppableImages">
                                    {imageList.map((image) => {
                                        return <Draggable draggableId={image.id} index={image.index}>
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