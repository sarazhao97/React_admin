import React, { Component } from 'react';
import {
    Card,
    Button,
    Table,
    message,
    Modal
} from 'antd'
import { PAGE_SIZE } from '../../utils/constants';
import { reqRoles,reqAddRole,reqUpdateRole } from '../../api';
import AddForm from './add-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import AuthForm from './auth-form'
import {formateDate} from '../../utils/dateUtils'
// 角色路由
class Role extends Component {
    constructor(props){
        super(props)
        this.auth=React.createRef()
    }
    state={
        roles:[], //所有角色列表
        role:{},  //选中的role
        isShowAdd:false, //是否显示添加界面
        isShowAuth:false
    }
    initColumns=()=>{
        this.columns=[
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:(create_time)=>formateDate(create_time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:formateDate
            },
            {
                title:'授权人',
                dataIndex:'auth_name'
            }
        ]
    }
    onRow=(role)=>{
        return {
            onClick:event=>{
              this.setState({
                  role
              })
            }
        }
    }
    getRoles=async()=>{
        const result=await reqRoles()
        if(result.status===0){
            const {data}=result
            this.setState({
                roles:data
            })
        }else{
            message.error('获取角色列表失败！')
        }
    }
    addRole=()=>{
        this.form.validateFields(async(err,values)=>{
           
            if(!err){
                this.setState({
                    isShowAdd:false
                })
                const {roleName}=values
                this.form.resetFields()
                const result =await reqAddRole(roleName)
                if(result.status===0){
                    message.success('添加角色成功！')
                    const role=result.data
                   /*  const roles=[...this.state.roles]
                    roles.push(role)
                    this.setState({
                        roles,
                        isShowAdd:false
                    }) */
                    // 更新roles状态：基于原本状态数据更新
                    this.setState(state=>({
                        roles:[...state.roles,role]
                    }))
                   
                  
                }else{
                    message.error('添加角色失败！')
                }
            }
        }
        )
    
}
        updateRole=async()=>{
            this.setState({isShowAuth:false})
            const role=this.state.role
           const menus= this.auth.current.getMenus()
            role.menus=menus
            role.auth_name=memoryUtils.user.username
            
            const result=await reqUpdateRole(role)
            if(result.status===0){
                
              
                // 如果当前更新的是自己角色的权限，强制退出
                if(role._id===memoryUtils.user.role_id){
                    memoryUtils.user={}
                    storageUtils.removeUser()
                    this.props.history.replace('/login')
                    message.success('当前用户角色权限已修改，请重新登录')
                }else{
                    message.success('设置角色权限成功！')
                    this.setState({
                        roles:[...this.state.roles]
                    })
                }
               
            }
        }

   
    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getRoles()
    }
    render() { 
        const {roles,role,isShowAdd,isShowAuth}=this.state
        const title=(
           <span>
               <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>&nbsp;&nbsp;
               <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>
           </span>
        )
        return ( 
            <Card title={title}>
                <Table
                 dataSource={roles} 
                 columns={this.columns}
                 bordered
                 rowKey='_id'              
                 pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}
                 rowSelection={{
                     type:'radio',
                     selectedRowKeys:[role._id],
                    onSelect:(role)=>{
                        this.setState({
                            role
                        })
                    }
                    }}
                 onRow={this.onRow}
                />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={()=>{this.setState({isShowAdd:false}) 
          this.form.resetFields()}}
        >
          <AddForm setForm={(form)=>{this.form=form}}/>
        
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={()=>{this.setState({isShowAuth:false}) }}
        >
          <AuthForm role={role} ref={this.auth}/>
        
        </Modal>
            </Card>
         );
    }
}
 
export default Role;