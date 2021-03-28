import React, { Component } from 'react';
import {
    Card,
    Button,
    Modal,
    Table,
    message,
} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {formateDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button';
import { PAGE_SIZE } from '../../utils/constants';
import {reqUserList,reqRemoveUser, reqAddOrUpdateUser} from '../../api'
import UserForm from './user-form'
// 用户路由
class User extends Component {
   state={
       users:[],
       isShow:false,
       roles:[]
   }
   removeUser=(user)=>{
     const {username,_id}=user
     Modal.confirm({
       title:`确认删除${username}吗？`,
       icon: <ExclamationCircleOutlined />,
      
       onOk: async()=> {
         const result=await reqRemoveUser(_id)
         if(result.status===0){
           message.success('删除用户成功！')
           this.getUserList()
         }else{
           message.error('删除用户失败！')
         }
       }
     })
   }

   initColumns=()=>{
    this.columns = [
        {
          title: '用户名',
          dataIndex:'username' //显示数据对应的属性名
        },
        {
            title: '邮箱',
            dataIndex:'email' //显示数据对应的属性名
          },
          {
            title: '电话',
            dataIndex:'phone' //显示数据对应的属性名
          },
          {
            title: '注册时间',
            dataIndex:'create_time', //显示数据对应的属性名
            render:formateDate
          },
          {
            title: '所属角色',
            dataIndex:'role_id', //显示数据对应的属性名
            render:(role_id)=>this.roleNames[role_id]
          },
        {
          title: '操作',
          render:(user)=>(  //返回需要显示的界面标签
              <span>
                  <LinkButton onClick={()=>{this.showUpdate(user)}}>修改</LinkButton>
                  {/* 如何向事件回调函数传递参数：先定义一个匿名函数，在函数中调用处理的函数并传入数据 */}
                 <LinkButton onClick={()=>{this.removeUser(user)}}>删除</LinkButton>
                  
              </span>
          )
        },
       
      ];
}
/* 根据role的数组，生成包含所有角色名的对象，属性名用角色id*/
initRoleNames=(roles=>{
    const roleNames=roles.reduce((pre,role)=>{
        pre[role._id]=role.name
        return pre
    },{})
    this.roleNames=roleNames
})
getUserList=async()=>{
    const result =await reqUserList()
    if(result.status===0){
        const {users,roles}=result.data
        this.initRoleNames(roles)
        this.setState({users,roles})
     
    }
}

/* 添加/更新用户 */
addOrUpdateUser=()=>{
  this.form.validateFields(async(err,values)=>{
    if(!err){
      this.setState({isShow:false})
      const user=values
      this.form.resetFields();
      if(this.user){
        user._id=this.user._id
      }
      const result=await reqAddOrUpdateUser(user)
      if(result.status===0){
        message.success(`${this.user?'修改':'添加'}用户成功！`)
        this.getUserList()
      }
    }
    
  })
  
}
showUpdate=(user)=>{
  this.user=user
  this.setState({isShow:true})
}
showAdd=()=>{
  this.user=null
  this.setState({isShow:true})
}
   componentWillMount(){
    this.initColumns()
}
componentDidMount(){
    this.getUserList()
}
    render() { 
        const {users,isShow,roles}=this.state
        const user=this.user||{}
        const title=<Button type='primary' onClick={this.showAdd}>创建用户</Button>
        return ( 
           <Card title={title}>
                <Table 
            dataSource={users} 
            columns={this.columns}
            bordered
            rowKey='_id'
            pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}
            />;
            <Modal
          title={user._id?'修改用户':'添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={()=>{this.setState({isShow:false}) 
          this.form.resetFields()}}
        >
        <UserForm setForm={(form)=>{this.form=form}} roles={roles} user={user}/>
        
        </Modal>
        
           </Card>
         );
    }
}
 
export default User;