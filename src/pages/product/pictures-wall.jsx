import { Upload, Icon, Modal, message } from 'antd';
import React, { Component } from 'react';
import {reqDeleteImg} from '../../api'
import PropTypes from 'prop-types'
import { BASE_IMG_URL } from '../../utils/constants';
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  static propTypes={
    imgs:PropTypes.array
  }
  
  constructor(props){
    super(props)
   let fileList=[]
    /* 如果传入了imgs属性 */
    const {imgs}=this.props
    if(imgs && imgs.length>0){
      fileList=imgs.map((img,index)=>({
        uid: -index,      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name: img,   // 文件名
        status: 'done', // 状态有：uploading done error removed
        url:BASE_IMG_URL+img
      }))
    }
    // 初始化状态
    this.state={
      previewVisible: false,
      previewImage: '', //大图的url
      fileList  //所有已上传图片的数组
    }
  }

  /* 获取所有已上传图片文件名的数组 */
  getImgs=()=>{
    return this.state.fileList.map(file=>file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  /* 
  file:当前操作的图片文件（上传/删除)
  */
  handleChange = async({ file,fileList }) => {
    console.log('handleChange()',file.status,fileList);

    // 一旦上传成功，将当前上传的file的信息修正（name,url）
    if(file.status==='done'){
      const result=file.response //{status:0,data:{name:'xxx.jpg',url:'图片地址'}}
      if(result.status===0){
        message.success('上传图片成功！')
        const {name,url}=result.data
        file=fileList[fileList.length-1]
        file.name=name
        file.url=url
      }else{
        message.error('上传图片失败！')
      }
    }else if(file.status==='removed'){
     const result=await reqDeleteImg(file.name)
     if(result.status===0){
       message.success('图片删除成功！')
     }else{
       message.error('图片删除失败！')
     }
    }
    // 在操作（上传/删除)过程中更新fileList状态
    this.setState({ fileList })
  };


  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"   //上传图片的接口地址
          listType="picture-card" /* 卡片样式 */
          name='image'  /* 请求参数名 */
          fileList={fileList}   /* 所有已上传图片文件对象的数组 */
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          accept="image/*"
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

