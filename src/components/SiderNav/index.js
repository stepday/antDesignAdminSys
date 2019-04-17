import React from 'react'
import CustomMenu from "../CustomMenu/index";

const menus = [
  {
    title: '平台首页',
    icon: 'home',
    key: '/home'
  },
  {
    title:"销售方案管理",
    icon:"desktop",
    key:"/home/sale"
  },
  {
    title:"商户管理",
    icon:"desktop",
    key:"/home/contact"
  },
  {
    title:"系统设置",
    icon:"tool",
    key:"/home/sys",
    subs:[{
      title:"字段库管理",
      icon:'',
      key:"/home/sys/field"
    },{
      title:"数据字典管理",
      icon:'',
      key:"/home/sys/dictionary"
    }]
  },
  {
    title: '关于',
    icon: 'info-circle-o',
    key: '/home/about'
  }
]


class SiderNav extends React.Component {
  render() {

    return (
      <div style={{height: '100vh',overflowY:'scroll'}}>
        {/* logo  */}
        <div style={styles.logo}><img className="img-main-logo" style={styles.img} src={require('../../assets/img/main-logo.png')} alt=""/></div>
        <CustomMenu menus={menus}/>
      </div>
    )
  }
}

const styles = {
  logo: {    
    width:'180px'
  },
  img:{
    height:'100%',
    width:'100%',
    marginLeft:'10px'
  }
}

export default SiderNav