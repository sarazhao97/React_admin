import React, { PureComponent } from 'react';
import {Form,Input,Tree } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
const Item=Form.Item
const { TreeNode } = Tree;

class AuthForm extends PureComponent {
   static propTypes={
       role:PropTypes.object
   }
   
   constructor(props){
       super(props)
    // 根据传入角色的menus生成初始状态
       const {menus}=this.props.role
       this.state={
           checkedKeys:menus
       }
   }
   getTreeNodes=(menuList)=>{
    return menuList.reduce((pre,item)=>{

        pre.push( <TreeNode title={item.title} key={item.key}>
            {item.children? this.getTreeNodes(item.children) : null}
        </TreeNode>)
        return pre
    },[])
}

    getMenus=()=>this.state.checkedKeys
    onCheck=(checkedKeys)=>{
        this.setState({
            checkedKeys
        })
    }
    componentWillMount(){
        this.treeNodes=this.getTreeNodes(menuList)
    }
  
    // 根据新传入的role来更新checkedKeys状态
    /* 
    当组件接收到新的属性时自动调用
    */
    componentWillReceiveProps(nextProps){
        const menus=nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
    }
    render() { 
        console.log('render()');
        const role=this.props.role
        const {checkedKeys}=this.state
        const formItemLayout = {
            labelCol: {
           span: 4,
            },
            wrapperCol: {
             span: 20 ,
            },
        };      
        return (
            <div>               
               <Item label='角色名称' {...formItemLayout}> 
              <Input value={role.name} disabled/>
                </Item>
                <Tree
                   checkable
                   defaultExpandAll
                   checkedKeys={checkedKeys}
                   onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        );
    }
}
 
export  default AuthForm