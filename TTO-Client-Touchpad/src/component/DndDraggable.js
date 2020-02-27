import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd'

const DndDraggable = props => {
    const ItemType = {
        KNIGHT: "KNIGHT",
    }

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemType.KNIGHT },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                fontSize: 50,
                fontWeight: 'bold',
                cursor: 'move',
            }}
        >
            Ceci est un texte
        </div>
    )
}

export default DndDraggable;