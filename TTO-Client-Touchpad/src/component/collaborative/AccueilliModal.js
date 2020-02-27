import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Radio, Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { useSelector } from 'react-redux';
import { SERVER_URL } from '../../constants.js';

const AccueilliModal = props => {

    const [visible, setVisible] = useState(true);
    const accueilliList = useSelector((state) => state.accueilli.accueilliList)
    const closeModal = () => {
        setVisible(false)
    }

    return (
        <Modal visible={visible}
            title="Selectionner un accueilli"
            onOk={props.handleOk}
            onCancel={() => { props.handleCancel(); closeModal() }}
            width="70%"
            footer={[
                <Button key="back"
                    onClick={() => { props.handleCancel(); closeModal() }}>
                    Annuler
                   </Button>,
                <Button key="submit"
                    type="primary"
                    onClick={() => { props.handleOk(); closeModal() }}>
                    Valider
                   </Button>,
            ]}>
            <Radio.Group defaultValue={null} className={'radioGroup'} onChange={(e) => props.onSelectionChange(e)}>
                {accueilliList.item.map((item) => {
                    return <Radio.Button className={'radioBtn'} value={item}>
                        <Card className="littleCard"
                            cover={<img className={'profileImage'} src={SERVER_URL + item.src} />}>
                            <Meta className="metaCard" title={item.firstName} />
                        </Card>
                    </Radio.Button>
                    // return <Radio value={item}>{item.firstName}</Radio>
                })}
            </Radio.Group>
        </Modal >
    );
};


export default AccueilliModal;