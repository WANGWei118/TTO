import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Modal, Radio, Icon } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import './SelectAccueilli.css'
import HeaderComponent from './HeaderComponent'
import RadioGroup from 'antd/lib/radio/group'
import RadioButton from 'antd/lib/radio/radioButton'

const { Meta } = Card
const url = 'http://localhost:10000/'

const SelectAccueilli = props => {

  const socket = props.socket

  const dispatch = useDispatch()
  const accueilliSelected = useSelector((state) => state.accueilli.accueilliSelected)
  const accueilliList = useSelector((state) => state.accueilli.accueilliList)
  const [tempSelectedAccueilli, setTempSelectedAccueilli] = useState(undefined)
  const [visible, setVisible] = useState(false)

  const handleCancel = () => {
    setVisible(false)
  }

  const handleOk = () => {
    if (tempSelectedAccueilli) {
      dispatch({ type: 'select_accueilli', accueilliSelected: { tempSelectedAccueilli } })
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
        cover={<img src={url + accueilliSelected.tempSelectedAccueilli.src} />}
        onClick={() => showModal()}>
        <Meta className="metaCard" title={accueilliSelected.tempSelectedAccueilli.firstName} />
      </Card>
    )
  }

  const onSelectionChange = (event) => {
    setTempSelectedAccueilli(event.target.value)
  }

  const removeSelectedAccueilli = () => {
    dispatch({ type: 'select_accueilli', accueilli: null })
    setTempSelectedAccueilli(null)
  }

  useEffect(() => {
    socket.on('all profiles', (item) => {
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
          {accueilliSelected === null || accueilliSelected === undefined ? defaultCard() : fullCard()}

        </div>
        {accueilliList === null || accueilliList === undefined ?
          <></> :
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
                    cover={<img className={'profileImage'} src={url + item.src} />}><Meta
                      className="metaCard" title={item.firstName} /> </Card>
                </Radio.Button>
                // return <Radio value={item}>{item.firstName}</Radio>
              })}
            </Radio.Group>
          </Modal>}
        <div className="accueilliCard"><Icon type="close-square" theme="twoTone" twoToneColor="red"
          style={{ fontSize: '50px' }} onClick={removeSelectedAccueilli} /></div>
      </div>
      <div className="selectAccueilliConfirmButton">
        <Button className="confirmAccueilliButton" type="primary"><Link className="confirmAccueilliLink"
          to="themes">Confirmer</Link></Button>
      </div>
    </>
  )
}

SelectAccueilli.propTypes = {}

export default SelectAccueilli
