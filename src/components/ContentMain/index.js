import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
import LoadableComponent from '../../utils/LoadableComponent'
import PrivateRoute from '../PrivateRoute'

const Home = LoadableComponent(()=>import('../../routes/Home/index'))  //参数一定要是函数，否则不会懒加载，只会代码拆分

//销售商品管理
const Sale = LoadableComponent(()=>import('../../routes/Sale/index'))

//商户管理
const Contact = LoadableComponent(() => import('../../routes/Contact/index'))

//系统设置
//字段库管理
const Field = LoadableComponent(()=>import('../../routes/Sys/Field/index'))
//数据字典管理
const Dictionary = LoadableComponent(()=>import('../../routes/Sys/Dictionary/index'))

//关于
const About = LoadableComponent(()=>import('../../routes/About/index'))

@withRouter
class ContentMain extends React.Component {
  render () {
    return (
      <div style={{padding: 16, position: 'relative'}}>
        <Switch>
          <PrivateRoute exact path='/home' component={Home}/>

          <PrivateRoute exact path='/home/sale' component={Sale}/>

          <PrivateRoute exact path='/home/sys/field' component={Field}/>

          <PrivateRoute exact path='/home/sys/dictionary' component={Dictionary}/>

          <PrivateRoute exact path='/home/contact' component={About}/>

          <Redirect exact from='/' to='/home'/>
        </Switch>
      </div>
    )
  }
}

export default ContentMain