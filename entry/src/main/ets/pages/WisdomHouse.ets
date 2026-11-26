import socket from '@ohos.net.socket'
import display from '@ohos.display'
import router from '@ohos.router'
import featureAbility from '@ohos.ability.featureAbility'

import UdpProcess from '../entryability/UdpProcess'
import Protocol, { ProtocolResult } from '../entryability/Protocol'

export type WisdomHouseStatus = {
  deviceId: string,       // 智慧小屋编号
  name: string,           // 智慧小屋名称
  temperator: number,     // 室内温度
  humidity: number,       // 室内湿度
  lumination: number,     // 光照强度
  is_rain: boolean,       // 下雨预警
  is_smoke: boolean,      // 烟雾报警
  is_fire: boolean,       // 火灾报警
  /////////////////
  door_status: boolean,       // 门开关状态
  garage_status: boolean,     // 车库门开关
  window_status: boolean,     // 窗口开关
  light_status: boolean,      // 灯开关
}

@Entry @Component export struct WisdomHouse {
  private display_height: number = 1280
  private display_width: number = 750
  private title_height: number = 100

  private font_size: number = 20
  private color_title: ResourceColor = 'sff00aa00'
  private color_device: ResourceColor = '#ffeca7a7'
  private color_status: ResourceColor = '#ffffffff'
  private color_contorl: ResourceColor = '#ff6e89ec'

  private intervalId: number = 0 // 定时器，定时取智慧小屋的设备信息
  @State wisdomHouseStatus: WisdomHouseStatus = {
    deviceId: "",       // 智慧小屋编号
    name: "",           // 智慧小屋名称
    temperator: 0,     // 室内温度
    humidity: 0,       // 室内湿度
    lumination: 0,     // 光照强度
    is_rain: false,       // 下雨预警
    is_smoke: false,      // 烟雾报警
    is_fire: false,       // 火灾报警
    /////////////////
    door_status: false,       // 门开关状态
    garage_status: false,     // 车库门开关
    window_status: false,     // 窗口开关
    light_status: false,      // 灯开关
  }
  @State remote_address: string = ""
  @State remote_port: number = 0

  /***************************************************************
   * 函数名称: showAlertDialog
   * 说    明: 报警对话框
   * 参    数:
   *      @title      对话框的标题
   *      @message    对话框的内容
   *      @confirm    对话框的确定按键的显示内容
   *      @action     对话框的确定按键后打印信息
   *      @cancel     对话框的取消按键后打印信息
   * 返 回 值: 无
   ***************************************************************/
  showAlertDialog(title: string, message: string, confirm: string, action: string, cancel: string) {
    AlertDialog.show(
      {
        title: title,
        message: message,
        autoCancel: true,
        alignment: DialogAlignment.Bottom,
        offset: { dx: 0, dy: -20 },
        gridCount: 3,
        confirm: {
          value: confirm,
          action: () => {
            console.info('WisdomHouse: ' + action)
          }
        },
        cancel: () => {
          console.info('WisdomHouse: ' + cancel)
        }
      }
    )
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

    this.title_height = height * 0.1

    this.updateData()
    this.intervalId = setInterval(this.updateData, 1000)  // 定时器，设置为1秒1次

    // 查看是否配置对
    if (UdpProcess.remote_device_select >= UdpProcess.remote_device_status.length) {
      this.showAlertDialog('报警', '未选中正确的设备号', '确定', '未选中正确的设备号', '未选中正确的设备号')
      // 直接返回
      return
    }
  }

  /***************************************************************
   * 函数名称: updateData
   * 说    明: 定时器响应函数，用于定时同步读取通讯层相关数据
   * 参    数: 无
   * 返 回 值: 无
   ***************************************************************/
  updateData = () => {
    console.info("WisdomHouse: updateData => ")
    let select: number = UdpProcess.remote_device_select

    if (select >= UdpProcess.remote_device_status.length) {
      console.error("WisdomHouseShow: updateData => WisdomHouse.checkWisdomHouseSelect() failled")
      return
    }
    this.wisdomHouseStatus.deviceId = UdpProcess.remote_device_status[select].deviceId
    this.wisdomHouseStatus.name = UdpProcess.remote_device_status[select].remote_info.address
    this.wisdomHouseStatus.temperator = UdpProcess.remote_device_status[select].temperator
    this.wisdomHouseStatus.humidity = UdpProcess.remote_device_status[select].humidity
    this.wisdomHouseStatus.lumination = UdpProcess.remote_device_status[select].lumination
    this.wisdomHouseStatus.is_rain = (UdpProcess.remote_device_status[select].is_rain == 0) ? (false) : (true)
    this.wisdomHouseStatus.is_smoke = (UdpProcess.remote_device_status[select].is_smoke == 0) ? (false) : (true)
    this.wisdomHouseStatus.is_fire = (UdpProcess.remote_device_status[select].is_fire == 0) ? (false) : (true)

    this.wisdomHouseStatus.door_status = false
    this.wisdomHouseStatus.garage_status = false
    this.wisdomHouseStatus.window_status = false
    this.wisdomHouseStatus.light_status = false
  }

  build() {
    Column() {
      Text('智慧小屋')
        .height(this.title_height)
        .width(this.display_width)
        .fontSize(50)
        .fontColor(this.color_title)
        .textAlign(TextAlign.Center)

      // 设备信息
      Column({ space: 10 }) {
        Text('设备号：' + this.wisdomHouseStatus.deviceId)
          .fontSize(this.font_size)
        Text('设备名称：' + this.wisdomHouseStatus.name)
          .fontSize(this.font_size)
      }
      .alignItems(HorizontalAlign.Start)
      .justifyContent(FlexAlign.Start)
      .width('100%')
      .backgroundColor(this.color_device)
      .padding({
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
      })


      Row({ space: 10}) {
        Column({ space: 10}) {
          Image($r('app.media.temperator'))
            .objectFit(ImageFit.Contain)
            .height(50)
          Text(this.wisdomHouseStatus.temperator + ' ' + '°C')
            .fontSize(this.font_size)
        }

        Column({ space: 10}) {
          Image($r('app.media.humidity'))
            .objectFit(ImageFit.Contain)
            .height(50)
          Text(this.wisdomHouseStatus.humidity + ' ' + 'RH')
            .fontSize(this.font_size)
        }

        Column({ space: 10}) {
          Image($r('app.media.lumination'))
            .objectFit(ImageFit.Contain)
            .height(50)
          Text(this.wisdomHouseStatus.lumination + ' ' + 'Lux')
            .fontSize(this.font_size)
        }
      }
      .height(100)
      .width('100%')
      .alignItems(VerticalAlign.Center)
      .justifyContent(FlexAlign.SpaceEvenly)
      .backgroundColor(this.color_status)
      .padding({
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
      })


      Row({ space: 10 }) {
        Column({ space: 10 }) {
          Image((this.wisdomHouseStatus.is_rain == true) ? $r('app.media.is_rain') : $r('app.media.not_rain'))
            .objectFit(ImageFit.Contain)
            .height(50)
          Text((this.wisdomHouseStatus.is_rain == true) ? "下雨" : "晴天")
            .fontSize(this.font_size)
        }

        Column({ space: 10 }) {
          Image((this.wisdomHouseStatus.is_smoke == true) ? $r('app.media.is_smoke') : $r('app.media.not_smoke'))
            .objectFit(ImageFit.Contain)
            .height(50)
          Text((this.wisdomHouseStatus.is_smoke == true) ? "冒烟" : "安全")
            .fontSize(this.font_size)
        }

        Column({ space: 10 }) {
          Image((this.wisdomHouseStatus.is_fire == true) ? $r('app.media.is_fire') : $r('app.media.not_fire'))
            .objectFit(ImageFit.Contain)
            .height(50)
          Text((this.wisdomHouseStatus.is_fire == true) ? "火灾" : "安全")
            .fontSize(this.font_size)
        }
      }
      .height(100)
      .width('100%')
      .alignItems(VerticalAlign.Center)
      .justifyContent(FlexAlign.SpaceAround)
      .backgroundColor(this.color_status)
      .padding({
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
      })

      // 设备控制
      Row({ space: 10}) {
        Column({ space: 5}) {
          Image((this.wisdomHouseStatus.door_status == true) ? $r('app.media.open_door') : $r('app.media.close_door'))
            .objectFit(ImageFit.Contain)
            .backgroundColor(this.color_contorl)
            .height(50)
            .onClick(() => {
              if (this.wisdomHouseStatus.door_status == false) {
                this.wisdomHouseStatus.door_status = true
                UdpProcess.setDoor(this.wisdomHouseStatus.deviceId, 1)
              } else {
                this.wisdomHouseStatus.door_status = false
                UdpProcess.setDoor(this.wisdomHouseStatus.deviceId, 0)
              }
            })
          Button((this.wisdomHouseStatus.door_status == true) ? "关门" : "开门")
            .fontSize(this.font_size)
            .fontColor(Color.Black)
            .backgroundColor(Color.Transparent)
            .onClick(() => {
              if (this.wisdomHouseStatus.door_status == false) {
                this.wisdomHouseStatus.door_status = true
                UdpProcess.setDoor(this.wisdomHouseStatus.deviceId, 1)
              } else {
                this.wisdomHouseStatus.door_status = false
                UdpProcess.setDoor(this.wisdomHouseStatus.deviceId, 0)
              }
            })
        }

        Column({ space: 5}) {
          Image((this.wisdomHouseStatus.garage_status == true) ? $r('app.media.open_garage') : $r('app.media.close_garage'))
            .objectFit(ImageFit.Contain)
            .backgroundColor(this.color_contorl)
            .height(50)
            .onClick(() => {
              if (this.wisdomHouseStatus.garage_status == false) {
                this.wisdomHouseStatus.garage_status = true
                UdpProcess.setGarageDoor(this.wisdomHouseStatus.deviceId, 1)
              } else {
                this.wisdomHouseStatus.garage_status = false
                UdpProcess.setGarageDoor(this.wisdomHouseStatus.deviceId, 0)
              }
            })
          Button((this.wisdomHouseStatus.garage_status == true) ? "关车库门" : "开车库门")
            .fontSize(this.font_size)
            .fontColor(Color.Black)
            .backgroundColor(Color.Transparent)
            .onClick(() => {
              if (this.wisdomHouseStatus.garage_status == false) {
                this.wisdomHouseStatus.garage_status = true
                UdpProcess.setGarageDoor(this.wisdomHouseStatus.deviceId, 1)
              } else {
                this.wisdomHouseStatus.garage_status = false
                UdpProcess.setGarageDoor(this.wisdomHouseStatus.deviceId, 0)
              }
            })
        }

      }
      .height(100)
      .width('100%')
      .alignItems(VerticalAlign.Center)
      .justifyContent(FlexAlign.SpaceAround)
      .backgroundColor(this.color_contorl)
      .padding({
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
      })


      Row({ space: 10}) {
        Column({ space: 5 }) {
          Image((this.wisdomHouseStatus.window_status == true) ? $r('app.media.open_window') : $r('app.media.close_window'))
            .objectFit(ImageFit.Contain)
            .backgroundColor(this.color_contorl)
            .height(50)
            .onClick(() => {
              if (this.wisdomHouseStatus.window_status == false) {
                this.wisdomHouseStatus.window_status = true
                UdpProcess.setWindow(this.wisdomHouseStatus.deviceId, 1)
              } else {
                this.wisdomHouseStatus.window_status = false
                UdpProcess.setWindow(this.wisdomHouseStatus.deviceId, 0)
              }
            })
          Button((this.wisdomHouseStatus.window_status == true) ? "关窗" : "开窗")
            .fontSize(this.font_size)
            .fontColor(Color.Black)
            .backgroundColor(Color.Transparent)
            .onClick(() => {
              if (this.wisdomHouseStatus.window_status == false) {
                this.wisdomHouseStatus.window_status = true
                UdpProcess.setWindow(this.wisdomHouseStatus.deviceId, 1)
              } else {
                this.wisdomHouseStatus.window_status = false
                UdpProcess.setWindow(this.wisdomHouseStatus.deviceId, 0)
              }
            })
        }

        Column({ space: 5 }) {
          Image((this.wisdomHouseStatus.light_status == true) ? $r('app.media.open_light') : $r('app.media.close_light'))
            .objectFit(ImageFit.Contain)
            .backgroundColor(this.color_contorl)
            .height(50)
            .onClick(() => {
              if (this.wisdomHouseStatus.light_status == false) {
                this.wisdomHouseStatus.light_status = true
                UdpProcess.setLight(this.wisdomHouseStatus.deviceId, 1)
              } else {
                this.wisdomHouseStatus.light_status = false
                UdpProcess.setLight(this.wisdomHouseStatus.deviceId, 0)
              }
            })
          Button((this.wisdomHouseStatus.light_status == true) ? "关灯" : "开灯")
            .fontSize(this.font_size)
            .fontColor(Color.Black)
            .backgroundColor(Color.Transparent)
            .onClick(() => {
              if (this.wisdomHouseStatus.light_status == false) {
                this.wisdomHouseStatus.light_status = true
                UdpProcess.setLight(this.wisdomHouseStatus.deviceId, 1)
              } else {
                this.wisdomHouseStatus.light_status = false
                UdpProcess.setLight(this.wisdomHouseStatus.deviceId, 0)
              }
            })
        }
      }
      .height(100)
      .width('100%')
      .alignItems(VerticalAlign.Center)
      .justifyContent(FlexAlign.SpaceAround)
      .backgroundColor(this.color_contorl)
      .padding({
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
      })


    }
    .width(this.display_width)
    .height(this.display_height)
    .justifyContent(FlexAlign.Start)
    .padding({
      top: 10,
      left: 10,
      right: 10,
      bottom: 10,
    })
    .backgroundColor('#ffc6c6c6')
  }
}



