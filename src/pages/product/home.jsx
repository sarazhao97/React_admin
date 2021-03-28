import React, { Component } from 'react';
import {reqProducts,reqSearchProduts,reqUpdateStatus} from '../../api'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message
} from 'antd'
import {PlusOutlined} from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
/* product的默认子路由组件 */
const Option=Select.Option
class ProductHome extends Component {
    state={
        products:[],
        total:0 ,//商品总数量
        loading:false,
        searchName:'',
        searchType:'productName'       //根据哪个字段搜索  productName还是productDesc  默认按照productName
    }
   
    initColumns=()=>{
        this.columns=[
            {
                width:200,
                title: '商品名称',
                dataIndex: 'name',
              },
              {
                title: '商品描述',
                dataIndex: 'desc',
              },
              {
                width:200,
                title: '价格',
                dataIndex:'price',
                render:(price)=>'￥'+price //当前指定了对应的属性，传入的是对应的属性值
              },
              {
                width:100,
                title: '状态',
                // dataIndex: 'status',
                render:(product)=>{
                    const {status,_id}=product
                    const newStatus=status===1? 2 : 1
                    return (
                        <span>
                            <Button type='primary' onClick={()=>this.updateStatus(_id,newStatus)}>{status===1 ? '下架' : '上架'}</Button>
                            <span>{status===1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
              },
              {
                width:100,
                title: '操作',
                render:(product)=>{
                    return (
                        <span>
                            {/* 将product对象使用state传递给目标路由组件 */}
                            <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>详情</LinkButton><br/>
                            <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                        </span>
                    )
                }
              }
        ]
    }
    updateStatus=async(productId,status)=>{
        const result=await reqUpdateStatus(productId,status)
        if(result.status===0){
            message.success('更新商品成功')
           this.getProducts(this.pageNum)
        }
    }
    getProducts=async(pageNum)=>{
        this.pageNum = pageNum // 保存pageNum, 让其它方法可以看到
        this.setState({loading:true})
        const {searchName,searchType}=this.state
        let result
        if(searchName){
          result=await reqSearchProduts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{
             result=await reqProducts(pageNum,PAGE_SIZE)
        }
        this.setState({loading:false})
        if(result.status===0){
            // 取出分页数据，更新状态，显示分页列表
            const {list,total}=result.data
            this.setState({
                products:list,
                total
            })
        }

        
    }
    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getProducts(1)
    }
    render() { 
        // 取出状态数据
        const {products,total,loading,searchName,searchType} =this.state
        const title=(
            <span>
                <Select value={searchType} style={{width:120}} onChange={value=>this.setState({searchType:value})}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{width:150,margin:'0 10px'}} value={searchName}
                onChange={e=>this.setState({searchName:e.target.value})}
                />
                <Button type='primary' onClick={()=>{this.getProducts(1)}}>搜索</Button>
            </span>
        )
        const extra=(
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                 <PlusOutlined />
                添加商品
            </Button>
        )
        
          
         
        return ( 
            <Card title={title} extra={extra}>
            <Table
                bordered
                rowKey='_id'  
                loading={loading}           
                dataSource={products}
                columns={this.columns}
                pagination={{
                    current:this.pageNum,
                    total,
                    defaultPageSize: PAGE_SIZE,
                    showQuickJumper: true,
                    onChange:this.getProducts
          }}
        />
            </Card>
         );
    }
}
 
export default ProductHome;