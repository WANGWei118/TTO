import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import {Layout, Menu, Icon, Tabs, List,Breadcrumb, Button, Input, Card} from 'antd';
import Theme from "./theme";
import {Link} from "react-router-dom";
import openSocket from 'socket.io-client';
import Sidebar from '../sidebar';
import DetailQuiz from "../listOfQuiz/detailQuiz";
import '../config/config'

const url = global.constants.url;
const { Header, Content, Footer,Sider } = Layout;
const { TabPane } = Tabs;
const { Search } = Input;
const { Meta } = Card;


class Homepage extends React.Component {
    socket = openSocket;

    state = {
        collapsed: false,
        topicList:[],
    };

    constructor(props) {
        super(props);
        this.socket = props.socket;

        this.socket.emit("get topics");
        this.socket.on("all topics",(data)=>{
            this.state.topicList=[];
            // let topic = data;
            // topic.map((e)=>{
            //     this.setState({
            //         topicList: this.state.topicList.concat(e.topic),
            //     });
            // });
            // this.state.topicList=this.state.topicList.concat(data);
            this.setState({
                topicList:data,
            })

            console.log(this.state.topicList);
        });
    };

    showDetail = (i,e) =>{
        global.constants.topicId = e.id;
        console.log(global.constants.topicId);
    };


    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar default = "1"/>
                {/*<Theme socket={this.socket}/>*/}
                <Layout>
                    <Header style={{ background: '#fff' }}>
                        <h2>Liste de quiz</h2>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item> </Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <Tabs defaultActiveKey="1">
                                <TabPane
                                    tab={
                                        <span>
                                        <Icon type="database" />Thèmes
                                    </span>
                                    }
                                    key="1">
                                    <Layout style={{ background: '#fff', minHeight: 450, flexDirection: 'column', }}>
                                        <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
                                            {this.state.topicList.map((item)=>{

                                                    return <Card onClick={(i)=>this.showDetail(i,item)} style={{height:180,width:'20%',margin:10}}
                                                           cover={<img alt="photo"
                                                                       src={url+item.icon}
                                                                       style={{height:120,width:'100%',objectFit:'contain'}}
                                                           />}
                                                    >
                                                        <Link to="/quizByTopic"><Meta title={item.topic} />
                                                        </Link></Card>
                                        })}</div>
                                        <Button style={{height:180,width:'20%',margin:10,verticalAlign:'middle',textAlign:'center',fontSize:48}}>
                                            <Link to="/newTheme">+</Link></Button>

                                    </Layout>
                                </TabPane>
                                <TabPane
                                    tab={
                                        <span>
                                            <Icon type="ordered-list" />Tous les quiz
                                    </span>
                                    }
                                    key="2">
                                    <Layout style={{ background: '#fff', minHeight: 360, }}>
                                        <Button type='primary' style = {{fontSize:20,marginBottom:10}} size='large'><Link to="/createQuiz">+ Créer nouveau quiz</Link></Button>
                                        <DetailQuiz socket={this.socket}/>
                                    </Layout>
                                </TabPane>
                            </Tabs>,
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default Homepage;
