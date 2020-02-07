import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Modal, Radio } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import './SelectAccueilli.css'
import HeaderComponent from './HeaderComponent'
import RadioGroup from 'antd/lib/radio/group'
import RadioButton from 'antd/lib/radio/radioButton'

const { Meta } = Card

const SelectAccueilli = props => {

    const socket = props.socket

    const dispatch = useDispatch()
    const selectedAccueilli = useSelector((state) => state.selected)
    const accueilliList = useSelector((state) => state.accueilliList)
    const [tempSelectedAccueilli, setTempSelectedAccueilli] = useState(undefined)
    const [visible, setVisible] = useState(false)

    const handleCancel = () => {
        console.log('cancel')
        setVisible(false)
    }

    const handleOk = () => {
        console.log(tempSelectedAccueilli)
        if (tempSelectedAccueilli) {
            dispatch({ type: 'select_accueilli', accueilli: { tempSelectedAccueilli } })
        }
        setVisible(false)
    }

    const showModal = () => {
        setVisible(true)
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
        setTempSelectedAccueilli(event.target.value)
    }

    useEffect(() => {
        socket.on('all profiles', (item) => {
            console.log('All profiles')
            console.log(item)
            dispatch({ type: 'list_accueilli', accueilliList: { item } })
        })
        socket.emit('get profiles')

        return () => {
            socket.off('all profiles')
        }
    }, [])

    return (
        <>
            <HeaderComponent title="Selectionner l'accueilli qui va jouer" />
            <div className="accueilliSelectionDiv">
                <div className="accueilliCard">
                    {selectedAccueilli === null || selectedAccueilli === undefined ? defaultCard() : fullCard()}
                </div>
                {accueilliList === null || accueilliList === undefined ?
                    <div>ok</div> :
                    <Modal visible={visible}
                        title="Selectionner un accueilli"
                        onOk={handleOk}
                        onCancel={handleCancel}
                        width="70%"
                        footer={[
                            <Button key="back"
                                onClick={handleCancel}>
                                Annuler
                   </Button>,
                            <Button key="submit"
                                type="primary"
                                onClick={handleOk}>
                                Valider
                   </Button>,
                        ]}>
                        <Radio.Group defaultValue={null} className={'radioGroup'} onChange={(e) => onSelectionChange(e)}>
                            {accueilliList.item.map((item) => {
                                return <Radio.Button className={'radioBtn'} value={item}>
                                    <Card className="littleCard"
                                        cover={<img className={'profileImage'} src={item.src} />}><Meta
                                            className="metaCard" title={item.firstName} /> </Card>
                                </Radio.Button>
                                // return <Radio value={item}>{item.firstName}</Radio>
                            })}

                        </Radio.Group>
                    </Modal>}

            </div>
            <div className="selectAccueilliConfirmButton">
                <Button type="primary"><Link to="quiz">Confirmer</Link></Button>
            </div>
        </>
    )
}

SelectAccueilli.propTypes = {}

export default SelectAccueilli
