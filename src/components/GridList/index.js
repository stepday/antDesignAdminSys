/**
 * 表格/列表组件
 * author:stepday
 * 目的：
 * 1、表头可配置;
 * 2、数据源可配置（ajax和datasource两种）；
 * 3、是否支持分页（客户端分页还是后台分页两种）；
 */

import React from 'react'
import {
    Table, message
} from 'antd';
import { Resizable } from 'react-resizable';
import { tools } from '../../utils/tools'

const ResizeableTitle = (props) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable width={width} height={0} onResize={onResize}>
            <th {...restProps} />
        </Resizable>
    );
};

export default class GridList extends React.Component {
    constructor(props) {
        super(props);
        const options = this.props.options || {};

        let pagination = options.pagination || false;
        if (pagination) {
            //设置页码调整事件
            pagination.onChange = (page, pageSize) => {
                options.ajax.data[options.ajax["pageIndexKey"]] = page;

                this.getData(options);
            }
        }

        let rowSelection = options.rowSelection || undefined,
            _this = this;

        if (rowSelection) {
            //设置单选和全选事件
            rowSelection.onSelect = (record, selected, selectedRows, nativeEvent) => {
                //单行选择/反选
                _this.props.options.selections = selectedRows;
            }
            rowSelection.onSelectAll = (selected, selectedRows, changeRows) => {
                //全选/反选
                _this.props.options.selections = selectedRows;
            }
        }

        this.state = {
            rowKey: options.rowKey || 'id',
            pagination: options.pagination || false,
            bordered: options.bordered || false,
            data: options.dataSource || [],
            columns: options.columns || [],
			subgrid:options.subgrid || null,
            rowSelection: rowSelection // 有checkbox可选择行
        }

        this.getData(options);
    }

    /**
     * 提取接口数据
     */
    getData(options) {
        if (!options.ajax && options.data) return; // 已经设置了静态数据源

        let _this = this;
        new Promise((resolve, reject) => {
            tools.$ajax({
                url: options.ajax.url,
                type: options.ajax.type,
                data: options.ajax.data
            }, function (json) {
                if (json.r == 1) {
                    resolve(json);
                } else {
                    reject(json);
                }
            });
        }).then((json) => {            
            delete this.props.options.ajax.reload;

            let pagination = options.pagination;
            if (pagination) {
                //设置总数
                pagination.total = json.data[options.ajax.totalKey];
                pagination.current = json.data[options.ajax.pageIndexKey];
            }
            _this.setState({
                pagination: pagination,
                data: json.data[options.ajax.rowsKey]
            });
        }).catch((json) => {			
            message.error(json.msg);
        });
    }

    components = {
        header: {
            cell: ResizeableTitle,
        },
    }

    handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
          const nextColumns = [...columns];
          nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
          };
          return { columns: nextColumns };
        });
      };
	  
	 /**
	  * 加载子列表容器
	  */
	 expandedRowRender = (record,index,indent,expanded) => {
		 if(!expanded) return;
		 
		 let datasource = [],
		     options = this.state.subgrid,
			 state = {
				 rowKey: options.rowKey || 'id',
				 pagination: options.pagination || false,
				 bordered: options.bordered || false,				
				 columns: options.columns || [],
				 rowSelection: options.rowSelection // 有checkbox可选择行
			 };
		 
		 return (
		 			<Table {...state} columns={state.columns} dataSource={this.state.subgrid.dataSource} size="small" scroll={{ x: state.columns * 100 }}/>
		 )
	 }
	 
	 /**
	  * 展开 根据子列表配置提取数据渲染数据源
	  * @param {object}:record 当前行的对象
	  * @param {number}:index 当前行号
	  */
	 onExpand = (expanded,record,index) => {		 		 
		 if(!expanded) return ;
		 
		 		 
		 let options = this.state.subgrid;			 
		
		// 提取子列表数据
		if (options.ajax){
			let _this = this,
				_data = Object.assign({},options.ajax.data);
			
			//检测参数值是否有通配符
			if(Object.keys(_data).length > 0){
				Object.keys(_data).forEach(key => {
					if(_data[key].toString().includes("{")){
						let _attr = _data[key].replace(/\{|}/g,''); //获得属性值
						_data[key] = record[_attr];
					}
				});
			}
						
			
			new Promise((resolve, reject) => {
			    tools.$ajax({
			        url: options.ajax.url,
			        type: options.ajax.type,
			        data: _data
			    }, function (json) {
			        if (json.r == 1) {
			            resolve(json);
			        } else {
			            reject(json);
			        }
			    });
			}).then((json) => {					
				let subgrid = this.state.subgrid;
				subgrid.dataSource = json.data[options.ajax.rowsKey];
				// 这里会形成死循环 
				_this.setState({
					subgrid:subgrid
				});
			}).catch((json) => {			
			    message.error(json.msg);
			});
		}		 		
	 }

    render() {
        //获取父组件传递过来的变更查询数据项目
        if (this.props.options && this.props.options.ajax && this.props.options.ajax.reload) {
            this.getData(this.props.options);
        }

        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }));		

        return (
            <div>				
                <Table {...this.state}  components={this.components} onExpand={this.onExpand} expandedRowRender={this.state.subgrid?this.expandedRowRender:null} columns={columns} dataSource={this.state.data} size="small" scroll={{ x: this.state.columns * 100 }} />
            </div>
        )
    }
}