import React from 'react'
import { randomNum, calculateWidth } from '../../utils/utils'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'
import { Form, Input, Row, Col, message, Checkbox } from 'antd'
import { tools } from '../../utils/tools'


@withRouter @inject('appStore') @observer @Form.create()
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.setRemeber = this.setRemeber.bind(this);
  }
  state = {
    focusItem: -1,   //保存当前聚焦的input  
    remember: false, //是否记住用户名
    username: '' //用户名  
  }

  componentDidMount() {    
    //初始化完成后进行 查看缓存是否标记了记住用户名
    if (localStorage.getItem("remember") && localStorage.getItem("uname")) {
      this.setState({
        username: localStorage.getItem("uname"),
        remember:true
      });
    }
  }

  /**
   * 是否记住用户名
   */
  setRemeber(e) {
    this.setState({
      remember: e.nativeEvent.target.checked
    });
  }

  /**
   * 登录
   */
  loginSubmit = (e) => {
    e.preventDefault()
    this.setState({
      focusItem: -1
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
								
        //ajax 提交登录
        tools.$ajax({
          url: "/manage/user/login",
          type: "post",
          data: {            
						username:values.username,
						password:values.password
          }
        }, function (json) {					
          if (json.r == 1) {
            message.success("登录成功");
						localStorage.setItem("uname", json.data.uname);
						
            if (this.state.remember) {
              localStorage.setItem("remember", 1);              
            } else {
              localStorage.setItem("remember", 0);
              localStorage.removeItem("uname");
            }
            this.props.appStore.toggleLogin(true, { info: json.data })

            const { from } = this.props.location.state || { from: { pathname: '/' } }
            this.props.history.push(from)
          } else {
            message.errror(json.msg);
          }
        }.bind(this));
      }
    })
  }
  register = () => {
    this.props.switchShowBox('register')
    setTimeout(() => this.props.form.resetFields(), 500)
  }

  render() {
    const { getFieldDecorator, getFieldError } = this.props.form
    const { focusItem, code } = this.state
    return (
      <div className="g-login-box">
        <div className="g-back-box">
          <img className="img-sloga" src={require('../../assets/img/login/img-sloga.png')} />
        </div>
        <div className="g-login-form-box">
          <img className="img-logo" src={require('../../assets/img/login/img-logo.png')} />
          <img className="img-welcome" src={require('../../assets/img/login/img-welcome.png')} />
          <div className="g-login-form">
            <Form onSubmit={this.loginSubmit}>
              <Form.Item help={getFieldError('username')}>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入账号' }],
                  initialValue: this.state.username
                })(
                  <Input
                    onFocus={() => this.setState({ focusItem: 0 })}
                    onBlur={() => this.setState({ focusItem: -1 })}
                    maxLength={16}
                    className="txt-input"
                    placeholder='请输入账号' />
                )}
              </Form.Item>
              <Form.Item help={getFieldError('password')}>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }]
                })(
                  <Input
                    onFocus={() => this.setState({ focusItem: 1 })}
                    onBlur={() => this.setState({ focusItem: -1 })}
                    type='password'
                    maxLength={16}
                    className="txt-input"
                    placeholder='请输入密码' />
                )}
              </Form.Item>
              <div className='bottom'>
                <input className='btn-login' type="submit" value='登录' />
              </div>
              <div className="g-remember">
                <Checkbox checked={this.state.remember} onChange={this.setRemeber}><span className="lbl-name">记住用户名</span></Checkbox>
              </div>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginForm