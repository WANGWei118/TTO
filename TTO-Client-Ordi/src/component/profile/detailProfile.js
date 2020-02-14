import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import './profile.css'
import {Descriptions,Card, Layout, Menu, Icon, Tabs, Button, Breadcrumb, Checkbox, List} from 'antd';
import '../model';
import {Link,useParams} from "react-router-dom";
import Sidebar from '../sidebar';
import '../config/config'

import openSocket from 'socket.io-client';


const { Header, Content} = Layout;
const { Meta } = Card;
const url = "http://localhost:10000/";

export default class DetailProfile extends React.Component {
    socket = openSocket;

    state = {
        id:global.constants.profileId,
        infoList:[],
        info: {quizAccessible:{quizIndividuel:[]}},
        individuel: [],
        questions: [],
    };

    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.socket.emit('get profiles');
        this.socket.on('all profiles',(data)=>{
            this.state.infoList = data;
            console.log(this.state.infoList);
            this.state.infoList.map((e) => {
                if (e.id === this.state.id) {
                    this.setState({
                        info:e,
                    });
                    console.log(this.state.info);
                }
            });
        });

        this.socket.emit('get all types quiz');
        this.socket.on('all types quiz',(data) => {
            this.state.individuel = [];
            this.state.questions = [];
            data.personal.map((e)=>{
                this.state.info.quizAccessible.quizIndividuel.map((i)=>{
                    if(e.id === i) {
                        this.setState({
                            individuel: this.state.individuel.concat(e),
                        })
                    }
                });
            });
            this.setState({
                questions: data.collaborative.handsTouch.concat(data.collaborative.handsMove),
            })

            console.log(data);
            console.log(this.state.individuel);
            console.log(this.state.questions);

        });
    }
    render() {
        const info = this.state.info;
        console.log(info);
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
                                <Descriptions.Item label="Prénom">{info.firstName}</Descriptions.Item>
                                <Descriptions.Item label="Nom">{info.lastName}</Descriptions.Item>
                                <Descriptions.Item label="Photo"><img style={{height:100,width:100}} src={url+info.src}/></Descriptions.Item>
                                <Descriptions.Item label="Quiz accessible individuel">
                                    {this.state.individuel.map((e)=>{
                                        return<div style = {{marginBottom:20}}>
                                            <h2>{e.name}</h2>
                                            <List itemLayout="horizontal"
                                                  bordered = "true"
                                                  dataSource={e.questions}
                                                  renderItem={item=>(
                                                      <List.Item>
                                                          <p>{item.description}</p>
                                                      </List.Item>
                                                  )}
                                            />
                                        </div>
                                    })}
                                </Descriptions.Item>
                                <Descriptions.Item label="Quiz accessible collaboratif">
                                    {this.state.questions.map((e)=>{
                                        return<div style = {{marginBottom:20}}>
                                            <h2>{e.name}</h2>
                                            <List itemLayout="horizontal"
                                                  bordered = "true"
                                                  dataSource={e.questions}
                                                  renderItem={item=>(
                                                      <List.Item>
                                                          <p>{item.description}</p>
                                                      </List.Item>
                                                  )}
                                            />
                                        </div>
                                    })}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }

}


