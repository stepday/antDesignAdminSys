import React from 'React';

import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import GridList from '../../components/GridList'

export default class Sale extends React.Component{
  render(){
    return (
      <div>
        <CustomBreadcrumb arr={['销售方案管理']}/>
        <GridList/>
      </div>
    )
  }
}