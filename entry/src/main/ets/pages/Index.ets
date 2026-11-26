import socket from '@ohos.net.socket'
import wifi from "@ohos.wifi"
import UdpProcess from '../entryability/UdpProcess'
import Protocol, { ProtocolResult } from '../entryability/Protocol'

import { SearchDevice } from "./SearchDevice"
import { WisdomHouse } from "./WisdomHouse"

@Entry
@Component
struct Index {
  private tabsController: TabsController = new TabsController(); // tabs组件，分页

  /***************************************************************
   * 函数名称: aboutToAppear
   * 说    明: 页面被调用时，在调用build()之前，执行aboutToAppear()
   * 参    数: 无
   * 返 回 值: 无
   ***************************************************************/
  aboutToAppear() {
    UdpProcess.Init()
  }

  build() {
    Tabs({
      barPosition: BarPosition.End,
      controller: this.tabsController
    }) {
      TabContent() {
        // 第一页
        SearchDevice({})
      }
      .tabBar("搜索设备")

      TabContent() {
        // 第2页
        WisdomHouse({})
      }
      .tabBar("智慧小屋")
    }
  }
}