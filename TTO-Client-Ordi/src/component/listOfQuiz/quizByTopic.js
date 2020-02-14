import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import {Layout, Menu, Icon, Tabs, List,Breadcrumb, Button, Input, Card} from 'antd';
import {Link} from "react-router-dom";
import openSocket from 'socket.io-client';
import Sidebar from '../sidebar';
import DetailQuiz from "../listOfQuiz/detailQuiz";
import '../config/config'

const { Header, Content, Footer,Sider } = Layout;
const { TabPane } = Tabs;
const { Search } = Input;
const url = "http://192.168.182.29:10000/";
const { Meta } = Card;


class QuizByTopic extends React.Component {
    socket = openSocket;

    state = {
        collapsed: false,
        topicList:[],
    };

    constructor(props) {
        super(props);

        this.socket = props.socket;

        console.log(global.constants.topicId);
        this.socket.emit("get topic by id",global.constants.topicId);

        this.socket.emit("get topics");
        this.socket.on("all topics",(data)=>{
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

            this.socket.on("topic by id",(data)=>{
                console.log(data);
            });
            console.log(this.state.topicList);
        });
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    renderInput2() {
        if (this.state.visible2){
            console.log('render');
            return (
                <Search
                    className = "input"
                    placeholder="Enter name of list"
                    enterButton="Ok"
                    onSearch={value => {
                        console.log(value);
                    }}
                />
            );
        }
    }

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
                            wwwww
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default QuizByTopic;
