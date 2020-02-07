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
        tangible: [],
        nonTangible:[],
    };

    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.type = props.type;

        this.socket.emit('get all types quiz');
        this.socket.on('all types quiz',(data) => {
            this.state.individuel= data.individuel;
            this.state.tangible =data.tangible;
            this.state.nontangible =data.nonTangible;
            console.log(data);
            console.log(this.state.individuel);
            console.log(this.state.tangible);
            console.log(this.state.nonTangible);
            this.setState({
                questionList: this.state.questionList.concat(this.state.individuel,this.state.tangible,this.state.nonTangible),
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
