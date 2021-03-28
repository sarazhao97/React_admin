/* 
要求：能根据接口文档定义接口请求函数
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/
import { message } from 'antd'
import jsonp from 'jsonp'
import ajax from './ajax'
const BASE=''
// 登陆
export const reqLogin=(username,password)=>ajax(BASE+'/login',{username,password},'POST')
// 添加用户
export const reqAddUser=(user)=>ajax(BASE+'/manage/user/add',user,'POST')
// 获取一级或某个二级分类列表
export const reqCategorys=(parentId)=>ajax(BASE+'/manage/category/list',{parentId})
// 添加分类
export const reqAddCategory=(parentId,categoryName)=>ajax(BASE+'/manage/category/add',{parentId,categoryName},'POST')
// 更新品类名称
export const reqUpdateCategorys=({categoryId,categoryName})=>ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')

/* json请求的接口请求函数 */
export const reqWeather=(city)=>{
    return new Promise((resolve,reject)=>{
        const url=`http://wthrcdn.etouch.cn/weather_mini?city=${city}`
        jsonp(url,{},(err,data)=>{
            console.log('jsonp()',err,data);
            if(!err&&data.status===1000){
             const {type}= data.data.forecast[0]
             const {ganmao}=data.data
             resolve({type,ganmao})
             console.log('ganmao:',ganmao);
            }else{
                // 失败
                message.error('获取天气信息失败')
            }
            
        })
    })
    
}

/* 获取商品分页列表 */
export const reqProducts=(pageNum,pageSize)=>ajax(BASE+'/manage/product/list',{pageNum,pageSize})

/* 搜索商品分页列表(根据商品名称/商品描述) */
export const reqSearchProduts=({pageNum,pageSize,searchName,searchType})=>ajax(BASE+'/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})

/* 根据分类ID获取分类 */
export const reqCategory=(categoryId)=>ajax(BASE+'/manage/category/info',{categoryId})

/*  对商品进行上架/下架处理 */
export const reqUpdateStatus=(productId,status)=>ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')

/* 删除图片 */
export const reqDeleteImg=(name)=>ajax(BASE+'/manage/img/delete',{name},'POST')

/*  添加/修改商品*/
export const reqAddOrUpdateProduct=(product)=>ajax(BASE+'/manage/product/'+(product._id?'update':'add'),product,'POST')

/* 获取角色列表 */
export const reqRoles=()=>ajax(BASE+'/manage/role/list')

/* 添加角色 */
export const reqAddRole=(roleName)=>ajax(BASE+'/manage/role/add',{roleName},'POST')

/* 给角色设置权限 */
export const reqUpdateRole=(role)=>ajax(BASE+'/manage/role/update',role,'POST')

/* 获取所有用户列表 */
export const reqUserList=()=>ajax(BASE+'/manage/user/list')

/* 删除用户 */
export const reqRemoveUser=(userId)=>ajax(BASE+'/manage/user/delete',{userId},'POST')

/* 更新/添加用户 */
export const reqAddOrUpdateUser=(user)=>ajax(BASE+'/manage/user/'+(user._id?'update':'add'),user,'POST')