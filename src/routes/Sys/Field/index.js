import React from 'React';
import {
  Form, Row, Col, Input, Button, Icon, Select, Modal, message,Checkbox
} from 'antd';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import GridList from '../../../components/GridList'
// import './style.css'

const { Option } = Select;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

@Form.create()
export default class Field extends React.Component {
  state = {
    //查询条件
    query: {
      group: ""
    },    
    //表格数据源相关
    options: {
      ajax: {
        url: "/api/lesseeBase/page",
        type: "get",
        data: {
          page: 1,
          perPage: 20
        },
        pageIndexKey: "page",
        pageSizeKey: "perPage",
        rowsKey: "list",
        totalKey: "total"
      },
      rowSelection: {
        type: "checkbox" //单选  checkbox 多选 默认checkbox        
      },//是否可以选择行
      bordered: true,//有表格
      pagination: {
        pageSize: 20
      },//分页
      rowKey: 'columnId',
      //表格列配置
      columns: [
        {
          title: '字段名称', width: 100, dataIndex: 'columnName', key: 'columnId',
        },
        {
          title: '字段code', dataIndex: 'code', width: 150,
        },
				 {
				  title: '所属页面分类', dataIndex: 'class', width: 150,
				},
				 {
				  title: '页面分类code', dataIndex: 'classCode', width: 150,
				},
        {
          title: '操作',
          // fixed: 'right',
          width: 100,
          render: (text, record, index) => <a href="javascript:;">查看详情</a>,
        }
      ]
    },
    addVisible: false,
    changeVisible: false,
    //表单提交数据
    form:{
      group:""
    }
  }

  /**
   * 查询
   */
  query = () => {
    var options = this.state.options;
    options.ajax.data.current = 1;
    options.ajax.reload = true; //重新请求数据

    this.setState({
      options: options
    });
  }

  /**
   * 重置
   */
  reset = () => {
    var options = this.state.options;
    options.ajax.data.current = 1;
    options.ajax.reload = true; //重新请求数据

    this.setState({
      options: options
    });
  }

  /**
   * 新增
   */
  add = () => {
    this.setState({
      addVisible: true
    })
  }

  /**
   * 修改
   */
  edit = () =>{
    let selections = this.state.options.selections;
    if (!selections || selections.length == 0) {
      message.warning("请至少选择一项进行修改");
      return;
    }
    //只能删除一条
    if (selections.length > 1) {
      message.warning(`最多只能选择一条记录进行修改，你选择了${selections.length}条`);
      return;
    }
    this.setState({
      addVisible:true
    });
  }

  /**
   * 关闭弹窗
   * @param {string} _winType  弹窗类型 add/change
   */
  close(_winType){
    if(_winType == 'add'){
      this.setState({
        addVisible:false
      });
    }else{
      this.setState({
        changeVisible:false
      });
    }
  }

  /**
   * 删除
   */
  del = () => {
    let selections = this.state.options.selections;
    if (!selections || selections.length == 0) {
      message.warning("请至少选择一项进行删除");
      return;
    }
    //只能删除一条
    if (selections.length > 1) {
      message.warning(`最多只能删除一条记录，你选择了${selections.length}条`);
      return;
    }
    confirm({
      title: '提示',
      content: `确定要删除选中的${selections.length}条记录吗?`,
      okType: 'danger',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    //布局设置
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <div>
        <CustomBreadcrumb arr={['字段库管理']} />
        {/* 查询条件 */}
        <Form {...formItemLayout} className="ant-advanced-search-form">
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="页面分类">
                <Select value={this.state.query.group} placeholder="请选择">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="tom">Tom</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="字段名称">
                {getFieldDecorator('name', {
                  rules: [{
                    required: false,
                    message: '请输入',
                  }],
                })(
                  <Input placeholder="placeholder" />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="字段code">
                {getFieldDecorator('code', {
                  rules: [{
                    required: false,
                    message: '请输入',
                  }],
                })(
                  <Input placeholder="placeholder" />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="状态">
                <Select value={this.state.query.state} placeholder="请选择">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="tom">Tom</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="form类型">
                <Select value={this.state.query.type} placeholder="请选择">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="tom">Tom</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" onClick={this.query}><Icon type="search" />查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.reset}><Icon type="reload" />重置</Button>
            </Col>
          </Row>
        </Form>
        {/* 功能按钮 */}
        <div className="g-query-btn-box">
          <Button type="primary" onClick={this.query}><Icon type="reload" />刷新</Button>
          <Button onClick={this.add}><Icon type="plus" />新增</Button>
          <Button onClick={this.edit}><Icon type="edit" />修改</Button>
          <Button onClick={this.change}><Icon type="lock" />启用/停用</Button>
          <Button type="danger" onClick={this.del}><Icon type="delete" />删除</Button>
        </div>
        {/* 列表 */}
        <GridList options={this.state.options} />

        {/* 新增/修改信息弹窗 */}
        <Modal title="新增字段" maskClosable={false} visible={this.state.addVisible} onOk={this.submit} onCancel={this.close.bind(this,'add')}>
          <Form {...formItemLayout}>
            <Row>
              <Col span={24}>
                <Form.Item label="页面分类名称">
                  <Select value={this.state.form.group} placeholder="请选择">
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="字段名称">
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true,
                      message: '请输入',
                    }],
                  })(
                    <Input placeholder="placeholder" />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="字段code">
                  {getFieldDecorator('code', {
                    rules: [{
                      required: true,
                      message: '请输入',
                    }],
                  })(
                    <Input placeholder="placeholder" />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="form类型">
                  <Select value={this.state.form.group} placeholder="请选择">
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="字段长度">
                  {getFieldDecorator('len', {
                    rules: [{
                      required: false,
                      message: '请输入',
                    }],
                  })(
                    <Input placeholder="placeholder" />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="默认值">
                  {getFieldDecorator('defaultValue', {
                    rules: [{
                      required: true,
                      message: '请输入',
                    }],
                  })(
                    <Input placeholder="placeholder" />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="必填限制">
                  <CheckboxGroup options={['开放','必填','金额','身份证','手机号码','邮箱','数字']} value={['开放']} />
                </Form.Item>
              </Col>  
              <Col span={24}>
                <Form.Item label="备注">
									{getFieldDecorator('defaultValue', {										
									})(
										<TextArea rows={3}/>
									)}                  
                </Form.Item>
              </Col>              
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}