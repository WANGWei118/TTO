import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './SelectAccueilli.css';
import HeaderComponent from './HeaderComponent';
import RadioGroup from 'antd/lib/radio/group';
import RadioButton from 'antd/lib/radio/radioButton';
import Radio from 'antd/lib/radio/radio'

const { Meta } = Card;

const SelectAccueilli = props => {

    const socket = props.socket;

    const dispatch = useDispatch();
    const selectedAccueilli = useSelector((state) => state.selected)
    const accueilliList = useSelector((state) => state.accueilliList)
    const [tempSelectedAccueilli, setTempSelectedAccueilli] = useState(undefined);
    const [visible, setVisible] = useState(false);


    const handleCancel = () => {
        console.log("cancel")
        setVisible(false)
    }

    const handleOk = () => {
        console.log(tempSelectedAccueilli);
        if (tempSelectedAccueilli) {
            dispatch({ type: "select_accueilli", accueilli: { tempSelectedAccueilli } })
        }
        setVisible(false)
    }

    const showModal = () => {
        setVisible(true);
    }

    const defaultCard = () => {
        return (
            <Card hoverable
                onClick={() => showModal()}
                cover={<img src="https://institutducontenu.com/wp-content/uploads/2015/07/buyer-persona-1.jpg" />}>
                <Meta className="metaCard" description="Appuyer pour selectionner un joueur !" />
            </Card>
        )
    }

    const fullCard = () => {
        return (
            <Card hoverable
                cover={<img src={selectedAccueilli.tempSelectedAccueilli.src} />}
                onClick={() => showModal()}>
                <Meta className="metaCard" title={selectedAccueilli.tempSelectedAccueilli.firstName} />
            </Card>
        )
    }

    const onSelectionChange = (event) => {
        setTempSelectedAccueilli(event.target.value);
    }

    useEffect(() => {
        socket.on('all profiles', (item) => {
            console.log("All profiles")
            console.log(item)
            dispatch({ type: "list_accueilli", accueilliList: { item } })
        })
        socket.emit('get profiles');

        return () => {
            socket.off('all profiles');
        }
    }, [])

    const radioStyle = {
        display: 'inline-block',
        height: '100%',
        width: '30%',
        textDecoration: 'none',
        height: '100%',
        marginRight: '3%',
        marginBottom: '5%'

    };

    return (

        <>
            <HeaderComponent title="Selectionner l'accueilli qui va jouer" />
            <div className="accueilliSelectionDiv">
                <div className="accueilliCard">
                    {selectedAccueilli === null || selectedAccueilli === undefined ? defaultCard() : fullCard()}
                </div>
                {/* <div className="accueilliCard">
                    <Button onClick={showModal} type="primary">Choisir un accueilli</Button>
                </div> */}
                {accueilliList === null || accueilliList === undefined ? <div>ok</div> : <Modal visible={visible}
                    title="Selectionner un accueilli"
                    onOk={handleOk}
                    onCancel={handleCancel}
                    width="70%"
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Annuler
    </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            Valider
    </Button>,
                    ]}>
                    <RadioGroup onChange={(e) => onSelectionChange(e)}>
                        {accueilliList.item.map((item) => {
                            return <RadioButton style={radioStyle} value={item}><Card className="littleCard" cover={<img src={item.src} />} ><Meta className="metaCard" title={item.firstName} /> </Card></RadioButton>
                            // return <Radio value={item}>{item.firstName}</Radio>
                        })}

                    </RadioGroup>
                </Modal>}

            </div>
            <div className="selectAccueilliConfirmButton">
                <Button className='confirmButtonAccueilli' type="primary"><Link to="quiz">Confirmer</Link></Button>
            </div>
        </>
    );
};

SelectAccueilli.propTypes = {

};

export default SelectAccueilli; 