import React from 'react';
import 'antd/dist/antd.css';
import {Form, Input, Icon, Button, Modal, Checkbox} from 'antd';

let id = 0;

class DynamicFieldSet extends React.Component {
    state = {
        visiblePic: false,
        currentRes: 1,
        checkResList: [],
    }
    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const names = form.getFieldValue('names');
        const icons = form.getFieldValue('icons');
        const checks = form.getFieldValue('checks');
        names.splice(k,1);
        icons.splice(k,1);
        checks.splice(k,1);
        console.log(names);
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
            names: names,
            icons: icons,
            checks:checks,
        });

        console.log(this.props.form.getFieldsValue());
    };

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const icons = form.getFieldValue('icons');
        const checks = form.getFieldValue('checks');
        const nextIcons = icons.concat(null);
        const nextChecks = checks.concat(false);
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
            icons: nextIcons,
            checks: nextChecks,
        });
        console.log(this.props.form.getFieldsValue())
    };

    addPic = k => {
        this.setState({
            visiblePic: true,
            currentRes: k,
        });
        console.log(k)
    }

    handleOkPic = k => {
        const values = this.props.form.getFieldsValue();
        let icons = values.icons;
        console.log(icons);
        icons[k]={k};
        this.props.form.setFieldsValue({
            icons: icons,
        });
        this.setState({
            visiblePic: false,
        });
        console.log(this.props.form.getFieldsValue());
    }

    handleCancelPic = () => {
        this.setState({
            visiblePic: false,
        });
    }

    select = (e,k) => {
        const values = this.props.form.getFieldsValue();
        let checks = values.checks;
        console.log(checks);
        checks[k] = e.target.checked;
        this.setState({
            checkResList: checks,
        });
        console.log(this.state.checkResList);
    }



    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                console.log('Received values of form: ', values);
                console.log('Merged values:', keys.map(key => names[key]));
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        getFieldDecorator('icons', { initialValue: [] });
        getFieldDecorator('checks', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? 'Passengers' : ''}
                required={false}
                key={k}
            >
                {getFieldDecorator(`names[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "Please input passenger's name or delete this field.",
                        },
                    ],
                })(<Input placeholder="passenger name" style={{ width: '50%', marginRight: 8 }} />)}
                <Button icon="picture"
                        style={{marginRight:30}}
                        onClick={() => this.addPic(k)}
                         />
                Bonne Résponse
                <Checkbox checked={this.state.checkResList[k]}
                          style={{marginRight:20}}
                          onChange={e => this.select(e,k)}
                          />
                <Modal title="Choisir une image"
                       visible={this.state.visiblePic}
                       onOk={() => this.handleOkPic(this.state.currentRes)}
                       onCancel={this.handleCancelPic}>
                    <p>{k}</p>
                </Modal>
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </Form.Item>
        ));
        return (
            <Form onSubmit={this.handleSubmit}>
                {formItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                        <Icon type="plus" /> Add field
                    </Button>
                </Form.Item>
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);
export default WrappedDynamicFieldSet;
