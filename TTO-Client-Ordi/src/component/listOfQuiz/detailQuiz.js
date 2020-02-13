import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import './createQuiz.css'
import {Skeleton,List,Avatar, Card,Collapse, Layout} from 'antd';
import Theme from "../homepage/theme";
import '../model';
import {Link} from "react-router-dom";
import openSocket from 'socket.io-client';

const { Header, Content, Footer, Sider} = Layout;
const { Panel } = Collapse;


class DetailQuiz extends React.Component {
    socket = openSocket;
    panelList = [];
    alldata = [];
    state = {
        collapsed: false,
        visible: false,
        checkedList: [],
        questionList: [],
        individuel: [],
        handsTouch: [],
        handsMove:[],
    };

    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.type = props.type;

        this.socket.emit('get all types quiz');
        this.socket.on('all types quiz',(data) => {
            this.state.individuel= data.personal;
            this.state.handsTouch =data.collaborative.handsTouch;
            this.state.handsMove =data.collaborative.handsMove;
            console.log(data);
            console.log(this.state.individuel);
            console.log(this.state.handsTouch);
            console.log(this.state.handsMove);
            this.setState({
                questionList: this.state.questionList.concat(this.state.individuel,this.state.handsTouch,this.state.handsMove),
            });
            console.log(this.state.questionList);
        });

    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };


    render() {
        return (
            <List
                itemLayout="horizontal"
                dataSource={this.state.questionList}
                renderItem={item => (
                    <List.Item
                        actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={item.name}
                            description={item.topic}
                        />
                    </List.Item>
                )}
            />
        );
    }
}
export default DetailQuiz;
