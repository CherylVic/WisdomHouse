import display from '@ohos.display'
import router from '@ohos.router'

import UdpProcess from '../entryability/UdpProcess'
import Protocol, { ProtocolResult } from '../entryability/Protocol'

@Entry @Component export struct DeviceList {
  private display_height: number
  private display_width: number

  private device_select: number = 0

  /***************************************************************
   * 函数名称: aboutToAppear
   * 说    明: 页面被调用时，在调用build()之前，执行aboutToAppear()
   * 参    数: 无
   * 返 回 值: 无
   ***************************************************************/
  aboutToAppear() {
    let mDisplay = display.getDefaultDisplaySync()
    let height: number = px2vp(mDisplay.height)
    let width: number = px2vp(mDisplay.width)

    this.display_height = height
    this.display_width = width
  }

  build() {
    Column() {
      Row() {
        Button('返回')
          .fontSize(25)
          .onClick(() => {
            router.back() // 返回上一页
          })

        Text('选择智慧小屋')
          .fontSize(30)
          .fontColor('#ff00aa00')

        Button('确定')
          .fontSize(25)
          .onClick(() => {
            if (UdpProcess.remote_device_status.length == 0) {
              AlertDialog.show(
                {
                  title: '告警',
                  message: '当前局域网内无智慧小屋',
                  autoCancel: true,
                  alignment: DialogAlignment.Bottom,
                  offset: { dx: 0, dy: -20 },
                  gridCount: 3,
                  confirm: {
                    value: '确定',
                    action: () => {
                      console.info('DeviceList: 当前局域网内无智慧小屋 and actiion')
                    }
                  },
                  cancel: () => {
                    console.info('DeviceList: 当前局域网内无智慧小屋 and cancel')
                  }
                }
              )
              return
            }
            UdpProcess.remote_device_select = this.device_select
            router.back() // 返回上一页
          })
      }
        .width('100%')
        .justifyContent(FlexAlign.SpaceBetween)
        .padding({
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
        })


      List() {
        ForEach(UdpProcess.remote_device_status, (item, index) => {
          ListItem() {
            Row() {
              Text("设备号：" + item.deviceId)
                .fontSize(20)
              Button('选择该设备')
                .fontSize(20)
                .onClick(() => {
                  this.device_select = index
                })
            }
              .width('100%')
              .justifyContent(FlexAlign.SpaceAround)
          }
        })
      }
        .padding({
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
        })

    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Start)
    .padding({
      top: 10,
      left: 10,
      right: 10,
    })
    .backgroundColor('#ffc6c6c6')
  }
}