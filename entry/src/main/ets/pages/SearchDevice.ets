import display from '@ohos.display'
import router from '@ohos.router'
import featureAbility from '@ohos.ability.featureAbility'

import UdpProcess from '../entryability/UdpProcess'
import Protocol, { ProtocolResult } from '../entryability/Protocol'

@Entry @Component export struct SearchDevice {
  private display_height: number
  private display_width: number
  private title_height: number
  private image_height: number
  private button_height: number
  private list_height: number

  private intervalId: number = 0 // 定时器
  private is_findDevice: Boolean = false

  // 智慧小屋设备列表
  @State deviceListCount: number = 0

  /***************************************************************
   * 函数名称: updateData
   * 说    明: 定时器响应函数，用于定时同步读取通讯层的相关数据
   * 参    数: 无
   * 返 回 值: 无
   ***************************************************************/
  updateData = () => {
    let i: number = 0

    if (this.is_findDevice == false) {
      return
    }

    this.deviceListCount = UdpProcess.remote_device_status.length
    console.log("SearchDevice: deviceList.length = ", UdpProcess.remote_device_status.length)
    for (i = 0; i < UdpProcess.remote_device_status.length; i++) {
      console.log("SearchDevice: [" + i + "]: deviceId = " + UdpProcess.remote_device_status[i].deviceId + ", address = " + UdpProcess.remote_device_status[i].remote_info.address)
    }
  }

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

    this.title_height = this.display_height * 0.1
    this.image_height = this.display_height * 0.3
    this.button_height = this.display_height * 0.1
    this.list_height = this.display_height * 0.1

    this.deviceListCount = UdpProcess.remote_device_status.length
    this.is_findDevice = false
    this.intervalId = setInterval(this.updateData, 1000)  // 开启定时器
  }

  build() {
    Column() {
      Text('搜索设备')
        .height(this.title_height)
        .width(this.display_width)
        .fontSize(50)
        .fontColor('#ff00aa00')
        .textAlign(TextAlign.Center)

      // 图片
      Image($r('app.media.search_device'))
        .objectFit(ImageFit.Contain)
        .width(this.display_width)
        .height(this.image_height)

      // 按键
      Row() {
        Button('开始搜索')
          .onClick(() => {
            this.is_findDevice = true
            UdpProcess.findDevice()
          })
        Button('停止搜索')
          .onClick(() => {
            this.is_findDevice = false
          })
      }
        .width(this.display_width)
        .height(this.button_height)
        .justifyContent(FlexAlign.SpaceAround)

      // 智慧小屋列表
      Row() {
        Text('设备数目：' + this.deviceListCount)
        Button('选择设备')
          .onClick(() => {
            router.pushUrl({
              url: "pages/DeviceList",
            }, (err) => {
              if (err) {
                console.error(`SearchDevice: pushUrl failed, code is ${err.code}, message is ${err.message}`)
                return
              } else {
                console.log("SearchDevice: pushUrl success")
              }
            })
          })
      }
        .width(this.display_width)
        .height(this.list_height)
        .justifyContent(FlexAlign.SpaceAround)


    }
      .width(this.display_width)
      .height(this.display_height)
      .justifyContent(FlexAlign.Start)
      .padding({
        top: 10,
        left: 10,
        right: 10,
      })
      .backgroundColor('#ffc6c6c6')
  }
}