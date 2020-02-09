import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import './profile.css'
import {Descriptions,Card, Layout, Menu, Icon, Tabs, Button, Breadcrumb, Checkbox, List} from 'antd';
import '../model';
import {Link,useParams} from "react-router-dom";
import Sidebar from '../sidebar';
import openSocket from 'socket.io-client';


const { Header, Content} = Layout;
const { Meta } = Card;

export default function DetailProfile(props){
    let { id } = useParams();
    let info = null;
    let infoList = [];

    let socket = props.socket;
    console.log(id);
    socket.emit('get profiles');
    socket.on('all profiles',(data)=>{
        infoList = data;
        console.log(infoList);
        infoList.map((e) => {
            if (e.id == id) {
                info = e;
                console.log(info);
            }
        });

    });
    return(
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar default = "3"/>
            <Layout>
                <Header style={{ background: '#fff' }}>
                    <h2>Profile</h2>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item> </Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        <Descriptions title="User Info" bordered>
                            <Descriptions.Item label="Prénom">rrr</Descriptions.Item>
                            <Descriptions.Item label="Nom">rrr</Descriptions.Item>
                            <Descriptions.Item label="Id">{id}</Descriptions.Item>
                            <Descriptions.Item label="Photo">d</Descriptions.Item>
                            <Descriptions.Item label="Quiz accessible">
                                Data disk type: MongoDB
                                <br />
                                Database version: 3.4
                                <br />
                                Package: dds.mongo.mid
                                <br />
                                Storage space: 10 GB
                                <br />
                                Replication factor: 3
                                <br />
                                Region: East China 1<br />
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

