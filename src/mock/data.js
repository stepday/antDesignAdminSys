/**
 * 静态mock数据
 */
var MockData = {
	// 表单字段库列表
	"/api/lesseeBase/page":getList(["columnId","columnName","code","class","classCode"]),
	/**
	 * 数据字典
	 */
	"/manage/dictType/page":getList(["dictTypeId","dictTypeName","dictTypeCode"]),
	
	// 字典键值列表
	"/manage/dict/page":getList(["dictId","dictName","dictCode","dictRemark"]),
	
	//登录
	"/manage/user/login":{
		r:1,
		msg:"登录成功",
		data:{
			uname:"stepday"
		}
	}
}

/**
 * 根据列返回列表数据
 * @params {array}:columns 列key数组
 */
function getList(columns){
	var _list = [];
	
	for(let i = 0;i<15;i++){
		let _row = {};
		columns.forEach(col => {
			let _rnd = Math.floor(Math.random()*(100-1)+1);
			_row[col] = `${col}_${_rnd}`;
		});
		_list.push(_row);
	}	
	return {
		r: "1",
		msg:"成功",
		data:{
			list:_list,
			page:1,
			prePage:20,
			total:15
		}
	};
}

export {MockData};