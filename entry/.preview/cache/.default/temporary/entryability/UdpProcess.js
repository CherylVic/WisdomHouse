import socket from '@ohos:net.socket';
import wifi from '@ohos:wifi';
import Protocol, { ProtocolResult } from '@bundle:com.example.wisdomhouse_cloud/entry/ets/entryability/Protocol';
// UDP收发类
class UdpProcess {
    /***************************************************************
     * 函数名称: constructor
     * 说    明: 类初始化时，触发该函数
     *          初始化TCP，并配置接收回调函数
     * 参    数: 无
     * 返 回 值: 无
     ***************************************************************/
    constructor() {
        this.remote_port = 8888; // 智慧小屋模型的监听端口号
        this.local_port = 9999; // APP的本地监听端口
        // 保存当前被选中的智慧小屋模型
        this.remote_device_select = 0;
        /***************************************************************
         * 函数名称: recv_message
         * 说    明: UDP协议报文接收响应函数
         * 参    数:
         *      @value      接收到的协议包信息，它包括<message: ArrayBuffer, remoteInfo: SocketRemoteInfo>
         * 返 回 值: 无
         ***************************************************************/
        this.recv_message = value => {
            console.log("UdpProcess => recv message: " + this.arrayBuffer2String(value.message));
            console.log("UdpProcess => remote: " + JSON.stringify(value.remoteInfo));
            let message = this.arrayBuffer2String(value.message);
            // 解包
            let packet = Protocol.parsePacket(message);
            if (packet.result != ProtocolResult.ProtocolResult_Success) {
                console.log("UdpProcess: Protocol.parsePacket failed and result = ", packet.result);
                return;
            }
            this.remoteInfoPrint();
            console.log("UdpProcess: packet.command = " + packet.command);
            switch (packet.command) {
                case Protocol.cmd_findDevice:
                    // 添加远端IP地址信息
                    this.remoteInfoAdd(value.remoteInfo, packet.deviceId);
                    break;
                case Protocol.cmd_reportHouseStatus:
                    let data = Protocol.reportHouseStatus(message);
                    if (data.result !== ProtocolResult.ProtocolResult_Success) {
                        console.log("UdpProcess: cmd_reportHouseStatus and reesult is error");
                        return;
                    }
                    let i;
                    for (i = 0; i < this.remote_device_status.length; i++) {
                        if (value.remoteInfo.address == this.remote_device_status[i].remote_info.address) {
                            this.remote_device_status[i].temperator = data.temperator;
                            this.remote_device_status[i].humidity = data.humidity;
                            this.remote_device_status[i].lumination = data.lumination;
                            this.remote_device_status[i].is_rain = data.is_rain;
                            this.remote_device_status[i].is_smoke = data.is_smoke;
                            this.remote_device_status[i].is_fire = data.is_fire;
                            return;
                        }
                    }
                    if (i >= this.remote_device_status.length) {
                        this.remote_device_status.push({ remote_info: value.remoteInfo,
                            deviceId: data.deviceId,
                            temperator: data.temperator,
                            humidity: data.humidity,
                            lumination: data.lumination,
                            is_rain: data.is_rain,
                            is_smoke: data.is_smoke,
                            is_fire: data.is_fire
                        });
                    }
                    break;
                case Protocol.cmd_setDoor:
                    break;
                case Protocol.cmd_setGarageDoor:
                    break;
                case Protocol.cmd_setWindow:
                    break;
                case Protocol.cmd_setLight:
                    break;
                default:
                    console.log("UdpProcess: packet.command " + packet.command + " out of the range");
                    break;
            }
        };
        this.udp = socket.constructUDPSocketInstance();
        this.local_ipaddr = this.ipNumber2String(wifi.getIpInfo().ipAddress);
        // 清空远端的IP地址信息
        this.remote_device_status = [];
        // 接收数据
        this.udp.on('message', this.recv_message);
        // 开启监听
        this.udp.on('listening', this.listening);
        // 开启监听
        console.log("UdpProcess: local_ipaddr => " + this.local_ipaddr);
        this.udp.bind({ address: "0.0.0.0", port: this.local_port, family: 1 }, err => {
            if (err) {
                console.log("netstatus: bind failed");
            }
            else {
                console.log("netstatus: bind success");
            }
        });
    }
    /***************************************************************
     * 函数名称: Init
     * 说    明: 初始化类
     * 参    数: 无
     * 返 回 值: 无
     ***************************************************************/
    Init() {
        this.remote_device_status = [];
    }
    /***************************************************************
     * 函数名称: ipNumber2String
     * 说    明: 将数字的IP地址转化为字符串
     * 参    数:
     *      @ip   数字化的IP地址
     * 返 回 值: 返回字符串化的IP地址
     ***************************************************************/
    ipNumber2String(ip) {
        if (ip < 0 || ip > 0xFFFFFFFF) {
            throw ("The number is not normal!");
        }
        return (ip >>> 24) + "." + (ip >> 16 & 0xFF) + "." + (ip >> 8 & 0xFF) + "." + (ip & 0xFF);
    }
    // 解析ArrayBuffer
    /***************************************************************
     * 函数名称: arrayBuffer2String
     * 说    明: 解析ArrayBuffer，将其转化为字符串
     * 参    数:
     *      @message    ArrayBuffer类型的数据内容
     * 返 回 值: 返回字符串化的数据内容
     ***************************************************************/
    arrayBuffer2String(message) {
        if (message instanceof ArrayBuffer) {
            let dataView = new DataView(message);
            let str = "";
            for (let i = 0; i < dataView.byteLength; ++i) {
                let c = String.fromCharCode(dataView.getUint8(i));
                str += c;
            }
            return str;
        }
    }
    // 将String转化为ArrayBuffer
    /***************************************************************
     * 函数名称: string2ArrayBuffer
     * 说    明: 将String转化为ArrayBuffer
     * 参    数:
     *      @str    字符串类型的协议报文
     * 返 回 值: 返回ArrayBuffer类型的协议报文
     ***************************************************************/
    string2ArrayBuffer(str) {
        var bytes = new Array();
        var len, c;
        len = str.length;
        for (var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            }
            else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            }
            else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            }
            else {
                bytes.push(c & 0xFF);
            }
        }
        var array = new Int8Array(bytes.length);
        for (var i = 0; i <= bytes.length; i++) {
            array[i] = bytes[i];
        }
        return array.buffer;
    }
    /***************************************************************
     * 函数名称: remoteInfoAdd
     * 说    明: 添加到客户端的IP地址
     * 参    数:
     *      @remoteInfo   数字化的IP地址
     *      @deviceId     智慧小屋的设备编号
     * 返 回 值: 无
     ***************************************************************/
    remoteInfoAdd(remoteInfo, deviceId) {
        let i = 0;
        // 检查是否已有
        for (i = 0; i < this.remote_device_status.length; i++) {
            if (deviceId === this.remote_device_status[i].deviceId) {
                // 相同的IP地址
                return;
            }
        }
        // 数组中没有，则添加
        this.remote_device_status.push({
            remote_info: remoteInfo,
            deviceId: deviceId,
            temperator: 25,
            humidity: 25,
            lumination: 25,
            is_rain: 0,
            is_smoke: 0,
            is_fire: 0
        });
    }
    /***************************************************************
     * 函数名称: remoteInfoPrint
     * 说    明: 打印所有的远端的IP地址
     * 参    数: 无
     * 返 回 值: 无
     ***************************************************************/
    remoteInfoPrint() {
        let i = 0;
        // 打印所有
        console.log("UdpProcess: remoteInfo.length = " + this.remote_device_status.length);
        for (i = 0; i < this.remote_device_status.length; i++) {
            console.log("UdpProcess: " + i
                + " => address = " + this.remote_device_status[i].remote_info.address
                + ", deviceId = " + this.remote_device_status[i].deviceId);
        }
    }
    /***************************************************************
     * 函数名称: listening
     * 说    明: 监听响应函数
     * 参    数: 无
     * 返 回 值: 无
     ***************************************************************/
    listening() {
        console.log("UdpProcess => listening success");
    }
    /***************************************************************
     * 函数名称: send
     * 说    明: 发送协议报文
     * 参    数:
     *      @remote_ipaddr  智慧小屋的IP地址
     *      @remote_port    智慧小屋的监听端口
     *      @message        准备发送给智慧小屋的协议报文
     * 返 回 值: 无
     ***************************************************************/
    send(remote_ipaddr, remote_port, message) {
        this.udp.send({
            data: this.string2ArrayBuffer(message),
            address: {
                address: remote_ipaddr,
                port: remote_port,
                family: 1
            }
        }, error => {
            if (error) {
                console.log("UdpProcess: send failed and ip(" + remote_ipaddr + "), port(" + remote_port + "), message(" + message + ")");
            }
            else {
                //console.log("UdpProcess: send success")
            }
        });
    }
    /***************************************************************
     * 函数名称: close
     * 说    明: 关闭通信
     * 参    数: 无
     * 返 回 值: 无
     ***************************************************************/
    close() {
        this.udp.close(error => {
            if (error) {
                console.log("UdpProcess: close failed");
            }
            else {
                console.log("UdpProcess: close success");
            }
        });
    }
    /***************************************************************
     * 函数名称: findOffsetFromDeviceId
     * 说    明: 根据deviceId查找remote_device_status列表中的位移位置
     * 参    数:
     *        @deviceId     智慧小屋的设备编号
     * 返 回 值: 返回remote_device_status列表中的位移位置。如为-1则失败。
     ***************************************************************/
    findOffsetFromDeviceId(deviceId) {
        let i = 0;
        for (i = 0; i < this.remote_device_status.length; i++) {
            if (deviceId == this.remote_device_status[i].deviceId) {
                return i;
            }
        }
        return (-1);
    }
    /***************************************************************
     * 函数名称: findDevice
     * 说    明: 查找局域网内的所有智慧小屋设备
     * 参    数: 无
     * 返 回 值: 无
     ***************************************************************/
    findDevice() {
        let i = 0;
        let ip;
        var ip_address = this.local_ipaddr.split('.', 3);
        let value = Protocol.findDevice();
        // 清除当前发现的设备
        this.remote_device_status = [];
        console.log("UdpProcess: value.packet = " + value.packet);
        for (i = 0; i < value.packet.length; i++) {
            console.log("UdpProcess: [" + i + "] = " + value.packet.charCodeAt(i));
        }
        console.log("UdpProcess: " + ip_address[0] + " " + ip_address[1] + " " + ip_address[2]);
        for (i = 1; i < 255; i++) {
            ip = ip_address[0] + '.' + ip_address[1] + '.' + ip_address[2] + '.' + i.toLocaleString();
            //console.log("UdpProcess: send to " + ip)
            this.send(ip, this.remote_port, value.packet);
            //this.send(ip, this.remote_port, "Hello World!")
        }
    }
    /***************************************************************
     * 函数名称: setDoor
     * 说    明: 设置门开关
     * 参    数:
     *      @deviceId     智慧小屋的设备编号
     *      @door_status  门开关状态，0为关闭，1为开启
     * 返 回 值: 0为成功，反之为失败
     ***************************************************************/
    setDoor(deviceId, door_status) {
        let offset = this.findOffsetFromDeviceId(deviceId);
        if (offset < 0) {
            console.error("UdpProcess: offset = " + offset);
            return ProtocolResult.ProtocolResult_SelectError;
        }
        let value = Protocol.setDoor(deviceId, door_status);
        if (value.result != ProtocolResult.ProtocolResult_Success) {
            console.error("UdpProcess: result = " + value.result);
            return value.result;
        }
        console.log("UdpProcess: remote_address=" + this.remote_device_status[offset].remote_info.address);
        console.log("UdpProcess: remote_port=" + this.remote_port);
        this.send(this.remote_device_status[offset].remote_info.address, this.remote_port, value.packet);
        return ProtocolResult.ProtocolResult_Success;
    }
    /***************************************************************
     * 函数名称: setGarageDoor
     * 说    明: 设置车库开关
     * 参    数:
     *      @deviceId       智慧小屋的设备编号
     *      @garage_status  车库开关状态，0为关闭，1为开启
     * 返 回 值: 0为成功，反之为失败
     ***************************************************************/
    setGarageDoor(deviceId, garage_status) {
        let offset = this.findOffsetFromDeviceId(deviceId);
        if (offset < 0) {
            console.error("UdpProcess: offset = " + offset);
            return ProtocolResult.ProtocolResult_SelectError;
        }
        let value = Protocol.setGarageDoor(deviceId, garage_status);
        if (value.result != ProtocolResult.ProtocolResult_Success) {
            console.error("UdpProcess: result = " + value.result);
            return value.result;
        }
        console.log("UdpProcess: remote_address=" + this.remote_device_status[offset].remote_info.address);
        console.log("UdpProcess: remote_port=" + this.remote_port);
        this.send(this.remote_device_status[offset].remote_info.address, this.remote_port, value.packet);
        return ProtocolResult.ProtocolResult_Success;
    }
    /***************************************************************
     * 函数名称: setWindow
     * 说    明: 设置窗门开关
     * 参    数:
     *      @deviceId       智慧小屋的设备编号
     *      @window_status  门窗开关状态，0为关闭，1为开启
     * 返 回 值: 0为成功，反之为失败
     ***************************************************************/
    setWindow(deviceId, window_status) {
        let offset = this.findOffsetFromDeviceId(deviceId);
        if (offset < 0) {
            console.error("UdpProcess: offset = " + offset);
            return ProtocolResult.ProtocolResult_SelectError;
        }
        let value = Protocol.setWindow(deviceId, window_status);
        if (value.result != ProtocolResult.ProtocolResult_Success) {
            console.error("UdpProcess: result = " + value.result);
            return value.result;
        }
        console.log("UdpProcess: remote_address=" + this.remote_device_status[offset].remote_info.address);
        console.log("UdpProcess: remote_port=" + this.remote_port);
        this.send(this.remote_device_status[offset].remote_info.address, this.remote_port, value.packet);
        return ProtocolResult.ProtocolResult_Success;
    }
    /***************************************************************
     * 函数名称: setLight
     * 说    明: 设置灯开关
     * 参    数:
     *      @deviceId       智慧小屋的设备编号
     *      @light_status   窗门开关状态，0为关闭，1为开启
     * 返 回 值: 0为成功，反之为失败
     ***************************************************************/
    setLight(deviceId, light_status) {
        let offset = this.findOffsetFromDeviceId(deviceId);
        if (offset < 0) {
            console.error("UdpProcess: offset = " + offset);
            return ProtocolResult.ProtocolResult_SelectError;
        }
        let value = Protocol.setLight(deviceId, light_status);
        if (value.result != ProtocolResult.ProtocolResult_Success) {
            console.error("UdpProcess: result = " + value.result);
            return value.result;
        }
        console.log("UdpProcess: remote_address=" + this.remote_device_status[offset].remote_info.address);
        console.log("UdpProcess: remote_port=" + this.remote_port);
        this.send(this.remote_device_status[offset].remote_info.address, this.remote_port, value.packet);
        return ProtocolResult.ProtocolResult_Success;
    }
}
export default new UdpProcess();
