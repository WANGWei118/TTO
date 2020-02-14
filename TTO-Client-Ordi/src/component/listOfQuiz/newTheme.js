import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import {
    Layout,
    Menu,
    Icon,
    Tabs,
    Button,
    Breadcrumb,
    Modal,
    Checkbox,
    Upload,
    message,
    Input,
    notification
} from 'antd';
import Theme from "../homepage/theme";
import '../model';
import {Link} from "react-router-dom";
import openSocket from 'socket.io-client';
import Sidebar from '../sidebar';
import $ from "jquery";
import '../config/config'

const url = global.constants.url;
const { Header, Content, Footer, Sider} = Layout;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Quiz 1', 'Quiz2'];

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
class NewTheme extends React.Component {
    socket = openSocket;
    state = {
        collapsed: false,
        visible: false,
        checkedList: [],
        name: null,
        image: null,
        id:0,
        loading: false,
    };

    constructor(props) {
        super(props);
        this.socket = props.socket;

        this.socket.emit('get topics');
        this.socket.on('all topics',(data) => {
            this.setState({
                topicList:data,
                id: data.length + 1,
            });
            console.log(this.state.id);

        });
        this.socket.on('topic added',(type) =>{
            if (type.type === true){
                notification['success']({
                    message: 'Thème créé avec succès ',
                });
                this.setState({
                    name: '',
                    imageUrl: null,
                    image: null,
                    checkedQuiz:[],
                });
            }
        });
    };
    onChange = checkedList => {
        this.setState({
            checkedList,
        });
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    onChangeName = e => {
        this.setState({
            name:e.target.value,
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
                    image: "topics/".concat(info.file.originFileObj.name),
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
            url: url+'topicUpload',
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

    sendNewTopic = () => {
        let newTopic = {
            id: this.state.id,
            topic: this.state.name,
            icon: this.state.image,
            quiz: {
                personalQuiz: [],
                tableQuiz:[],
            },
        };
        this.socket.emit("add topic", newTopic);
        console.log(newTopic);
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
                <Sidebar default = "1"/>
                <Layout>
                    <Header style={{ background: '#fff' }}>
                        <h2>Nouveau Theme</h2>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item> </Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
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
                            <Input style = {{width:400, marginBottom:20,marginRight:20}}
                                   addonBefore= 'Nom '
                                   prefix={<p style={{color:'red'}}>*</p>}
                                   allowClear = 'true'
                                   value={this.state.name}
                                   onChange = {e=>this.onChangeName(e)}
                            />
                            {/*<Modal*/}
                                {/*title="Choisir le quiz"*/}
                                {/*visible={this.state.visible}*/}
                                {/*onOk={this.handleOk}*/}
                                {/*onCancel={this.handleCancel}*/}
                            {/*>*/}
                                {/*<CheckboxGroup*/}
                                    {/*options={plainOptions}*/}
                                    {/*value={this.state.checkedList}*/}
                                    {/*onChange={this.onChange}*/}
                                {/*/>*/}
                            {/*</Modal>*/}
                        </div>
                    </Content>
                    <Footer style={{display:'flex', justifyContent:'center'}}>
                        <Button style={{marginBottom:100}} type='primary' onClick={this.sendNewTopic}>Terminer</Button>
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}
export default NewTheme;
