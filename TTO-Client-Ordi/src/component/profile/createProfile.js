import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import './profile.css'
import {Card, Layout, Menu, Icon, Tabs, Button, Tooltip,
    Breadcrumb, Checkbox, List, Upload, Modal, Input, message} from 'antd';
import '../model';
import {Link} from "react-router-dom";
import Sidebar from '../sidebar';
import openSocket from 'socket.io-client';
import $ from 'jquery';

const { Header, Content, Footer} = Layout;
const { Meta } = Card;
const url = 'http://192.168.182.29:10001/';
const CheckboxGroup = Checkbox.Group;

function getBase64 (img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}
function beforeUpload (file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!')
    }
    // const isLt2M = file.size / 1024 / 1024 < 2
    // if (!isLt2M) {
    //     message.error('Image must smaller than 2MB!')
    // }
    return isJpgOrPng
}

class CreateProfile extends React.Component {
    socket = openSocket;

    state = {
        visible: false,
        lastName: null,
        firstName: null,
        infoList: [],
        id: 0,
        image: null,
        quizList: [],
        loading: false,
        checkedQuiz: [],
    };

    constructor(props) {
        super(props);
        this.socket = props.socket;

        this.socket.emit('get profiles');
        this.socket.on('all profiles',(data) => {
            this.state.infoList = data;
            this.state.id = data.length + 1;
            console.log(this.state.infoList);
            console.log(this.state.id);
        });

        this.socket.emit('get quizz','pad');
        this.socket.on('personal quiz',(data) => {
            this.setState({
                quizList: data,
            });
            console.log(this.state.quizList);
        });
    };
    showModal = () => {
        this.setState({
            visible: true,
        })
    };

    handleOk = () => {
        this.setState({
            visible:false,
        })
    };

    onChange = e => {
        this.setState({
            checkedQuiz: e,
        })
        console.log(this.state.checkedQuiz);
    };

    onChangeLastName = e => {
        this.setState({
            lastName:e.target.value,
        });
    };

    onChangeFirstName = e => {
        this.setState({
            firstName:e.target.value,
        });
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>{
                this.setState({
                    imageUrl,
                    loading: false,
                    image: "profiles/".concat(info.file.originFileObj.name),
                });

                console.log(this.state.image);
            });
            this.sendImage(info);
        }
    };

    sendImage = info => {
        const image = info.file.originFileObj;

        console.log(image);
        let myForm = new FormData();
        myForm.append('name', 'testUpload');
        myForm.append('userfile', image);

        // var myPhoto = $('#img-upload')[0].files[0];
        // var oMyForm = new FormData();
        // oMyForm.append("name", 'crazyJiaLin');
        // oMyForm.append("userfile", myPhoto);
        $.ajax({
            type: 'POST',
            url: url+'profileUpload',
            cache: false,  //不需要缓存
            processData: false,    //不需要进行数据转换
            contentType: false, //默认数据传输方式是application,改为false，编程multipart
            data: myForm,
            dataType: 'json'
        }).done(function (data) {
            console.log(data);
        }).fail(function (err) {
            console.error(err)
        })
    };

    sendNewProfile = () => {
        let newProfile = {
            id: this.state.id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            src: this.state.image,
            quizAccessible: {
                quizIndividuel: this.state.checkedQuiz,
            }
        }
        this.socket.emit("add profile",newProfile);
        console.log(newProfile);
    };


    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const {imageUrl} = this.state;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar default = "3"/>
                <Layout>
                    <Header style={{ background: '#fff' , display:'flex', flexDirection: 'row'}}>
                        <h2>Create un Profile</h2>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item> </Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <div style={{display:'flex', flexDirection:'row'}}><div style={{ marginRight:20}}>Image:</div>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}>
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
                            </div>
                            <Input style = {{width:400, marginBottom:20,marginRight:20}}
                                   addonBefore= 'Nom '
                                   prefix={<p style={{color:'red'}}>*</p>}
                                   allowClear = 'true'
                                   value={this.state.lastName}
                                   onChange = {e=>this.onChangeLastName(e)}
                            />
                            <Input style = {{width:400, marginBottom:20}}
                                   addonBefore= 'Prénom '
                                   prefix={<p style={{color:'red'}}>*</p>}
                                   allowClear = 'true'
                                   value={this.state.firstName}
                                   onChange = {e=>this.onChangeFirstName(e)}
                            />
                            <h2>Ajouter des quiz disponibles pour l'acceuilli</h2>
                            <div className="cardContainer">
                            <Checkbox.Group style={{ width: '100%', display:'flex',flexDirection:'row',flexWrap:'wrap'}} onChange={this.onChange}>
                                {this.state.quizList.map((item)=>{
                                    return <div  className="selectQuizCard">
                                        <Tooltip title={item.questions[0].description}>
                                        <img src={url+item.src} className="quizIcon"/>
                                        <p>{item.name}</p>
                                        <Checkbox value={item.id}/>
                                        </Tooltip>
                                    </div>
                                        })}
                            </Checkbox.Group>
                            </div>

                        </div>
                    </Content>
                    <Footer style={{display:'flex', justifyContent:'center'}}>
                        <Button style={{marginBottom:100}} type='primary' onClick={this.sendNewProfile}>Terminer</Button>
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}
export default CreateProfile;
