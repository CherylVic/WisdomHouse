export enum ProtocolResult {
  ProtocolResult_Success = 0,
  ProtocolResult_PacketLength,      // 报文长度错误
  ProtocolResult_PacketDeviceId,    // 报文设备号错误
  ProtocolResult_PacketDeviceType,  // 报文设备类型错误
  ProtocolResult_PacketCmd,         // 报文命令错误
  ProtocolResult_SelectError,       // 选中的设备号不对
}

class Protocol {
  // 报文位移
  private offset_device_id: number = 0      // 设备号位移
  private offset_device_type: number = 12   // 设备类型位移
  private offset_cmd: number = 14           // 命令位移
  private offset_result: number = 16        // 返回值位移
  private offset_data: number = 17          // 数据部分位移

  // 长度
  private length_device_id: number = 12   // 设备号长度
  private length_device_type: number = 2  // 设备类型长度
  private length_cmd: number = 2          // 命令类型长度
  private length_result: number = 1       // 反馈结果长度

  // 默认值
  public deviceType_WisdomHouse: number = 1 // 设备类型是智慧小屋

  // 命令类型
  public cmd_findDevice: number = 1        // 查找设备号
  public cmd_reportHouseStatus: number = 2 // 上报小屋状态
  public cmd_setDoor: number = 3           // 设置门开关
  public cmd_setGarageDoor: number = 4     // 设置车库开关
  public cmd_setWindow: number = 5         // 设置窗口开关
  public cmd_setLight: number = 6          // 设置灯开关

  // 反馈结果
  public result_success: number = 0 // 成功

  /***************************************************************
   * 函数名称: constructor
   * 说    明: 类初始化时，触发该函数
   * 参    数: 无
   * 返 回 值: 无
   ***************************************************************/
  constructor() {
  }

  /***************************************************************
   * 函数名称: setDeviceId_Zero
   * 说    明: 将设备号配置为0
   * 参    数: 无
   * 返 回 值: 返回字符串
   ***************************************************************/
  setDeviceId_Zero(): string {
    let size: number = this.length_device_id
    let str: string = ""
    let i: number = 0

    for (i = 0; i < size; i++) {
      str += String.fromCharCode(0)
    }

    return str
  }

  /***************************************************************
   * 函数名称: print
   * 说    明: 打印报文
   * 参    数:
   *      @packet     协议包
   * 返 回 值: 无
   ***************************************************************/
  print(packet: string) {
    let value = this.parsePacket(packet)

    if (value.result != ProtocolResult.ProtocolResult_Success) {
      console.log("Protocol: print => packet length is error, length=" + packet.length)
      return
    }

    // 打印设备号
    let deviceId: string = value.deviceId
    console.log("Protocol: device id => " + deviceId)
    // 打印设备类型
    let deviceType: number = value.deviceType
    console.log("Protocol: device type => " + deviceType)
    // 打印命令类型
    let cmd: number = value.command
    console.log("Protocol: cmd => " + cmd)
    // 打印返回值
    let res: number = value.result
    console.log("Protocol: result => " + res)
    // 打印数据部分
    let data = value.data
    console.log("Protocol: data => " + data)
    console.log("Protocol: data.charCodeAt() => " + data.charCodeAt(0))
  }

  /***************************************************************
   * 函数名称: composePacket
   * 说    明: 组建报文
   * 参    数:
   *      @deviceId     设备编号
   *      @deviceType   设备类型
   *      @cmd          命令类型
   *      @result       报文结果
   *      @data         数据内容
   * 返 回 值:
   *      @result       返回结果，true为成功，false为失败
   *      @packet       返回协议包
   ***************************************************************/
  composePacket(deviceId: string, deviceType: number, cmd: number, result: number, data: string): { result: number, packet: string } {
    let res: number = ProtocolResult.ProtocolResult_Success
    let packet_string: string = ""

    // 加入设备号
    if (deviceId.length < this.length_device_id) {
      // 设备号的字符串长度小于要求长度
      let i: number = 0
      packet_string = deviceId
      for (i = 0; i < (this.length_device_id - deviceId.length); i++) {
        packet_string += String.fromCharCode(0)
      }
      packet_string += deviceId
    } else if (deviceId.length > this.length_device_id) {
      // 设备号的字符串长度大于要求长度
      packet_string = deviceId.substr(this.offset_device_id, this.length_device_id)
    } else {
      packet_string = deviceId
    }
    // 加入设备类型
    let type_h: number = (deviceType >> 8) & 0xFF
    let type_l: number = deviceType & 0xFF
    packet_string += String.fromCharCode(type_h)
    packet_string += String.fromCharCode(type_l)
    // 加入命令
    let cmd_h: number = (cmd >> 8) & 0xFF
    let cmd_l: number = cmd & 0xFF
    packet_string += String.fromCharCode(cmd_h)
    packet_string += String.fromCharCode(cmd_l)
    // 加入返回值
    result = result & 0xFF
    packet_string += String.fromCharCode(result)
    // 添加数据部分
    packet_string += data

    return { result: res, packet: packet_string }
  }

  /***************************************************************
   * 函数名称: parsePacket
   * 说    明: 解析协议报文
   * 参    数:
   *        @packet       协议报文
   * 返 回 值:
   *        @deviceId     返回设备编号
   *        @deviceType   返回设备类型
   *        @command      返回命令类型
   *        @result       返回结果，true为成功，false为失败
   *        @data         数据内容
   ***************************************************************/
  parsePacket(packet: string): { deviceId: string, deviceType: number, command: number, result: number, data: string } {
    let id: string = ""
    let type: number = 0
    let cmd: number = 0
    let res: number = ProtocolResult.ProtocolResult_Success
    let da: string = ""

    if (packet.length < 16) {
      res = ProtocolResult.ProtocolResult_PacketLength
      return { deviceId: id, deviceType: type, command: cmd, result: res, data: da }
    } else {
      // 获取设备号
      id = packet.substr(this.offset_device_id, this.length_device_id)
      // 获取设备类型
      let type_str: string = packet.substr(this.offset_device_type, this.length_device_type)
      let type_h: number = type_str.charCodeAt(0)
      let type_l: number = type_str.charCodeAt(1)
      type = (type_h << 8) + (type_l)
      // 获取命令
      let cmd_str: string = packet.substr(this.offset_cmd, this.length_cmd)
      let cmd_h: number = cmd_str.charCodeAt(0)
      let cmd_l: number = cmd_str.charCodeAt(1)
      cmd = (cmd_h << 8) + (cmd_l)
      // 获取返回值
      let res_str: string = packet.substr(this.offset_result, this.length_result)
      res = res_str.charCodeAt(0)
      // 获取数据内容
      da = packet.substr(this.offset_data, packet.length - this.offset_data)
    }
    return { deviceId: id, deviceType: type, command: cmd, result: res, data: da }
  }

  /***************************************************************
   * 函数名称: findDevice
   * 说    明: 搜索设备号
   * 参    数: 无
   * 返 回 值:
   *        @result   返回结果，true为成功，false为失败
   *        @packet   返回协议包
   ***************************************************************/
  findDevice(): { result: number, packet: string } {
    let deviceId: string = this.setDeviceId_Zero()
    let value = this.composePacket(deviceId, this.deviceType_WisdomHouse, this.cmd_findDevice, ProtocolResult.ProtocolResult_Success, "")
    return { result: value.result, packet: value.packet }
  }

  /***************************************************************
   * 函数名称: findDeviceRsp
   * 说    明: 解析搜索设备号的反馈包
   * 参    数:
   *        @packet     返回协议包
   * 返 回 值:
   *        @result     返回结果，true为成功，false为失败
   *        @deviceId   设备编号
   ***************************************************************/
  findDeviceRsp(packet: string): { result: number, deviceId: string } {
    let value = this.parsePacket(packet)
    return { result: value.result, deviceId: value.deviceId }
  }


  /***************************************************************
   * 函数名称: reportHouseStatus
   * 说    明: 上报智慧小屋状态
   * 参    数:
   *        @packet       返回协议包
   * 返 回 值:
   *        @result       返回结果，true为成功，false为失败
   *        @deviceId     返回设备编号
   *        @temperator   返回智慧小屋的温度
   *        @humidity     返回智慧小屋的湿度
   *        @lumination   返回智慧小屋的光照强度
   *        @is_rain      返回智慧小屋的是否下雨
   *        @is_smoke     返回智慧小屋的烟雾报警
   *        @is_fire      返回智慧小屋的火宅报警
   ***************************************************************/
  reportHouseStatus(packet: string): { result: number, deviceId: string, temperator: number, humidity: number, lumination: number, is_rain: number, is_smoke: number, is_fire: number  } {
    let res: number = ProtocolResult.ProtocolResult_Success
    let id: string = ''
    let temp: number = 0
    let hum: number = 0
    let lum: number = 0
    let rain: number = 0
    let smoke: number = 0
    let fire: number = 0
    let offset: number = this.offset_data
    let length: number = 9
    let temp_number: number = 0

    let value = this.parsePacket(packet)

    if (value.result != ProtocolResult.ProtocolResult_Success) {
      console.log("Protocol: reportHouseStatus => result is error")
      res = value.result
    } else if (packet.length != (offset + length)) {
      console.log("Protocol: reportHouseStatus => packet.length=" + packet.length + " is error")
      res = ProtocolResult.ProtocolResult_PacketLength
    } else {
      // 获取返回值
      res = value.result
      // 设备号
      id = value.deviceId
      // 获取温度
      temp_number = (packet.charCodeAt(offset) << 8)
      temp_number += packet.charCodeAt(offset + 1)
      temp = temp_number / 100
      // 获取湿度
      temp_number = (packet.charCodeAt(offset + 2) << 8)
      temp_number += packet.charCodeAt(offset + 3)
      hum = temp_number / 100
      // 获取光照
      temp_number = (packet.charCodeAt(offset + 4) << 8)
      temp_number += packet.charCodeAt(offset + 5)
      lum = temp_number / 100
      // 获取下雨报警
      rain = packet.charCodeAt(offset + 6)
      // 获取烟雾报警
      smoke = packet.charCodeAt(offset + 7)
      // 获取火灾报警
      fire = packet.charCodeAt(offset + 8)
    }

    return { result: res, deviceId: id, temperator: temp, humidity: hum, lumination: lum, is_rain: rain, is_smoke: smoke, is_fire: fire }
  }

  /***************************************************************
   * 函数名称: setDoor
   * 说    明: 设置门开关
   * 参    数:
   *        @deviceId     设备编号
   *        @door_status  门开关状态
   * 返 回 值:
   *        @result       返回结果，true为成功，false为失败
   *        @packet       返回协议包
   ***************************************************************/
  setDoor(deviceId: string, door_status: number): { result: number, packet: string } {
    let door_str: string = String.fromCharCode(door_status)
    let value = this.composePacket(deviceId, this.deviceType_WisdomHouse, this.cmd_setDoor, ProtocolResult.ProtocolResult_Success, door_str)

    return { result: value.result, packet: value.packet }
  }

  // 反馈门开关
  /***************************************************************
   * 函数名称: findDevice
   * 说    明: 搜索设备号
   * 参    数:
   *        @packet       协议包
   * 返 回 值:
   *        @result       返回结果，true为成功，false为失败
   *        @deviceId     返回设备编号
   *        @door_status  返回门开关状态
   ***************************************************************/
  setDoorRsp(packet: string): { result: number, deviceId: string, door_status: number } {
    if (packet.length != 18) {
      return { result: ProtocolResult.ProtocolResult_PacketLength, deviceId: "", door_status: 0 };
    } else {
      let value = this.parsePacket(packet)
      if (value.deviceType != this.deviceType_WisdomHouse) {
        return { result: ProtocolResult.ProtocolResult_PacketDeviceId, deviceId: "", door_status: 0 };
      }
      if (value.command != this.cmd_setDoor) {
        return { result: ProtocolResult.ProtocolResult_PacketCmd, deviceId: "", door_status: 0 };
      }

      let str: string = value.data
      let status: number = str.charCodeAt(0)
      return { result: value.result, deviceId: value.deviceId, door_status: status };
    }
  }

  // 设置车库开关
  setGarageDoor(deviceId: string, garage_status: number) : { result: number, packet: string } {
    let status_str: string = String.fromCharCode(garage_status)
    let value = this.composePacket(deviceId, this.deviceType_WisdomHouse, this.cmd_setGarageDoor, ProtocolResult.ProtocolResult_Success, status_str)

    return { result: value.result, packet: value.packet }
  }

  // 反馈车库门开关
  setGarageDoorRsp(packet: string): { result: number, deviceId: string, door_status: number } {
    if (packet.length != 18) {
      return { result: ProtocolResult.ProtocolResult_PacketLength, deviceId: "", door_status: 0 };
    } else {
      let value = this.parsePacket(packet)
      if (value.deviceType != this.deviceType_WisdomHouse) {
        return { result: ProtocolResult.ProtocolResult_PacketDeviceId, deviceId: "", door_status: 0 };
      }
      if (value.command != this.cmd_setGarageDoor) {
        return { result: ProtocolResult.ProtocolResult_PacketCmd, deviceId: "", door_status: 0 };
      }

      let str: string = value.data
      let status: number = str.charCodeAt(0)
      return { result: value.result, deviceId: value.deviceId, door_status: status };
    }
  }

  // 设置窗门开关
  setWindow(deviceId: string, window_status: number) : { result: number, packet: string } {
    let status_str: string = String.fromCharCode(window_status)
    let value = this.composePacket(deviceId, this.deviceType_WisdomHouse, this.cmd_setWindow, ProtocolResult.ProtocolResult_Success, status_str)

    return { result: value.result, packet: value.packet }
  }

  // 反馈窗门开关
  setWindowRsp(packet: string): { result: number, deviceId: string, window_status: number } {
    if (packet.length != 18) {
      return { result: ProtocolResult.ProtocolResult_PacketLength, deviceId: "", window_status: 0 };
    } else {
      let value = this.parsePacket(packet)
      if (value.deviceType != this.deviceType_WisdomHouse) {
        return { result: ProtocolResult.ProtocolResult_PacketDeviceId, deviceId: "", window_status: 0 };
      }
      if (value.command != this.cmd_setWindow) {
        return { result: ProtocolResult.ProtocolResult_PacketCmd, deviceId: "", window_status: 0 };
      }

      let str: string = value.data
      let status: number = str.charCodeAt(0)
      return { result: value.result, deviceId: value.deviceId, window_status: status };
    }
  }

  // 设置灯开关
  setLight(deviceId: string, light_status: number) : { result: number, packet: string } {
    let status_str: string = String.fromCharCode(light_status)
    let value = this.composePacket(deviceId, this.deviceType_WisdomHouse, this.cmd_setLight, ProtocolResult.ProtocolResult_Success, status_str)

    return { result: value.result, packet: value.packet }
  }

  setLightRsp(packet: string): { result: number, deviceId: string, light_status: number } {
    if (packet.length != 18) {
      return { result: ProtocolResult.ProtocolResult_PacketLength, deviceId: "", light_status: 0 };
    } else {
      let value = this.parsePacket(packet)
      if (value.deviceType != this.deviceType_WisdomHouse) {
        return { result: ProtocolResult.ProtocolResult_PacketDeviceId, deviceId: "", light_status: 0 };
      }
      if (value.command != this.cmd_setLight) {
        return { result: ProtocolResult.ProtocolResult_PacketCmd, deviceId: "", light_status: 0 };
      }

      let str: string = value.data
      let status: number = str.charCodeAt(0)
      return { result: value.result, deviceId: value.deviceId, light_status: status };
    }
  }
}
export default new Protocol()