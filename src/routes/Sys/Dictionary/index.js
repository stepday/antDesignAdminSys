import React from 'React';
import {
  Form, Row, Col, Input,InputNumber, Button, Icon, Select, Modal, message,Checkbox,Divider
} from 'antd';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import GridList from '../../../components/GridList'
import { tools } from '../../../utils/tools'

const { Option } = Select;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

let selectRow = undefined;
let editRow = undefined;

/**
 * 字典类型表单
 */
@Form.create()
class TypeForm extends React.Component{
	
	
	/**
	 * 提交字典类型
	 */
	submit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
		  if (!err) {
					tools.$ajax({
						url:"/manage/dictType/save",
						type:"post",
						headers:{
						    "Content-Type":"application/json"
						},
						data:{
							dictTypeId:editRow?editRow.dictTypeId:undefined,
							dictTypeName:values.dictTypeName,
							dictTypeCode:values.dictTypeCode
						}
					},function(json){							
						if(json.r == 1){
								message.success("操作成功");
								editRow = undefined;
								this.props.refresh();
								this.close();
						}else{
							message.error(json.msg);
						}
					}.bind(this));
		  }
		});
	}
	
	/**
	 * 关闭弹窗
	 */
	close(){	
		//清空表单
		this.props.form.resetFields();
		this.props.onClose();
	}
	
	render(){
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
		
		let state = this.props;
		
		return (
		<Modal title="新增类型" maskClosable={false} visible={state.visible} onOk={this.submit} onCancel={this.close.bind(this)}>
			<Form {...formItemLayout}>
			  <Row>		      
			    <Col span={24}>
			      <Form.Item label="字典分类名称">
			        {getFieldDecorator('dictTypeName', {
								initialValue:editRow?editRow.dictTypeName:"",
			          rules: [{
			            required: true,
			            message: '请输入',
			          }],
			        })(
			          <Input placeholder="请输入" />
			        )}
			      </Form.Item>
			    </Col>
			    <Col span={24}>
			      <Form.Item label="字典分类code">
			        {getFieldDecorator('dictTypeCode', {
								initialValue:editRow?editRow.dictTypeCode:"",
			          rules: [{
			            required: true,
			            message: '请输入',
			          }],
			        })(
			          <Input placeholder="请输入" />
			        )}
			      </Form.Item>
			    </Col>          
			  </Row>
			</Form>
		 </Modal>
		)
	}
}

/**
 * 字典值表单
 */
@Form.create()
class KeyForm extends React.Component{
	
	/**
	 * 提交字典键值
	 */
	submit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {			
		  if (!err) {
				//设置数据字典类型
				let _data = values;				
				if(editRow){
					_data["dictId"] = editRow.dictId;
					_data["dictType"] = editRow.dictType;
				}else{
					_data["dictType"] = selectRow.dictTypeCode;
				}
								
				tools.$ajax({
					url:"/manage/dict/save",
					type:"post",
					headers:{
					    "Content-Type":"application/json"
					},
					data:_data
				},function(json){							
					if(json.r == 1){
							message.success("操作成功");
							// this.props.refresh();
							editRow = undefined;
							this.close();
					}else{
						message.error(json.msg);
					}
				}.bind(this));
		  }
		});
	}
	
	/**
	 * 关闭弹窗
	 */
	close(){		
		this.props.form.resetFields();
		this.props.onClose();
	}
	
	render(){
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
		
		let state = this.props;
		
		return (
			<Modal title="新增键值" maskClosable={false} visible={state.visible} onOk={this.submit} onCancel={this.close.bind(this)}>
			  <Form {...formItemLayout}>
			    <Row>		      
			      <Col span={24}>
			        <Form.Item label="字典值名称">
			          {getFieldDecorator('dictName', {
									initialValue:editRow?editRow.dictName:"",
			            rules: [{
			              required: true,
			              message: '请输入',
			            }],
			          })(
			            <Input placeholder="请输入" />
			          )}
			        </Form.Item>
			      </Col>
			      <Col span={24}>
			        <Form.Item label="字典值code">
			          {getFieldDecorator('dictCode', {
									initialValue:editRow?editRow.dictCode:"", 
			            rules: [{
			              required: true,
			              message: '请输入',
			            }],
			          })(
			            <Input placeholder="请输入" />
			          )}
			        </Form.Item>
			      </Col>
				  <Col span={24}>				 
					  <Form.Item label="备注">
					  	{getFieldDecorator('dictRemark', {
								initialValue:editRow?editRow.dictRemark:"",										
					  	})(
					  		<TextArea rows={3}/>
					  	)}                  
					  </Form.Item>
				  </Col>
				  <Col span={24}>
				    <Form.Item label="字典值排序">
				      {getFieldDecorator('dictSeq', {
								initialValue:editRow?editRow.dictSeq:"",
				        rules: [{
				          required: true,
				          message: '请输入',
				        }],
				      })(
				        <InputNumber placeholder="请输入" />
				      )}
				    </Form.Item>
				  </Col>
			    </Row>
			  </Form>
			</Modal>
		)
	}
}

export default class Dictionary extends React.Component{
    state = {
		//查询条件
		query: {
			group: ""
		},  
		selectRow:undefined,//子项选择的行号
		// 表格数据源相关
		options:{
			rowSelection:{},//是否可以选择行
			ajax:{
					url:"/manage/dictType/page",
					type:"get",
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
			rowKey: 'dictTypeId',
			//表格列配置
			columns: [
				{
					title: '编号', width: 100, dataIndex: 'dictTypeId', key: 'dictTypeId',
				},
				{ 
					title: '类型名称', width: 150, dataIndex: 'dictTypeName',
				},
				{
					title: '类型code', dataIndex: 'dictTypeCode', width: 100,
				},
				{
					title: '操作',
					// fixed: 'right',
					width: 100,
					render: (text, record, index) => (
						<span>
							<a href="javascript:;" onClick={() => this.editKey('type',record)}>修改</a>
							<Divider type="vertical" />
							<a href="javascript:;" onClick={() => this.add('key',record)}>新增子项</a>
						</span>
					)				
				}
			],
			//子表格配置
			subgrid:{
				ajax:{
					url:"/manage/dict/page",
					type:"get",
					data: {
						page: 1,
						perPage: 20,
						dictType:"{dictTypeCode}" //通配符 替换值用
					},
					pageIndexKey: "page",
					pageSizeKey: "perPage",
					rowsKey: "list",
					totalKey: "total"
				},
				rowSelection: undefined,//是否可以选择行
				bordered: false,//有表格
				pagination: false,//分页
				rowKey: 'dictId',
				columns:[
					{
						title: '编号', width: 100, dataIndex: 'dictId', key: 'dictId',
					},
					{ 
						title: '键名称', width: 150, dataIndex: 'dictName',
					},
					{
						title: '键值', dataIndex: 'dictCode', width: 100,
					},
					{
						title: '备注', dataIndex: 'dictRemark', width: 100,
					},
					{
						title: '操作',
						width: 100,
						render: (text, record, index) => <a href="javascript:;" onClick={()=>this.editKey('key',record)}>修改</a>,
					}
				]
			}					
		},
		addTypeVisible:false,
		addKeyVisible:false, // 新增
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
	 * 新增
	 * @param _type:string 表单类型 type:类型  key:键值
	 * @param _row:object 行对象
	 */
	add = (_type,_row) => {
	  // debugger
      if(_type == "key"){
		  this.setState({
			addKeyVisible: true
		  });					
			selectRow = _row;
	  }else{
		  this.setState({
		  	addTypeVisible: true
		  })
	  }
	}
	
	/**
	 * 修改字典键值
	 */
	editKey = (_type,_row) => {
		editRow = _row;
		
		if(_type == "key"){
		  this.setState({
			addKeyVisible: true
		  });
		}else{
		  this.setState({
		  	addTypeVisible: true
		  })
		}
	}
		
	/**
	 * 关闭弹窗
	 */
	close(_type){		
		if(_type == 'type'){
			this.setState({
				addTypeVisible:false
			});
		}else{
			this.setState({
				addKeyVisible:false
			});
		}
	}
		
			
   render(){  	   	   
    return (
      <div>
        <CustomBreadcrumb arr={['数据字典管理']}/>
				{/* 功能按钮 */}
				<div className="g-query-btn-box">
					<Button type="primary" onClick={this.query}><Icon type="reload" />刷新</Button>
					<Button onClick={this.add}><Icon type="plus" />新增</Button>
					<Button type="danger" onClick={this.del}><Icon type="delete" />删除</Button>
				</div>
				{/* 列表 */}
						<GridList  options={this.state.options}/>
				
				{/* 字典类型 新增/修改信息弹窗 */}
				<TypeForm visible={this.state.addTypeVisible} refresh={() => this.query()} onClose={() => this.close('type')}></TypeForm>
				
				{/* 字典键值 新增/修改信息弹窗 */}
				<KeyForm visible={this.state.addKeyVisible} onClose={() => this.close('key')}></KeyForm>
    </div>
    )
  }
}