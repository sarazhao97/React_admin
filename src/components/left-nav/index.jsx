import React, { Component } from 'react';
import {Link,withRouter} from 'react-router-dom'
import { Menu ,Icon} from 'antd';
import './index.less'
import  menuList  from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'
import memoryUtils from '../../utils/memoryUtils';

  const { SubMenu } = Menu;

/* 
左侧导航的组件
*/
class LeftNav extends Component {
    /* 
    根据menu的数据数组生成对应的标签数组
    使用map()+递归
    */
    getMenuNodes_map=(menuList)=>{
        return menuList.map(item=>{
            /* {
                title: ' 首页', // 菜单标题名称
                key: '/home', // 对应的 path
                icon: 'home', // 图标名称
                children:[],    //可能有，也可能没有
                } */
                if(!item.children){
                    return (
                        <Menu.Item key={item.key}>
                        <Link to={item.key}>
                          <Icon type={item.icon}/>
                          <span>{item.title}</span>
                        </Link>
                      </Menu.Item>
                    )
                }else{
                    return (
                        <SubMenu
                        key={item.key}
                        title={
                          <span>
                          <Icon type={item.icon}/>
                          <span>{item.title}</span>
                        </span>
                        }
                      >
                        {this.getMenuNodes(item.children)}
                      </SubMenu>
                    )
                }
                    
                    
        })
    }
/* 
1.如果当前用户是admin
2.如果当前item是公开的
3.当前用户有此item的权限：key在不在menus中
*/
    hasAuth=(item)=>{
        const {username}=memoryUtils.user
        const {key,isPublic}=item
        const {menus}=memoryUtils.user.role
        if(username==='admin' || isPublic || menus.indexOf(key)!==-1){
            return true
        }else if(item.children){    //4.如果当前用户有此item的某个子item的权限
           return !!item.children.find(child=>menus.indexOf(child.key)!==-1) //!!作用：强制转换成布尔值，找到了为true，没找到返回false
           
        }
       else{
            return false
        }
    }
        getMenuNodes_reduce=(menuList)=>{
            const path=this.props.location.pathname
            return menuList.reduce((pre,item)=>{
                if(this.hasAuth(item)){
            // 向pre添加<Menu.Item>
            if(!item.children){
                pre.push(
                    (
                        <Menu.Item key={item.key}>
                    <Link to={item.key}>
                    <Icon type={item.icon}/>
                    <span>{item.title}</span>
                    </Link>
                    </Menu.Item>
                    )
                )
            }else{ // 或向pre添加<SubMenu>
                // 查找一个与当前请求路径匹配的子Item
                const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0)
                // 如果存在，说明当前item的子列表需要展开
                if(cItem){
                    this.openKey=item.key
                }
            

                pre.push((
                    <SubMenu
                    key={item.key}
                    title={
                        <span>
                    <Icon type={item.icon}/>
                    <span>{item.title}</span>
                    </span>
                    }
                    >
                    {this. getMenuNodes_reduce(item.children)}
                    </SubMenu>
                ))
            }
                }
                   
                return pre   
            },[])
        }
    
   
  /*   在第一次render（）之前执行一次 
    为第一次render()准备数据（必须同步的）  
  */
    componentWillMount(){
        this.menuNodes=this.getMenuNodes_reduce(menuList)
    }
    render() { 
       
        // 得到当前请求的路由路径
        let path=this.props.location.pathname
        if(path.indexOf('/product')===0){   //当前请求的是商品或其子路由界面
            path='/product'
        }
        // 得到需要打开菜单项的key
        const openKey=this.openKey
        return ( 
            <div className='left-nav'>
               <Link to='/'  className='left-nav-header'>
                <img src={logo} alt="logo"/>
                <h1>硅谷后台</h1>
               </Link>
               <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
               >
        
          {
              this.menuNodes
          }
         
        </Menu>
          
   
            </div>
            
          
            
         );
    }
}
 /* 
    withRouter高阶组件：
    包装非路由组件，返回一个新的组件    
    新的组件向非路由组件传递3个属性：history、location、match
 */
export default withRouter(LeftNav);