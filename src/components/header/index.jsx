import React, { Component } from 'react';
import './index.less'
import {withRouter} from 'react-router-dom'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import {reqWeather}  from '../../api'
import { Modal} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from '../link-button';
class Header extends Component {
    state={
        currentTime:formateDate(Date.now()),    //当前时间字符
        type:'', //天气的文本
        ganmao:''
    }

    getTime=()=>{

        this.intervalId=setInterval(()=>{
            const currentTime=formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getWeather=async()=>{
        // 调用接口请求异步获取数据
       const {type,ganmao}= await reqWeather('洛阳')
       this.setState({
           type,
           ganmao
       })
    }
    getTitle=()=>{
        // 得到当前请求路径
      const path= this.props.location.pathname
      let title
      menuList.forEach(item=>{
          if(item.key===path){  //如果当前item对象的key与path一样，item的title就是需要显示的title
             title=item.title
          }else if(item.children){
           const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0)
           if(cItem){
               title=cItem.title
           }
          }
      })
    return title
    }
    logout=()=>{
        // 显示确认框
        Modal.confirm(
            {
                title: '确定要退出登录吗?',
                icon: <ExclamationCircleOutlined />,
                content: '',
                onOk:()=> {
                    // 删除保存的user数据
                    storageUtils.removeUser()
                    memoryUtils.user={}
                    this.props.history.replace('/login')
                }
              }
        )
    }
    // 第一次render（）之后执行一次，一般在此进行异步操作：发ajax请求/启动定时器
    componentDidMount(){
        this.getTime()
        this.getWeather()
        
    }
    /* 
    在当前组件卸载之前
    */
    componentWillUnmount(){
        clearInterval(this.intervalId)
    }
    render() { 
        const {currentTime,type,ganmao}=this.state
        const username=memoryUtils.user.username
        const title=this.getTitle()
        return ( 
            <div className='header'>
                <div className="header-top">
                    <span>欢迎,{username}</span>
                    <LinkButton href="javascript:;" onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <span>{type}</span>
                        <span><strong>温馨提示</strong>：{ganmao}</span>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default withRouter(Header);