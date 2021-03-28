import React, { Component } from 'react';
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
const Item=Form.Item
const Option=Select.Option

class AddForm extends Component {
    static propTypes={
        setForm:PropTypes.func.isRequired
    }
    
    componentWillMount(){
        // 将form对象通过setForm()传递给父组件
        this.props.setForm(this.props.form)
    }
    render() { 
        const {getFieldDecorator}=this.props.form
        const formItemLayout = {
            labelCol: {
           span: 4,
            },
            wrapperCol: {
             span: 20 ,
            },
        };      
        return (
            <Form>
                
               <Item label='角色名称' {...formItemLayout}> 
               {
                getFieldDecorator('roleName', {
                initialValue: '',
                rules: [
                {required: true, message: '角色名称必须输入'}
                ]
             })(
              <Input placeholder='请输入角色名称'/>
                )
                }
                </Item>
            </Form>
        );
    }
}
 
export  default Form.create()(AddForm)