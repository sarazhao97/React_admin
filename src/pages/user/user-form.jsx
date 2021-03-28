import React, { PureComponent } from 'react';
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
const Item=Form.Item
const Option=Select.Option

/* 添加/修改用户的form组件 */
class UserForm extends PureComponent {
    static propTypes={
        roles:PropTypes.array.isRequired,
        setForm:PropTypes.func.isRequired,
        user:PropTypes.object
    }
    
    componentWillMount(){
        // 将form对象通过setForm()传递给父组件
        this.props.setForm(this.props.form)
    }
    render() { 
        const {roles,user}=this.props
        const {getFieldDecorator}=this.props.form
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
          }
        return (
            <Form {...formItemLayout}>
               
               <Item label='用户名' > 
               {
                getFieldDecorator('username', {
                initialValue: user.username,
                rules: [
                {required: true, message: '用户名称必须输入'}
                ]
             })(
              <Input placeholder='请输入用户名称'/>
                )
                }
                </Item>
               {user._id?null:(
                    <Item label='密码' > 
                    {
                     getFieldDecorator('password', {
                     initialValue: user.password,
                     rules: [
                     {required: true, message: '密码必须输入'}
                     ]
                  })(
                   <Input placeholder='请输入密码'/>
                     )
                     }
                     </Item>
               )}
                <Item label='手机号' > 
               {
                getFieldDecorator('phone', {
                initialValue: user.phone,
               
             })(
              <Input placeholder='请输入手机号'/>
                )
                }
                </Item>
                <Item label='邮箱'> 
               {
                getFieldDecorator('email', {
                initialValue: user.email,
                
             })(
              <Input placeholder='请输入邮箱'/>
                )
                }
                </Item>
                <Item label='角色'>{
                    getFieldDecorator('role_id',{
                        initialValue:user.role_id
                    })
                (<Select>
                    
                   {
                       roles.map(r=><Option value={r._id}>{r.name}</Option>)
                   }
                </Select>)
                    }
                    
                </Item>
            </Form>
        );
    }
}
 
export  default Form.create()(UserForm)